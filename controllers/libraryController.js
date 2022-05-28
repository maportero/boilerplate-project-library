const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true } );

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type : String, required : true },
  comments: [
    { comment: { type: String } }
  ]
});

let  Book = mongoose.model('Book', bookSchema);

const createAndSaveBook = (data , done ) => {
   let book = new Book(data);
   book.save((err,bookSaved) => {
     if (err){
       done(err.message,null);
     }else done(null , bookSaved );
   })
};

const findBooks = ( done ) => {
    const query = Book.find();
    query.exec( (err, books) => {
      if (err) {
       done(err.message,null);
     }else done(null, books);
    });
};

const findBookById = ( id, done ) => {
    Book.findById(id, (err, book) => {
      if (err) {
         done(err.message,null);
       }else done(null, book);  
    });
};

const createAndSaveComment = (data , done ) => {
     
     const _id = data._id;
     const comment = ({
          comment: data.comment
     });
    
     Book.findById( _id , ( err, bookFound ) => {
       if (err ) 
         done(err.message, null);
       else if ( !bookFound ) 
         done(null,null);
       else {
          bookFound.comments.push(comment);
          bookFound.save( (xerr , bookSaved) => {
            if (xerr) 
              done(xerr.message, null);
            else done(null, bookSaved);
          });
       }
     });
};

const deleteBookById = ( id, done) => {
    Book.findByIdAndDelete(id, (err, book_deleted) => {
      if (err) {
       done(err.message,null);
     }else done(null, book_deleted);
    });
};

const deleteBooks = ( done) => {
    Book.deleteMany({}, (err, books_deleted) => {
      if (err) {
       done(err.message,null);
     }else done(null, books_deleted);
    });
};

exports.BookModel = Book;
exports.createAndSaveBook = createAndSaveBook;
exports.findBooks = findBooks;
exports.findBookById = findBookById;
exports.createAndSaveComment = createAndSaveComment;
exports.deleteBookById = deleteBookById;
exports.deleteBooks = deleteBooks;