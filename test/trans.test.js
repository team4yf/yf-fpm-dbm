var expect = require('chai').expect;
var C = {
  host:'localhost',
  database:'yf-fast-platform',
  username:'dbadmin',
  password:'741235896',
  showSql:true
};
var M = require('../index.js')(C);
describe('Fast DB M Callback Type Test', function() {

  describe('#FDM()', function () {
    it('#Trans', function (done) {
      M.transation(function(err, atom){
        var arg = {
        　table: "api_app",
        　condition: "title = 'test'",
          row:{val:"shit trans"}
        };
        atom.update(arg, function(err, result1){
          if(err){
            atom.rollback();
            return ;
          }
          arg = {
          　table: "test",
          　condition: "id = 1",
            row:{createAt: 1}
          };
          atom.update(arg, function(err, result2){
            if(err){
              atom.rollback(function(){
                done()
              });
            }else{
              atom.commit(function(err){
                done(err)
              });
            }
          })
        })
      })
    });
  });

});
