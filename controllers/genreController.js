//genre controller js
var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
var mongoose = require('mongoose');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var debug = require('debug')('genre');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {

  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) { return next(err); } //used 'console.log(err)' to bypass 'next' err 2018-03-19 7:54 PM
      //Successful, so render
      res.render('genre_list', { title: 'Genres', genre_list: list_genres });
    });

};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
  let id = mongoose.Types.ObjectId(req.params.id); //added :MOD: 2018-03-08 9:20
  async.parallel({
      genre: function(callback) {
          Genre.findById(id)// was  req.params.id  modded as per above change :MOD: 2018-03-08 9:20
            .exec(callback);
      },

      genre_books: function(callback) {
        Book.find({ 'genre': id }) //replaced req.params.id with id :MOD: 2018-03-08 9:28
        .exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      if (results.genre==null) { // No results.
          var err = new Error('Genre not found');
          err.status = 404;
          return debug('genre_detail error: ' + err); //was 'next(err)' 2018-03-19 7:54 PM
      }
      // Successful, so render
      res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
  });

};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.render('genre_form', { title: 'Create Genre' });
  };

// Handle Genre create on POST.
exports.genre_create_post = [

   // Validate that the name field is not empty.
   body('name', 'Genre name required').isLength({ min: 1 }).trim(),

   // Sanitize (trim and escape) the name field.
   sanitizeBody('name').trim().escape(),

   // Process request after validation and sanitization.
   (req, res, next) => {

       // Extract the validation errors from a request.
       const errors = validationResult(req);

       // Create a genre object with escaped and trimmed data.
       var genre = new Genre(
         { name: req.body.name }
       );


       if (!errors.isEmpty()) {
           // There are errors. Render the form again with sanitized values/error messages.
           res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
       return;
       }
       else {
           // Data from form is valid.
           // Check if Genre with same name already exists.
           Genre.findOne({ 'name': req.body.name })
               .exec( function(err, found_genre) {
                    if (err) { return next(err); }

                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_genre.url);
                    }
                    else {

                        genre.save(function (err) {  //very suspicious use of lowercase for 'genre'?
                          if (err) { return next(err); }
                          // Genre saved. Redirect to genre detail page.
                          res.redirect(genre.url);
                        });

                    }

                });
       }
   }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
  async.parallel({
      genre: function(callback) {
          Genre.findById(req.params.id).exec(callback)
      },
      genre_books: function(callback) {
        Genre.find({ 'genre': req.params.id }).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.genre==null) { // No results.
          res.redirect('/catalog/genres');
      }
      // Successful, so render.
      res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
  });

};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res, next) {

    async.parallel({  //arguments are 2 objects:  ({fn's},callback
        genre: function(callback) {
          Genre.findById(req.body.genreid).exec(callback)
        },
        genre_books: function(callback) {
          Book.find({ 'genre': req.body.genreid }).exec(callback)
        },
    }, function(err, results) {  //Object of fn's + call to callback ends,  callback fn definition starts
        if (err) { return next(err); }
        // Success
        if (results.genre_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
            return;
        } else {
            // Author has no books. Delete object and redirect to the list of authors.
            Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/genres')
            }) //findById ends
        } //callback fn ends
    }); //async ends
}; //export fn ends

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {
 //console.log("req.params.id is: " + req.params.id);
  let id = mongoose.Types.ObjectId(req.params.id); //added :MOD: 2018-03-08 9:20
  async.parallel({
      genre: function(callback) {
          Genre.findById(id)// was  req.params.id  modded as per above change :MOD: 2018-03-08 9:20
            .exec(callback);
      },

      genre_books: function(callback) {
        Book.find({ 'genre': id }) //replaced req.params.id with id :MOD: 2018-03-08 9:28
        .exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      if (results.genre==null) { // No results.
          var err = new Error('Genre not found');
          err.status = 404;
          return next(err);
      }
      //cannot stick final use of async results within callback (i.e. callback may be visited more than once!)
      res.render('genre_form', { title: 'Update Genre', genre: results.genre, book_list: results.genre_books });
   });//bracket ends callback function, parenthesis ends 'async.parallel' statement



};

// Handle Genre update on POST.
exports.genre_update_post = [
   // Validate that the name field is not empty.
   body('name', 'Genre name required').isLength({ min: 1 }).trim(),

   // Sanitize (trim and escape) the name field.
   sanitizeBody('name').trim().escape(),

   // Process request after validation and sanitization.
   (req, res, next) => {

       // Extract the validation errors from a request.
       const errors = validationResult(req);

       // Create a genre object with escaped and trimmed data.
       var genre = new Genre(
         { name: req.body.name }
       );


       if (!errors.isEmpty()) {
           // There are errors. Render the form again with sanitized values/error messages.
           res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
           return;
       }else{
           // Data from form is valid.
           // Check if Genre with same name already exists.
           Genre.findOne({ 'name': req.body.name })
               .exec( function(err, found_genre) {
                    if (err) { return next(err); }

                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_genre.url);
                    }
                    else {
                      // Data from form is valid. Update the record.
                      Genre.findByIdAndUpdate(req.params.id, req.body, {}, function (err,thegenre) {  //req.body was simply "author" (but caused error)
                        //genre.save(function (err) {
                          if (err) { return next(err); }
                        // Genre saved. Redirect to genre detail page.
                        res.redirect(genre.url);
                        });

                    }

                });
       }
   }
];
