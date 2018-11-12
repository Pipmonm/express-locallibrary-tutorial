//client transaction controller js
var Client = require('../models/client');
var ClientTransaction = require('../models/clienttransaction');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM
var forcingReload = true;

var debug = require('debug');

// Display list of all ClientTransactions.
exports.clienttransaction_list = function(req, res, next) {

  ClientTransaction.find()
    .populate('client')
    .exec(function (err, list_clienttransactions) {
      if (err) { return next(err); }
      // Successful, so
      alert("rendering clienttransaction list")
      ////res.render('clienttransaction_list', { title: 'Client transaction List', clienttransaction_list: list_clienttransactions });
    });

};

// Display detail page for a specific ClientTransaction.
exports.clienttransaction_detail = function(req, res, next) {

      ClientTransaction.findById(req.params.id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
      .populate('client')
      .exec(function (err, clienttransaction) {
        if (err) {
           debug("clienttransaction err: %s ",err);
           return next(err);
         }
        if (clienttransaction==null) { // No results.
            var err = new Error('Client Transaction copy not found');
            err.status = 404;
            return next(err);
          }
        // Successful, so render.
        res.render('clienttransaction_detail', { title: 'Client:', clienttransaction:  clienttransaction});
      })

  };

// Display ClientTransaction create form on GET.
exports.clienttransaction_create_get = function(req, res, next) {

      Client.find({},'name')
      .exec(function (err, clients) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('clienttransaction_form', {title: 'Create ClientTransaction', client_list:clients});
      });

  };

// Handle ClientTransaction create on POST.
exports.clienttransaction_create_post = [
    // Validate fields.
    body('client', 'Client must be specified').isLength({ min: 1 }).trim(),
    body('module', 'Module name must be specified').isLength({ min: 1 }).trim(),
    body('transaction_date', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('client').trim().escape(),
    sanitizeBody('module').trim().escape(),
    //sanitizeBody('status').trim().escape(),
    sanitizeBody('transaction_date').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a ClientTransaction object with escaped and trimmed data.
        var clienttransaction = new ClientTransaction( //.body. here is body of request which has many key fields
          { client: req.body.client,
            module: req.body.module,
            //status: req.body.status,
            transaction_date: req.body.transaction_date
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Client.find({},'title')
                .exec(function (err, clients) {
                    if (err) {
                      console.log('problem in clienttransaction_create_post');
                      return next(err); }
                    // Successful, so render.
                    res.render('clienttransaction_form', { title: 'Create ClientTransaction', client_list : clients, selected_client : clienttransaction.client._id , errors: errors.array(), clienttransaction:clienttransaction });
            });
            return;
        }
        else {
            // Data from form is valid.
            clienttransaction.save(function (err) {
                if (err) { return next(err); }
                   //else Successful - redirect to new record.
                   res.redirect(clienttransaction.url);
                });
        }
    }
];

// Display ClientTransaction delete form on GET.
exports.clienttransaction_delete_get = function(req, res, next) {
      //async.parallel({key1:func,key2:func},function(err,results))
      async.parallel({
          clienttransaction: function(callback) { //was author:...
              ClientTransaction.findById(req.params.id).exec(callback) //was Author
          },
          //authors_clients: function(callback) {
            //Client.find({ 'author': req.params.id }).exec(callback)
          //},
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.clienttransaction==null) { //was results.author  // No results.
              res.redirect('/catalog/clienttransactions'); //was /authors
          }
          // Successful, so render.
          //res.render('author_delete', { title: 'Delete Author', author: results.author, author_clients: results.authors_clients } );
          ////res.render('clienttransaction_delete', { title: 'Delete ClientTransaction', clienttransaction: results.clienttransaction, clienttitle: results.clienttransaction.client.title });
      });

  };

// Handle ClientTransaction delete on POST.
exports.clienttransaction_delete_post = function(req, res, next) {
  // client transactions being deleted have no dependencies; just do it.
  ClientTransaction.findByIdAndRemove(req.body.clienttransactionid, function deleteClientTransaction(err) {  //was Autthor....req.body.authorid, fn deletAuthor
      if (err) { return next(err); }
      // Success - go to clienttransactions list
      res.redirect('/catalog/clienttransactions')
  })
  };

// Display ClientTransaction update form on GET.
exports.clienttransaction_update_get = function(req, res, next) {
  ClientTransaction.findById(req.params.id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
  .populate('clienttransaction client') //populate the nested client model with the client values
  .exec(function (err, clienttransaction) {
    if (err) {
       debug("clienttransaction err: %s ",err);
       return next(err);
     }
    if (clienttransaction==null) { // No results.
        var err = new Error('Client copy not found');
        err.status = 404;
        return next(err);
      }
    // Successful, so render.
    let transaction_date = clienttransaction.transaction_date ? moment(clienttransaction.transaction_date).format() : '';
    let module = clienttransaction.module;
    let status = clienttransaction.status;
    //replacement group which must be added after any change leading to a reconnection!!!
    //ie will not mpass a 'restart of mongodb connection',  to be placed in clienttransactionUpdate_form.pug

    ////res.render('clienttransactionUpdate_form', { title: 'Client:', clienttransaction: clienttransaction, due_back: due_date, statusArray: statsArray});
  })

};

// Handle clienttransaction update on POST.
  exports.clienttransaction_update_post = [
      // Validate fields.
      body('client', 'Client must be specified').isLength({ min: 1 }).trim(),
      body('module', 'Module name must be specified').isLength({ min: 1 }).trim(),
      body('status', 'give order status').isLength({min:1}).trim(),
      body('transaction_date', 'Purchase date').optional({ checkFalsy: true }).isISO8601(),

      // Sanitize fields.
      sanitizeBody('client').trim().escape(),
      sanitizeBody('module').trim().escape(),
      sanitizeBody('status').trim().escape(),
      sanitizeBody('due_back').toDate(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          // Create a ClientTransaction object with escaped and trimmed data and old id
          var clienttransaction = new ClientTransaction( //.body. here is body of request which has many key fields
            { client: req.body.client,
              module: req.body.module,
              status: req.body.status,
              transaction_date: req.body.transaction_date,
              _id:req.params.id //This is required, or a new ID will be assigned!
             });

          if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values and error messages.
              Client.find({},'title')
                  .exec(function (err, clients) {
                      if (err) { return next(err); }
                      // Successful, so render.
                      res.render('clienttransaction_form', { title: 'Create ClientTransaction', client_list : clients, selected_client : clienttransaction.client._id , errors: errors.array(), clienttransaction:clienttransaction });
              });
              return;
          }
          else {
              // Data from form is valid.
              ClientTransaction.findByIdAndUpdate(req.params.id,clienttransaction,{}, function (err,theclienttransaction) {
                  if (err) { return next(err); }
                     //else Successful - redirect to new record.
                     res.redirect(clienttransaction.url);
                  });
          }
      }
  ];
