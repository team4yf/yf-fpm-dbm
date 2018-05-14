var _ = require('lodash');
var each = require('async/each');
var E = require('../error.js');

var _options = {
  showSql : true,
  logger: console,
};

//可能会注入的关键字
var keyWords = ['drop ','delete ','truncate ',';','insert ','update ','set ','use '];

function getValue(val){
  //如果是string类型添加单引号
  if(_.isString(val)){
    return `'${val}'`;
  }
  return val;
}

//解析排序规则
function parseSort(sort){
  return sort.replace('-',' desc').replace('+',' asc');
}

//将json转换成 sql 中的插入语句
function parseRows(row){
  if(_.isArray(row)){
    //多条数据
    //获取所有的values
    var valArr = _.map(row, function(item){
      return  '('+ _.map(item, getValue).join(',') + ')'; 
    })
    //获取第一个数据的字段名称
    var keys = _.keys(row[0]);
    //拼接sql语句
    return  '(' + keys.join(',') +') values '+ valArr.join(',');
  }else if(_.isObject(row)){
    //单个数据
    var keys = _.keys(row);           //获取键的列表
    var vals = _.map(row, getValue);  //获取值得列表，并将字符串添加单引号
    return  '(' + keys.join(',') +') values ('+ vals.join(',') + ')'; //将列表join为sql语句
  }else{
    //TODO: throw new Error(E.DATA_TYPE_ERROR); 
  }
}

/**
 * 排除注入的脚本信息
 * @param src
 */
function exceptInjection(src){
  var data = _.clone(src);
  //无意义的数据，直接返回
  if(_.isEmpty(data)){
    return false;
  }
  //将数据转换成 String 类型
  if(_.isObject(data)){
    data = JSON.stringify(data);
  }else if(_.isArray(data)){
    //将数组中的数据进行字符串化并join成一个字符串
    data = _.map(data, function(item){
      if(_.isObject(item)){
        return JSON.stringify(item);
      } 
      if(_.isNumber(item)){
        return '' + item;
      }
      return item;
    }).join(',');
  }else if(_.isNumber(data)){
    data = '' + data;
  }
  data = data.toLowerCase();
  for(var i in keyWords){
    var k = keyWords[i];
    if(data.indexOf(k)>-1){
      return true;
    }
  }
  return false;
}


/**
[
['city','=','010'],
['and',['logintime','>',144334343]],
['or',['nickname','like','%xxx%']],
]
*/
function parseCondition(where){
  if(_.isEmpty(where)){
    return ' 1 = 1 ';
  }
  if(_.isString(where)){
    return where;
  }
  if(_.isObject(where)){
    var _condition = ' 1=1 ';
    _.map(where, function(val, key){
      _condition += ' and ' + key + ' = ' + getValue(val);
    });
    return _condition ;
  }
  if(_.isArray(where)){
    var _condition = ' 1 = 1 ';
    var _keywords = ['and','or'];
    var _key,_operater,_value,_logic;
    _.map(where,function(item){
      if(_.isString(item)){
        _condition = _condition + ' and ' + item;
      }else if(_.isArray(item)){
        var _key = item[0];
        if(_.includes(_keywords,_key)){
          //正常的条件语句，通过and进行拼接
          _logic = item[0];
          _key = item[1][0];
          _operater = item[1][1];
          _value = item[1][2];
        }else{
          //正常的条件语句，通过and进行拼接
          _operater = item[1];
          _value = item[2];
          _logic = 'and'
        }
        _logic = ' ' + _logic + ' ';
        _condition = _condition + _logic + _key + _operater + getValue(_value);
      }
    });
    return _condition;
  }
}

//执行原生的查询sql
function parseSql(action,args){
    var sql = '';
    var table = args.table || '';
    var condition = args.condition || ' 1 = 1 ';
    var field_column = args.fields || ' * ';
    if(exceptInjection(table)
        || exceptInjection(condition)
        || exceptInjection(field_column)
        || exceptInjection(args.limit)
        || exceptInjection(args.skip)
        || exceptInjection(args.sort)
        || exceptInjection(args.id)
        || exceptInjection(args.row)
    ){
        return false;
    }

    //condition链接上假删除的筛选条件
    condition  = '('+ parseCondition(condition) +') and delflag = 0';

    switch(action){
        case "count":
            sql = "select count(*) as c from " + table + ' where '+ condition;
            break;
        case "select":
            var limit = parseInt(args.limit || 10);
            var skip = parseInt(args.skip || 0);
            var sort = parseSort(args.sort || 'id- ');
            sql = 'select '+ field_column +' from ' + table + ' where ' + condition + ' order by ' + sort  + ' limit '+ skip + ',' + (limit);
            break;
        case "first":
            var skip = parseInt(args.skip || 0);
            var sort = parseSort(args.sort || 'id- ');
            sql = 'select '+ field_column +' from ' + table + ' where ' + condition + ' order by ' + sort  + ' limit '+ skip + ',' + (1);
            break;
        case "get":
            sql = 'select '+ field_column +' from ' + table + ' where delflag = 0 and id = ' + args.id;
            break;
        case "remove":
            //替换成假删除
            sql = "update " + table + ' set delflag = 1 , updateAt = '+ _.now() +' where delflag = 0 and id = ' + args.id ;
            // 放弃删除语句
            // sql = 'delete from ' + table + ' where id = ' + args.id;
            break;
        case "clear":
            //替换成假删除
            sql = "update " + table + ' set delflag = 1 , updateAt = '+ _.now() +' where ' + condition;
            // 放弃删除语句
            //sql = 'delete from ' + table + ' where ' + condition;
            break;
        case "insert":
            var row = args.row;
            sql = 'insert into ' + table + parseRows(row);
            break;
        case "update":
            var row = args.row;
            var arr = _.map(row, function(val, k){
              return k + '=' + getValue(val);
            })
            var modify = arr.join(',');
            sql = "update " + table + ' set ' + modify + ' where ' + condition ;
            break;
    }
    if(_options.showSql){
      _options.logger.info('The Last SQL:\n' + sql);
    }
    return sql;
}

