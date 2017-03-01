var Promise = require('bluebird');
var expect = require('chai').expect;
var parallel = Promise.promisify(require('async/parallel'));
var C = {
  host:'localhost',
  database:'fpm',
  username:'dbadmin',
  password:'741235896',
  showSql: true
};
var M = Promise.promisifyAll(require('../index.js')(C));
describe('Fast DB M transation Test', function() {
  it('#Trans', function (done) {
    M.transationAsync()
      .then(function(atom){
        parallel([
          function(callback){
            atom.create({table: 'fpm_test', row: { val: '33333'}}, callback);
          },
          function(callback){
            atom.update({table: 'fpm_test', condition: 'id = 4', row: { val: '33333'}}, callback);
          }
        ])
          .then(function(data){
            atom.commit(function(){
              done()
            });
          })
          .catch(function(err){
            atom.rollback(function(){
              done(err)
            });
          });
      })
      .catch(function(err){
        done(err);
      })
      

  });

});
