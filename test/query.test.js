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

describe('Fast DB M Query Tester', function() {

  describe('#Count()', function () {
    it('count a table', function (done) {
      M.countAsync({table: 'fpm_test'})
        .then(function (c) {
          expect(c).to.equal(2);
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
        .then(function (c) {
          expect(c.id).to.equal(2);
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
          expect(c.count).to.equal(2);
          expect(c.rows).to.have.lengthOf(2);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });
});