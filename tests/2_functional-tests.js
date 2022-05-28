/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
const Browser = require('zombie');
Browser.site = ("https://boilerplate-project-library.marcoportero.repl.co");
let id1;
let id2 ='6259ea428d4ce5076615e2e9';

suite('Functional Tests with Zombie.js', function () {
    this.timeout(5000);
    const browser = new Browser();
    suiteSetup( function(done){
     return browser.visit('/', done); 
    });
    suite('Functional Tests', function() {
    
      /*
      * ----[EXAMPLE TEST]----
      * Each test should completely test the response of the API end-point including response status code!
      
      test('#example Test GET /api/books', function(done){
         chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });
      
      * ----[END of EXAMPLE TEST]----
      */

    
       // suite('Routing tests', function() {
      
      
      //    suite('POST /api/books with title => create book object/expect book object', function() {
            
            test('Test POST /api/books with title', function(done) {
              chai.request(server)
              .post('/api/books')
              .set('content-type', 'application/json')
              .send({
                title: 'book test 01'
              })
              .end( (err, res) => {
                //console.log(res);
                assert.equal(res.status, 200, 'status should be 200');
                assert.equal(res.type, 'application/json','Type should be application/json');
                assert.property(res.body, '_id','Respond should has a title property');
                assert.property(res.body, 'title','Respond should has a title property');
                assert.equal(res.body.title, 'book test 01','Tittle shuld be book test 01');
                id1 = res.body._id;
                done();
                
              })
            });
            
            test('Test POST /api/books with no title given', function(done) {
              chai.request(server)
              .post('/api/books')
              .send({})
              .end( (err, res) => {
                //console.log(res);
                assert.equal(res.status, 200, 'status should be 200');
                assert.equal(res.text, 'missing required field title');   
                done();     
              })

            });
            
        //  });
      
      
       //   suite('GET /api/books => array of books', function(){
            
            test('Test GET /api/books',  function(done){
              chai.request(server)
                .get('/api/books')
                .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.isArray(res.body, 'response should be an array');
                  const books = res.body;
                  books.forEach( book => {
                    assert.property(book, 'commentcount', 'Books in array should contain commentcount');
                    assert.property(book, 'title', 'Books in array should contain title');
                    assert.property(book, '_id', 'Books in array should contain _id');
                  });
                  done();
                });
            });      
            
       //   });
      
      
       //   suite('GET /api/books/[id] => book object with [id]', function(){
            
            test('Test GET /api/books/[id] with id not in db',  function(done){
              chai.request(server)
                .get('/api/books/' + id2)
                .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.equal(res.text,'no book exists','Text should be no book exists')
                  done();
              });
            });
            
            test('Test GET /api/books/[id] with valid id in db',  function(done){
              chai.request(server)
                .get('/api/books/' + id1)
                .end(function(err, res){
                  assert.equal(res.status, 200, 'should be 200');
                  assert.equal(res.type, 'application/json','Should be applications/json');
                  assert.property(res.body,'_id','Should has _id property')
                  assert.property(res.body,'title','Should has _id property')
                  assert.property(res.body,'commentcount','Should has commentcount property')
                  assert.property(res.body,'comments','Should has comments property')
                  assert.isArray(res.body.comments,'comments','Comments should be an array ')
                  done();
              });
            });
            
       //   });
      
      
       //   suite('POST /api/books/[id] => add comment/expect book object with id', function(){
            
            test('Test POST /api/books/[id] with comment', function(done){
              const random = Math.floor(Math.random() * 20);
              const comment_test = 'comment last ' + random;
              chai.request(server)
                .post('/api/books/' + id1)
                .send({ comment: comment_test })
                .end(function(err, res){
                  assert.equal(res.status, 200, 'should be 200');
                  assert.equal(res.type, 'application/json','Should be applications/json');
                  assert.equal(res.body._id, id1 ,'Should be _id ' + id1)
                  assert.equal(res.body.comments[ res.body.commentcount - 1 ], comment_test,'Comment should be '+ comment_test);
                  done();
              });
            });
      
            test('Test POST /api/books/[id] without comment field', function(done){
              chai.request(server)
                .post('/api/books/' + id1)
                .end(function(err, res){
                  assert.equal(res.status, 200, 'should be 200');
                  assert.equal(res.text, 'missing required field comment','Should be missing required field comment');
                  done();
              });
            });
      
            test('Test POST /api/books/[id] with comment, id not in db', function(done){
              chai.request(server)
                .post('/api/books/' + id2)
                .send({ comment: 'some comment' })
                .end(function(err, res){
                  assert.equal(res.status, 200, 'should be 200');
                  assert.equal(res.text, 'no book exists','Should be no book exists');
                  done();
              });
            });
           
        //  });
      
          //suite('DELETE /api/books/[id] => delete book object id', function() {
      
            test('Test DELETE /api/books/[id] with valid id in db', function(done){
               chai.request(server)
                .delete('/api/books/' + id1)
                .end(function(err, res){
                  assert.equal(res.status, 200, 'should be 200');
                  assert.equal(res.text, 'delete successful','Should be delete successful');
                  done();
              });
            });
      
            test('Test DELETE /api/books/[id] with  id not in db', function(done){
               chai.request(server)
                .delete('/api/books/' + id2)
                .end(function(err, res){
                  assert.equal(res.status, 200, 'should be 200');
                  assert.equal(res.text, 'no book exists','Should be no book exists');
                  done();
              });
            });
      
          //});
      
        //});
      
      });
});