function commandSql(conn, sql, cb){
  //获取有效的db链接
  conn.getConn(function(err1, connection){
    if(err1){
      cb(E.CONNECT_ERROR);
      return false;
    }
    connection.query(sql, function(err2, res) {
      if(!conn.isTrans){
        connection.release();
      }
      if(err2){
        cb(err2);
        return false;
      }
      //message字段没有什么意义
      if(_.has(res, 'message')){
        delete res.message;
      }
      //返回执行结果
      cb(null, res);
    });
  });
}
/**
* @param conn 数据库连接适配器
* @param action  数据操作方式,包含：create,find,count等提供的默认函数
* @param args    操作的所有参数, table,condition,fields 等等，用于生成sql语句的一些必要选项
* @param cb      操作的回调函数, 符合常规的标准, (error, data)的回调模式
*/

function executeSql(conn, action, args, cb){
  //查询的表未设置
  if(!args.table){
    cb(E.TABLE_REQUIRED);
    return false;
  }
  var sql = parseSql(action, args);
  if(sql === false){
    //存在sql注入
    cb(E.SQL_INJECTION);
    return false;
  }

  commandSql(conn, sql , cb);
    
}

function Conn(conn, isTrans, adapter){
  this._conn = conn;
  this.isTrans = isTrans;
  this.adapter = adapter;

  this.getConn = function(cb){
    if(this._conn && this.isTrans){
      cb(null, this._conn);
    }else{
      var self = this;
      adapter.getConnection(function(err, conn){
        self._conn = conn;
        cb(err, conn);
      })
    }
  }
  this.commit = function(cb) {
    if(this._conn){
      this._conn.commit(function(err) {
        if(err){
          if(cb){
            cb(err);
          }
          return;
        }
        this._conn = null;
        cb();
      });
    }else{
      if(cb){
        cb(E.CONNECTION_IS_NULL);
        return false;
      }
    }
  }

  this.rollback = function (cb) {
    if(this._conn){
      this._conn.rollback(function(){
        if(cb){
          cb();
        }
      });
    }else{
      cb(E.CONNECTION_IS_NULL);
      return false;
    }
  }
}

/**
* conn typeof Conn
*/
function executer(conn){

  var count = function (args, cb) {
    executeSql(conn,'count', args, function(error, data){
      if(error){ cb(error); return; }
      cb(null, data[0]['c']);
    });
  };
  var find = function (args, cb) {
    executeSql(conn,'select', args ,function(error, data){
      if(error){ cb(error); return; }
      cb(null, data);
    });
  };

  return {
    conn: conn,
    //查询列表
    find: find,
    count: count,

    transation: function(cb){
      conn.adapter.getConnection(function(err, connection){
        connection.beginTransaction(function(e){
          if(e){
            cb(e)
          }else{
            cb(err, executer(new Conn(connection, true)))
          }
        })
      })
    },
    commit: function(cb){
      if(conn){
        conn.commit(cb)
      }else{
        cb()
      }
    },
    rollback: function(cb){
      if(conn){
        conn.rollback(cb)
      }else{
        cb()
      }

    },
    //查询列表并且返回整体的数据条数
    findAndCount: function (args, cb) {
      count(args, function(error1, c){
        if(error1){ cb(error1); return; }
        find(args, function(error2, data){
          if(error2){ cb(error2); return; }
          cb(null, {count: c, rows: data});
        });
      });
    } ,
    //查询符合条件的首个记录
    first: function (args, cb) {
      executeSql(conn, 'first', args, function (error, list) {
        if(error){ cb(error); return; }
        if (list.length >= 1) {
          cb(null, list[0]);
          return;
        }
        cb(null, {});
      });
    },
    create: function (args, cb) {
      executeSql(conn, 'insert', args, function(error, newRow){
        if(error){ cb(error); return; }
        newRow.id = newRow.insertId;
        cb(null, newRow);
      });
    },
    //更新数据
    update: function (args, cb) {
        executeSql(conn, 'update', args, function(error, data){
          if(error){ cb(error); return; }
          if(data.affectedRows < 1){
            cb(E.UPDATE_ERROR);
            //未更新到任何数据,抛出异常
          }else{
            cb(null, data);
          }
        });
    },
    //通过id获取唯一的数据
    get: function (args, cb) {
      executeSql(conn, 'get', args, function (error, list) {
        if(error){ cb(error); return; }
        if (list.length === 1) {
          cb(null, list[0]);

        }else{
          //未找到数据或者找到了多条数据
          cb(E.OBJECT_ID_NOT_FIND);
        }
      });
    } ,
    //通过id删除符合条件的一条记录
    remove: function (args, cb) {
      executeSql(conn, 'remove', args, cb);
    } ,
    //删除若干数据
    clear: function (args, cb) {
      executeSql(conn, 'clear', args, cb);
    } ,
    //直接执行sql语句
    command: function(args, cb){
      commandSql(conn, args.sql, cb)
    }
  };
}

module.exports = function(adapter, options) {
  _options = _.extend(_options,options) ;
  var defaultConn = new Conn(null, false, adapter)
  return executer(defaultConn)
}