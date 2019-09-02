var Promise = require('bluebird');
var assert = require('assert');
var C = {
    host:'localhost',
    database:'fpm',
    username:'dbadmin',
    password:'741235896',
    showSql: true
};

var M = Promise.promisifyAll(require('../index.js')(C));

var command = 
  "CREATE TABLE `udf_tmp` \
  ( `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id', \
  `delflag` TINYINT NOT NULL DEFAULT '0' COMMENT 'delete flag', \
  `createAt` BIGINT NOT NULL COMMENT 'create time', \
  `updateAt` BIGINT NOT NULL COMMENT 'update time', \
  PRIMARY KEY (`id`) ) \
  ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 \
  COMMENT = 'template'"

describe('Fast DB M Command Tester', function() {

  describe('#create table()', function () {
    it('create a table', function (done) {
      M.commandAsync({sql: command})
        .then(function (data) {
          console.log(data);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });
});