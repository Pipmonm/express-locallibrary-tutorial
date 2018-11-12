//author controller js
var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 9:45 AM
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM
var debug = require('debug')('author');


// Display list of all Authors.
exports.author_list = function(req, res, next) {

  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('author_list', { title: 'Author List', author_list: list_authors });
    });

};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
      console.log('via author_detail')
      var id = mongoose.Types.ObjectId(req.params.id.toString()); // added  :MOD: 2018-03-08 9:45 AM
      async.parallel({
          author: function(callback) {
              Author.findById(id)   //  was  req.params.id  // added  :MOD: 2018-03-08 9:45 AM
                .exec(callback)
          },
          authors_books: function(callback) {
            Book.find({ 'author': id},'title summary') // was required.params.id   // added  :MOD: 2018-03-08 9:45 AM
            .exec(callback)
          },
      }, function(err, results) {
          if (err) { return next(err); } // Error in API usage.
          if (results.author==null) { // No results.
              var err = new Error('Author not found');
              err.status = 404;
              return next(err);
          }
          // Successful, so render.
          res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
      });

  };

// Display Author create form on GET.
exports.author_create_get = function(req, res, next) {
    res.render('author_form', { title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [

      // Validate fields.
      body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
          .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
      body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
          .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
      body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
      body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

      // Sanitize fields.
      sanitizeBody('first_name').trim().escape(),
      sanitizeBody('family_name').trim().escape(),
      sanitizeBody('date_of_birth').toDate(),
      sanitizeBody('date_of_death').toDate(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values/errors messages.
              res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
              return;
          }
          else {
              // Data from form is valid.

              // Create an Author object with escaped and trimmed data.
              var author = new Author(
                  {
                      first_name: req.body.first_name,
                      family_name: req.body.family_name,
                      date_of_birth: req.body.date_of_birth,
                      date_of_death: req.body.date_of_death
                  });
              author.save(function (err) {
                  if (err) { return next(err); }
                  // Successful - redirect to new author record.
                  res.redirect(author.url);
              });
          }
      }
  ];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res, next) {
      console.log('via delete_get');
      async.parallel({
          author: function(callback) {
              Author.findById(req.params.id).exec(callback)
          },
          authors_books: function(callback) {
            Book.find({ 'author': req.params.id }).exec(callback)
          },
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.author==null) { // No results.
              res.redirect('/catalog/authors');
          }
          // Successful, so render.
          res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
      });

  };

// Handle Author delete on POST.
exports.author_delete_post = function(req, res, next) {

    async.parallel({  //arguments are 2 objects:  ({fn's},callback
        author: function(callback) {
          Author.findById(req.body.author.id).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.body.author.id }).exec(callback)
        },
    }, function(err, results) {  //Object of fn's + call to callback ends,  callback fn definition starts
        if (err) { return next(err); }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
            return;
        } else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.author.id, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/authors')
            }) //findById ends
        } //callback fn ends
    }); //async ends
}; //export fn ends

// Display Author update form on GET.
exports.author_update_get = function(req, res, next) {
      //sanitize id ???
      //req.params.sanitize('id').escape().trim();
      sanitizeBody('id').trim().escape();
      //author: function(callback) {
      async.parallel({
      author: function(callback) {
      Author.findById(req.params.id).exec(callback)
    }, //only one function called asynchronously. ending comma allowed to simplify chaining a possible next one
  }, function(err, results) {   //note leading "}" closes async's opening "{"
       if(err) {
         debug('update error ' + err);
         return next(err);
       }

       let born = results.author.date_of_birth ? moment(results.author.date_of_birth).format('YYYY-MM-DD') : '';
       let died = results.author.date_of_death ? moment(results.author.date_of_death).format('YYYY-MM-DD') : '';
       res.render('author_form', { title: 'Update Author', author: results.author, born: born, died: died, query: "Update"});
  });//async ends note closing } is not for async's opening "{", that's closed above, this one closes  fn(err,rslts){
}; //export fn ends

// Handle Author update on POST.
exports.author_update_post = [
  // Validate fields.
  body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
      .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
      .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
  body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
          return;
      }
      else {



        // Data from form is valid. Update the record.
        Author.findByIdAndUpdate(req.params.id, req.body, {}, function (err,theauthor) {  //req.body was simply "author" (but caused error)
          if (err) { return next(err); }
          // Successful - redirect to book detail page.
          res.redirect(theauthor.url);
        });
      }
    }
];


          // Create an Author object with escaped and trimmed data.
//          var author = new Author(
//              {
//                  first_name: req.body.first_name,
//                  family_name: req.body.family_name,
//                  date_of_birth: req.body.date_of_birth,
//                  date_of_death: req.body.date_of_death
//              });
//          author.save(function (err) {
//              if (err) { return next(err); }
              // Successful - redirect to new author record.
//              res.redirect(author.url);
//          });
//      }
//  }
//];
