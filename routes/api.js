/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, next){
      const findBooks = require('../controllers/libraryController.js').findBooks;
      findBooks( (err, books) => {
         if (err) return next({ error: 'error on find books' });
        if (!books ) return next({ message: 'library empty '});
        const books_formatted = books.map( book => {
            const comments_formatted = book.comments.map( comment => {
              return comment.comment;
            });
            return {
              _id: book._id,
              title: book.title,
              commentcount: book.comments.length,
              comments: comments_formatted,
              __v: book.__v
            }
        });
        res.json( books_formatted );
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res, next){
      let book = req.body;
      const createBook = require("../controllers/libraryController.js").createAndSaveBook;
      
      createBook(book, function(err, book_created) {
        if (err || !book_created) {
          res.send('missing required field title');
          return next({ error: 'missing required field title' });
        }
        res.json({
          _id: book_created._id,
          title: book_created.title
        });
      });
    })
    
    .delete(function(req, res, next){
      const deleteBooks = require("../controllers/libraryController.js").deleteBooks;
      //console.log( 'id from delete: ', _id);
      deleteBooks(function(err, books_deleted) {
        if ( err || !books_deleted ) {
          //console.log({ error: 'could not delete', '_id': _id });
          res.send('fail action delete all books');
          return next('fail action delete all books');
        }
        res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res, next){
      let bookid = req.params.id;
      const findBookById = require('../controllers/libraryController.js').findBookById;
      findBookById( bookid, (err, book) => {
         if (err) return next({ error: 'error on find book', _id : bookid });
        if (!book ) {
          res.send('no book exists');
          return next({ message: 'no book exists', _id: bookid });
        }
        const comments_formatted = book.comments.map( comment => {
              return comment.comment;
        });
        res.json( {
              _id: book._id,
              title: book.title,
              commentcount: book.comments.length,
              comments: comments_formatted,
              __v: book.__v
            });
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res, next){
      const data = req.body;
      data._id = req.params.id;
      if ( !data.comment ) {
        res.send('missing required field comment');
        return next({message: 'missing required field comment'});
      }
      const createComment = require('../controllers/libraryController.js').createAndSaveComment;

      createComment(data, function (err,book) {
    
        if (err) {
          return next(err);
        }
        if (!book) {
          res.send('no book exists');
          return next({ message: "Missing add comment action" });
        }
        const comments_formatted = book.comments.map( comment => {
              return comment.comment;
        });
        res.json({
              _id: book._id,
              title: book.title,
              commentcount: book.comments.length,
              comments: comments_formatted,
              __v: book.__v
        });   
      });
    })
    
    .delete(function(req, res, next){
      let _id = req.params.id;
      const deleteBookById = require("../controllers/libraryController.js").deleteBookById;
      //console.log( 'id from delete: ', _id);
      deleteBookById(_id, function(err, book_deleted) {
        if ( err || !book_deleted ) {
          //console.log({ error: 'could not delete', '_id': _id });
          res.send('no book exists');
          return next('no book exists');
        }
        res.send('delete successful');
      });
    });
  
};
