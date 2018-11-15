//client instance controller js
var Client = require('../models/client');
var ClientRequest = require('../models/clientrequest');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

// Display list of all ClientRequests.
exports.clientrequest_list = function(req, res, next) {

  ClientRequest.find()
    .populate('client')
    .exec(function (err, list_clientrequests) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('clientrequest_list', { title: 'Client Request List', clientrequest_list: list_clientrequests });
    });

};

// Display detail page for a specific ClientRequest.
exports.clientrequest_detail = function(req, res, next) {

      ClientRequest.findById(req.params.id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
      .populate('client')
      .exec(function (err, clientrequest) {
        if (err) {
           debug("clientrequest err: %s ",err);
           return next(err);
         }
        if (clientrequest==null) { // No results.
            var err = new Error('Client copy not found');
            err.status = 404;
            return next(err);
          }
        // Successful, so render.
        res.render('clientrequest_detail', { title: 'Client:', clientrequest:  clientrequest});
      })

  };

// Display ClientRequest create form on GET.
exports.clientrequest_create_get = function(req, res, next) {

      Client.find({},'client') //???
      .exec(function (err, clients) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('clientrequest_form', {title: 'Create ClientRequest', client_list:clients});
      });

  };

// Handle ClientRequest create on POST.
exports.clientrequest_create_post = [
    // Convert the module to an array.
    (req, res, next) => {
       if(!(req.body.module instanceof Array)){
           if(typeof req.body.module ==='undefined')
           req.body.module=[];
           else
           req.body.module=new Array(req.body.module);
      }
//      next();
//    },

    //convert the status to an Array
    (req, res, next) => {
        if(!(req.body.status instanceof Array)){
            if(typeof req.body.status==='undefined')
            req.body.status=[];
            else
            req.body.status=new Array(req.body.status);
        }
        next();
    },

    // Validate fields.
    body('client', 'Client must be specified').isLength({ min: 1 }).trim(),
    body('module', 'module name must be specified').isLength({ min: 1 }).trim(),
    body('status', 'current status').isLength({min:1}).trim(),
    body('date_entered', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('client').trim().escape(),
    sanitizeBody('module').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('date_entered').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a ClientRequest object with escaped and trimmed data.
        var clientrequest = new ClientRequest( //.body. here is body of request which has many key fields
          { client: req.body.client,
            module: req.body.module,
            status: req.body.status,
            date_entered: req.body.date_entered
           });

        if (!errors.isEmpty()) {
            console.log('checking the funtion!!!');
            // There are errors. Render form again with sanitized values and error messages.
            // Get all authors and modules & statii for form.
            async.parallel({
                clients: function(callback) {
                    Client.find(callback);
                },
                modules: function(callback) {
                    Module.find(callback);
                },
                statii: function(callback) {
                    Status.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected modules as checked.
                for (let i = 0; i < results.modules.length; i++) {
                    if (clientrequest.module.indexOf(results.modules[i]._id) > -1) {
                        results.modules[i].checked='true';
                    }

                 for (let i = 0; i < results.statii.length; i++) {
                     if (clientrequest.status.indexof(results.statii[i]._id) > -1) {
                        results.statii[i].checked= 'true';
                     }
                 }
                 res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            }); //ends async clause
            return;

        } else {
            // Data from form is valid.
            clientrequest.save(function (err) {
                if (err) { return next(err); }
                   //else Successful - redirect to new record.
                   res.redirect(clientrequest.url);
                });
        }//end the else
    }
];

// Display ClientRequest delete form on GET.
exports.clientrequest_delete_get = function(req, res, next) {
      //async.parallel({key1:func,key2:func},function(err,results))
      async.parallel({
          clientrequest: function(callback) { //was author:...
              ClientRequest.findById(req.params.id).exec(callback) //was Author
          },
          //authors_clients: function(callback) {
            //Client.find({ 'author': req.params.id }).exec(callback)
          //},
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.clientrequest==null) { //was results.author  // No results.
              res.redirect('/catalog/clientrequests'); //was /authors
          }
          // Successful, so render.
          //res.render('author_delete', { title: 'Delete Author', author: results.author, author_clients: results.authors_clients } );
          res.render('clientrequest_delete', { title: 'Delete ClientRequest', clientrequest: results.clientrequest, clienttitle: results.clientrequest.client.title });
      });

  };

// Handle ClientRequest delete on POST.
exports.clientrequest_delete_post = function(req, res, next) {
  // client instances being deleted have no dependencies; just do it.
  ClientRequest.findByIdAndRemove(req.body.clientrequestid, function deleteClientRequest(err) {  //was Autthor....req.body.authorid, fn deletAuthor
      if (err) { return next(err); }
      // Success - go to clientrequests list
      res.redirect('/catalog/clientrequests')
  })
  };

// Display ClientRequest update form on GET.
exports.clientrequest_update_get = function(req, res, next) {
  // Get book, authors and genres for form.
  async.parallel({
      clientrequest: function(callback) {
          ClientRequest.findById(req.params.id).populate('client').populate('module').populate('status').exec(callback);
      },
      authors: function(callback) {
          Client.find(callback);
      },
      modules: function(callback) {
          Module.find(callback);
      },
      statii: function(callback) {
          Status.find(callback);
      },
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.clientrequest==null) { // No results.
              var err = new Error('ClientRequest not found');
              err.status = 404;
              return next(err);
          }
          // Success.
          // Mark our selected genres as checked.
          for (var all_m_iter = 0; all_m_iter < results.modules.length; all_m_iter++) {
              for (var clientrequest_m_iter = 0; clientrequest_m_iter < results.clientrequest.module.length; clientrequest_m_iter++) {
                  if (results.modules[all_m_iter]._id.toString()==results.clientrequest.module[clientrequest_m_iter]._id.toString()) {
                      results.modules[all_m_iter].checked='true';
                  }
              }
          }
          // Mark our selected statii as checked.
          for (var all_s_iter = 0; all_s_iter < results.statii.length; all_s_iter++) {
              for (var clientrequest_s_iter = 0; clientrequest_s_iter < results.clientrequest.status.length; clientrequest_s_iter++) {
                  if (results.statii[all_s_iter]._id.toString()==results.clientrequest.status[clientrequest_s_iter]._id.toString()) {
                      results.statii[all_s_iter].checked='true';
                  }
              }
          }
          res.render('clientrequest_form', { title: 'Update ClientRequest', clients:results.clients, modules:results.modules, clientrequest: results.clientrequest });
      });

};

// Handle clientrequest update on POST.
  exports.clientrequest_update_post = [
      // Validate fields.
      body('module_type', 'Module name must be specified').isLength({ min: 1 }).trim(),
      body('status', 'optional').isLength({ min: 1 }).trim(),
      body('date_entered', 'Request date').optional({ checkFalsy: true }).isISO8601(),

      // Sanitize fields.
      sanitizeBody('module_type').trim().escape(),
      sanitizeBody('status').trim().escape(),
      sanitizeBody('date_entered').toDate(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          // Create a ClientRequest object with escaped and trimmed data and old id
          var clientrequest = new ClientRequest( //.body. here is body of request which has many key fields
            { client: req.body.client,
              module_type: req.body.module_type,
              status: req.body.status,
              date_entered: req.body.date_entered,
              _id:req.params.id //This is required, or a new ID will be assigned!
             });

          if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values and error messages.
              Client.find({},'title')
                  .exec(function (err, clients) {
                      if (err) { return next(err); }
                      // Successful, so render.
                      res.render('clientrequest_form', { title: 'Create ClientRequest', client_list : clients, selected_client : clientrequest.client._id , errors: errors.array(), clientrequest:clientrequest });
              });
              return;
          }
          else {
              // Data from form is valid.
              ClientRequest.findByIdAndUpdate(req.params.id,clientrequest,{}, function (err,theclientrequest) {
                  if (err) { return next(err); }
                     //else Successful - redirect to new record.
                     res.redirect(clientrequest.url);
                  });
          }
      }
  ];
