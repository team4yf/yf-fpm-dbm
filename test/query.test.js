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

describe('Fast DB M Query Tester', function() {

  describe('#Count()', function () {
    it('count a table', function (done) {
      M.countAsync({table: 'fpm_test'})
        .then(function (c) {
          assert(c >= 2);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });

  describe('#First()', function () {
    it('get first one from a table', function (done) {
      M.firstAsync({
          table: 'fpm_test', 
          condition: 'delflag=0', 
          fields: '*'})
        .then(function (data) {
          assert(!!data);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });

  describe('#FindAndCount()', function () {
    it('find and count a table', function (done) {
      M.findAndCountAsync({
          table: 'fpm_test', 
          condition: 'delflag=0', 
          fields: '*'})
        .then(function (c) {
          assert(c.count >= 2);
          assert(c.rows.length >= 2);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });
});