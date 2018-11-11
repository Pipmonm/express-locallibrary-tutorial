//book instance controller js
var Client = require('../models/client');
var Request = require('../models/clientrequest');
var Transaction = require('../models/clienttransaction');
//var BookInstance = require('../models/bookinstance');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

// Display list of all clients.

exports.client_list = function(req, res, next) {

   Client.find()
      .sort([['family_name','ascending']])
      .exec(function (err, list_clients) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('client_list', { title: 'Client List', client_list: list_clients });
      });

  };


  // Display detail page for a specific Client.
  exports.client_detail = function(req, res, next) {
        var id = mongoose.Types.ObjectId(req.params.id.toString()); // added  :MOD: 2018-03-08 9:45 AM
        async.parallel({
            client: function(callback) {
                Client.findById(id)   //  was  req.params.id  // added  :MOD: 2018-03-08 9:45 AM
                  .exec(callback)
            },
            client_requests: function(callback) {
              Request.find({ 'client': id},'module version') // was required.params.id   // added  :MOD: 2018-03-08 9:45 AM
              .exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); } // Error in API usage.
            if (results.client==null) { // No results.
                var err = new Error('Client not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('client_detail', { title: 'Client Detail', client: results.client, client_requests: results.clients_requests } );
        });

    };

  // Display Client create form on GET.
  exports.client_create_get = function(req, res, next) {
      res.render('client_form', { title: 'Purchase Form'});
  };

  // Handle Client create on POST.
  exports.client_create_post = [
        // Validate fields.
        body('first_name').isLength({ min: 1 }).trim().withMessage('First name (or initial)')
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
        body('family_name').isLength({ min: 1 }).trim().withMessage('Family name (or unique identifier)')
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
        // Sanitize fields.
        sanitizeBody('first_name').trim().escape(),
        sanitizeBody('family_name').trim().escape(),

        // Process request after validation and sanitization.
        (req, res, next) => {

            // Extract the validation errors from a request.
            const errors = validationResult(req);
            const error = 0;//added on for email check
            if(!check(body('email_address')).isEmail()){
                debug('invalid email');
                error = 1;//need to generate an error of some sort here
              }else{  //not aware of callback style validator for emails, following is newer version
               var  email =  check(body('email_address')).isEmail().normalizeEmail();
            }
            if (error){
                res.render('client_form', { title: 'Create Client', client: req.body, errors: errors.array(), error: "invalid email address" });
                return;
            }

            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values/errors messages.
                res.render('client_form', { title: 'Create Client', client: req.body, errors: errors.array() });
                return;
            }
            else {
                // Data from form is valid.

                // Create a Client object with escaped and trimmed data.
                var client = new Client(
                    {
                        first_name: req.body.first_name,
                        family_name: req.body.family_name,
                        email_address: email,

                    });
                client.save(function (err) {
                    if (err) { return next(err); }
                    // Successful - redirect to new clientrecord.
                    res.redirect(client.url);
                });
            }
        }
    ];

  // Display Client delete form on GET.
  exports.client_delete_get = function(req, res, next) {

        async.parallel({
            client: function(callback) {
                Client.findById(req.params.id).exec(callback)
            },
            client_requests: function(callback) {
              Clientrequest.find({ 'client': req.params.id }).exec(callback)
            },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.client==null) { // No results.
                res.redirect('/catalog/clients');
            }
            // Successful, so render.
            res.render('client_delete', { title: 'Delete Client', client: results.client, client_requests: results.client_requests, client_transactions: results.client_transactions } );
        });

    };

  // Handle Client delete on POST.
  exports.client_delete_post = function(req, res, next) {

      async.parallel({  //arguments are 2 objects:  ({fn's},callback
          client: function(callback) {
            Client.findById(req.body.client.id).exec(callback)
          },
          clients_requests: function(callback) {
            Client.find({ 'client': req.body.client.id }).exec(callback)
          },
          clients_transactions: function(callback){
            Client.find({ 'client': req.body.client.id }).exec(callback)
          },
      }, function(err, results) {  //Object of fn's + call to callback ends,  callback fn definition starts
          if (err) { return next(err); }
          // Success
          if (results.clients_requests.length > 0 ) {
              // Client has books. Render in same way as for GET route.
              res.render('client_delete', { title: 'Delete Client', client: results.client, client_requests: results.clients_requests } );
              return;
          }else if(results.clients_transactions.length > 0)  {
              // Client has books. Render in same way as for GET route.
              res.render('client_delete', { title: 'Delete Client', client: results.client, client_transactions: results.clients_transactions } );
              return;

          } else {
              // Client has no books. Delete object and redirect to the list of clients.
              Client.findByIdAndRemove(req.body.client.id, function deleteClient(err) {
                  if (err) { return next(err); }
                  // Success - go to client list
                  res.redirect('/catalog/clients')
              }) //findById ends
          } //callback fn ends
      }); //async ends
  }; //export fn ends

  // Display Client update form on GET.
  exports.client_update_get = function(req, res, next) {
        //sanitize id ???
        //req.params.sanitize('id').escape().trim();
        sanitizeBody('id').trim().escape();
        //client: function(callback) {
        async.parallel({
        client: function(callback) {
        Client.findById(req.params.id).exec(callback)
      }, //only one function called asynchronously. ending comma allowed to simplify chaining a possible next one
    }, function(err, results) {   //note leading "}" closes async's opening "{"
         if(err) {
           debug('update error ' + err);
           return next(err);
         }

         let email = results.client.email_address;
         if(!check('email').isEmail){
           debug('invalid email');
           return -1;//need to generate an error of some sort here
         }else{  //not aware of callback style validator for emails, following is newer version
           email =  check('email').isEmail().normalizeEmail();
         }
         res.render('client_form', { title: 'Update Client', client: results.client,email_address: email, query: "Update"});
    });//async ends note closing } is not for async's opening "{", that's closed above, this one closes  fn(err,rslts){
  }; //export fn ends  NOTE this is a request to update with changes, only accepted if posted (as follows)

  // Handle Client update on POST.
  exports.client_update_post = [
    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('client_form', { title: 'Create Client', client: req.body, errors: errors.array() });
            return;
        }
        else {



          // Data from form is valid. Update the record.
          Client.findByIdAndUpdate(req.params.id, req.body, {}, function (err,theclient) {  //req.body was simply "client" (but caused error)
            if (err) { return next(err); }
            // Successful - redirect to book detail page.
            res.redirect(theclient.url);
          });
        }
      }
  ];


            // Create an Client object with escaped and trimmed data.
  //          var client = new Client(
  //              {
  //                  first_name: req.body.first_name,
  //                  family_name: req.body.family_name,
  //                  date_of_birth: req.body.date_of_birth,
  //                  date_of_death: req.body.date_of_death
  //              });
  //          client.save(function (err) {
  //              if (err) { return next(err); }
                // Successful - redirect to new client record.
  //              res.redirect(client.url);
  //          });
  //      }
  //  }
  //];
