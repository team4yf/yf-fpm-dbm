## yf-fpm-dbm
> 快速极简的orm框架

* 源码地址: [https://github.com/team4yf/yf-fpm-dbm.git](https://github.com/team4yf/yf-fpm-dbm.git)
* 目前支持mysql
* 通过delflag实现逻辑删除
* 默认带有四个字段：id,createAt,updateAt,delflag
* 支持批量插入
* 支持事务处理
* TODO:存储过程，mongodb语法

### 0.Changelog

点击查看 [Changelog](CHANGELOG.md)

### 1.Installation
`
$ npm install yf-fpm-dbm
`
### 2.API List
* adapter

*获取原生的数据库适配器，可执行自定义的sql来满足一些复杂的业务操作*

* find

*通过一组查询、排序、分页的条件筛选一组数据结果。*

* first

*通过一组查询、排序、分页的条件筛选一行数据结果。*

* count

*通过筛选条件进行统计计数*

* findAndCount

*通过一组查询、排序、分页的条件筛选一组数据结果，并返回符合条件的所有数据行数*

* get

*通过数据的ID获取到唯一的数据*

* update

*修改一些数据*

* remove

*删除一条已知的数据*

* clear

*通过筛选条件删除一组数据*

* create

*添加一条或者多条数据*

### 3.Configuration
模块自带的一些配置信息：
* Code List 1:
```javascript
{
    host:'localhost',           //mysql host
    port:3306,                  //mysql port
    database:'test',            //mysql dbname
    user:'root',                //mysql username
    password:'',                //mysql password
    debug:false,                //true：使用 debug 模块输出 生成的sql语句，默认使用 DEBUG=SQL
    showSql:false,              //true：输出本模块生成的sql语句
    pool:{
        connectionLimit:10,     //链接池的配置
        queueLimit:0,
        waitForConnections:true
    }
}
```

在初始化的时候，可以通过传入的参数覆盖这些默认值
* Code List 2:
```javascript
var C = {
    host:'192.168.1.1',
    database:'test',
    username:'root',
    password:'root',
};
var M = require('yf-fpm-dbm')(C);
```

### 4.Useage

##### find
* Code List 3:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　condition: "delflag=0",
　fields: "id,article,ptags,product"
};
M.find(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```

##### first
* Code List 4:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　condition: "delflag=0",
　fields: "id,article,ptags,product"
};
M.first(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
//condition 字段接受各种格式
//比如下面的格式同样支持
var arg = {
    table: "api_app",
    condition: [
      ['appid' , '=' , '10001'],
      "appkey = '45883198abcdc109'",
      ['or',['appname' ,'=','DEV_Activity']]
    ],
    fields: "id,appid,appname,apptype"
};
//最终解析出来的语句是这样的：
// where ( 1 = 1  and appid='10001' and appkey = '45883198abcdc109' or appname='DEV_Activity') and delflag = 0
```

##### count
* Code List 5:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　condition: "delflag=0"
};
M.count(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```

##### findAndCount
* Code List 6:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　condition: "delflag=0",
　fields: "id,article,ptags,product"
};
M.first(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```

##### get
* Code List 7:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　id: 1
};
M.get(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```

##### update
* Code List 8:
修改所有key为test的val为123
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　condition: "key = 'test'",
    row:{val:"123"}
};
M.update(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```

##### remove
* Code List 9:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　id: 1
};
M.remove(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```

##### clear
* Code List 10:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　condition: "delflag=0"
};
M.clear(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```

##### create
* Code List 11:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　row: {key:"test",val:"mmm"}
};
M.create(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```
or  batch insert
* Code List 12:
```javascript
// M 的初始化代码请参看 Code List:2
var arg = {
　table: "test",
　row:[{key:"test",val:"mmm"},{key:"test2",val:"mmm2"}]
};
M.create(arg, function(error, data){
  if(error){
  　// do error here
  }else{
    // do success here
  }
});
```

### 4. Support Transaction

* Code List 13:
```javascript
// M 的初始化代码请参看 Code List:2
M.transation(function(err, atom){
  var arg = {
  　table: "test",
  　condition: "...",
    row: { ... }
  };
  atom.update(arg, function(err, result1){
    if(err){
      atom.rollback();
      return ;
    }
    arg = {
    　table: "test",
    　condition: "...",
      row:{ ... }
    };
    atom.update(arg, function(err, result2){
      if(err){
        atom.rollback(function(){
          //do rollback code
        });
      }else{
        atom.commit(function(err){
          // do commit code
        });
      }
    });
  });
});
```
