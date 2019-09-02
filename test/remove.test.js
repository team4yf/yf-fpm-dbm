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

describe('Fast DB M Remove Tester', function() {

  describe('#Remove()', function () {
    it('remove one from a table', function (done) {
      M.removeAsync({
        table: 'fpm_test',
        id: 3})
        .then(function (data) {
          assert(data.affectedRows === 1);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });

  describe('#Clear()', function () {
    it('clear multi datas from a table', function (done) {
      M.clearAsync({
        table: 'fpm_test',
        condition: { val: 'aaa'}})
        .then(function (data) {
          assert(data.affectedRows >= 2);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });
});