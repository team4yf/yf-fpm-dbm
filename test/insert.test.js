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

describe('Fast DB M Insert Tester', function() {

  describe('#InsertOne()', function () {
    it('insert one into a table', function (done) {
      M.createAsync({
        table: 'fpm_test',
        row: { val: '33333'}})
        .then(function (data) {
          expect(data.insertId).to.be.above(2);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });

  describe('#InsertMulti()', function () {
    it('insert multi datas into a table', function (done) {
      M.createAsync({
        table: 'fpm_test',
        row: [{ val: 'aaa'}, { val: 'bbb'}]})
        .then(function (data) {
          expect(data.insertId).to.be.above(2);
          done()
        }).catch(function (err) {
          done(err);
        });
    });
  });
});