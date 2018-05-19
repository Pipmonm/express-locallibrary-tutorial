//book instance controller js
var Book = require('../models/book');
var BookInstance = require('../models/bookinstance');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {

  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });

};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {

      BookInstance.findById(req.params.id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
      .populate('book')
      .exec(function (err, bookinstance) {
        if (err) {
           debug("bookinstance err: %s ",err);
           return next(err);
         }
        if (bookinstance==null) { // No results.
            var err = new Error('Book copy not found');
            err.status = 404;
            return next(err);
          }
        // Successful, so render.
        res.render('bookinstance_detail', { title: 'Book:', bookinstance:  bookinstance});
      })

  };

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {

      Book.find({},'title')
      .exec(function (err, books) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('bookinstance_form', {title: 'Create BookInstance', book_list:books});
      });

  };

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance( //.body. here is body of request which has many key fields
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                   //else Successful - redirect to new record.
                   res.redirect(bookinstance.url);
                });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {
      //async.parallel({key1:func,key2:func},function(err,results))
      async.parallel({
          bookinstance: function(callback) { //was author:...
              BookInstance.findById(req.params.id).exec(callback) //was Author
          },
          //authors_books: function(callback) {
            //Book.find({ 'author': req.params.id }).exec(callback)
          //},
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.bookinstance==null) { //was results.author  // No results.
              res.redirect('/catalog/bookinstances'); //was /authors
          }
          // Successful, so render.
          //res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
          res.render('bookinstance_delete', { title: 'Delete BookInstance', bookinstance: results.bookinstance, booktitle: results.bookinstance.book.title });
      });

  };

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
  // book instances being deleted have no dependencies; just do it.
  BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err) {  //was Autthor....req.body.authorid, fn deletAuthor
      if (err) { return next(err); }
      // Success - go to bookinstances list
      res.redirect('/catalog/bookinstances')
  })
  };

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
  BookInstance.findById(req.params.id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
  .populate('bookinstance book') //populate the nested book model with the book values
  .exec(function (err, bookinstance) {
    if (err) {
       debug("bookinstance err: %s ",err);
       return next(err);
     }
    if (bookinstance==null) { // No results.
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
    // Successful, so render.
    let due_date = bookinstance.due_back ? moment(bookinstance.due_back).format('YYYY-MM-DD') : '';
    let statsArray = [bookinstance.status];
    let statOptions = ['Available','Loaned','Reserved','Maintenance'];
    //replacement group which must be added after any change leading to a reconnection!!!
    //ie will not mpass a 'restart of mongodb connection',  to be placed in bookinstanceUpdate_form.pug

    for(let i = 0;i<4;i++)if(statOptions[i] != bookinstance.status)statsArray.push(statOptions[i]);
    res.render('bookinstanceUpdate_form', { title: 'Book:', bookinstance: bookinstance, due_back: due_date, statusArray: statsArray});
  })

};

// Handle bookinstance update on POST.
  exports.bookinstance_update_post = [
      // Validate fields.
      body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
      body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
      body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

      // Sanitize fields.
      sanitizeBody('book').trim().escape(),
      sanitizeBody('imprint').trim().escape(),
      sanitizeBody('status').trim().escape(),
      sanitizeBody('due_back').toDate(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          // Create a BookInstance object with escaped and trimmed data and old id
          var bookinstance = new BookInstance( //.body. here is body of request which has many key fields
            { book: req.body.book,
              imprint: req.body.imprint,
              status: req.body.status,
              due_back: req.body.due_back,
              _id:req.params.id //This is required, or a new ID will be assigned!
             });

          if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values and error messages.
              Book.find({},'title')
                  .exec(function (err, books) {
                      if (err) { return next(err); }
                      // Successful, so render.
                      res.render('bookinstance_form', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
              });
              return;
          }
          else {
              // Data from form is valid.
              BookInstance.findByIdAndUpdate(req.params.id,bookinstance,{}, function (err,thebookinstance) {
                  if (err) { return next(err); }
                     //else Successful - redirect to new record.
                     res.redirect(bookinstance.url);
                  });
          }
      }
  ];
