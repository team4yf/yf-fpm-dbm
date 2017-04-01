var Promise = require('bluebird');
var expect = require('chai').expect;
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
          // expect(data).to.equal(1);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });

  // describe('#Drop Table()', function () {
  //   it('drop a table', function (done) {
  //     M.clearAsync({
  //       table: 'fpm_test',
  //       condition: { val: 'aaa'}})
  //       .then(function (data) {
  //         expect(data.affectedRows).to.be.above(2);
  //         done()
  //       }).catch(function (err) {
  //         done(err);
  //       });
  //   });
  // });
});