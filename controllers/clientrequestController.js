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
  console.log('@@@ $ at clientrequest_list');
  ClientRequest.find({}, 'status client')
    //.populate('client')
    .exec(function (err, list_clientrequests) {
      if (err) { return next(err); }
      console.log('@@@ $ found clientrequests as per: ');
      console.log(list_clientrequests);
      res.render('clientrequest_list', { title: 'Client Request List', clientrequest_list: list_clientrequests });
    });

};

// Display detail page for a specific ClientRequest.
exports.clientrequest_detail = function(req, res, next) {
      console.log('@@@ $ entering client_request_detail');
      var id = req.params.id;
      console.log('@@@ $ looking for CR with id: ' + id);

      ClientRequest.findById(id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
        .populate('client')
        .exec(function (err, clientrequest) { //results of findById passed as clientrequest
        console.log('@@@ $ returned value for clientrequest:');
        console.log(clientrequest);
        if (err) {
           console.log("@@@ $ findById error: " + err);
           debug("clientrequest err: %s ",err);
           return next(err);
         }
        if (clientrequest==null) { // No results.
            console.log('@@@ $  err: no clientrequest found for this id ')
            var err = new Error('null clientrequest found');
            err.status = 404;
            return next(err);
          }
        //populate client
        ClientRequest.populate(clientrequest,'client',function(err,user){
              console.log('@@@ $$ should have user: ' + user ); // + '  +user.client.name:' + user.client.name);
              if(err)return console.error('@@@ $$ cannot populate client: err ' + err);
        })
        // Successful, so render.
        console.log('@@@ $ rendering clientrequest_detail with clientrequest: ' + clientrequest);
        res.render('clientrequest_detail', { title: 'ClientRequest: ', clientrequest:  clientrequest});
      })

  };

// Display ClientRequest create form on GET.
exports.clientrequest_create_get = function(req, res, next) {

      Client.find({},'client') //???
      .exec(function (err, clients) {
        if (err) { return next(err); }
        // Successful, so render.
        console.log("@@@ $ rendering clientrequest_form for clreq_create_get");
        console.log('@@@ $ client_list: ' + clients);
        res.render('clientrequest_form', {title: 'Create ClientRequest', client_list:clients});
      });

  };


// Handle ClientRequest create on POST.
exports.clientrequest_create_post = [
    // Convert the appname to an array.
    (req, res, next) => {
       if(!(req.body.appname instanceof Array)){
           if(typeof req.body.appname ==='undefined')
           req.body.appname=[];
           else
           req.body.appname=new Array(req.body.appname);
       }
       next();
    },

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
    body('appname', 'choose application from dropdown list').isLength({ min: 1 }).trim(),
    body('status', 'current status').isLength({min:1}).trim(),
    body('date_entered', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('client').trim().escape(),
    sanitizeBody('appname').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('date_entered').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a ClientRequest object with escaped and trimmed data.
        var clientrequest = new ClientRequest( //.body. here is body of request which has many key fields
          { client: req.body.client,
            appname: req.body.appname,
            status: req.body.status,
            date_entered: req.body.date_entered
           });

        if (!errors.isEmpty()) {
            console.log('@@@ $ in clientrequest_create_post, validate error report not empty');
            console.log('@@@ $ errors: ' + errors);
            // There are errors. Render form again with sanitized values and error messages.
            // Get all authors and appnames & statii for form.
            async.parallel({
                clients: function(callback) {
                    Client.find(callback);
                },
                appnames: function(callback) {
                    Appname.find(callback);
                },
                statii: function(callback) {
                    Status.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected appnames as checked.
                for (let i = 0; i < results.appnames.length; i++) {
                    if (clientrequest.appname.indexOf(results.appnames[i]._id) > -1) {
                        results.appnames[i].checked='true';
                    }
                }

                for (let i = 0; i < results.statii.length; i++) {
                     if (clientrequest.status.indexof(results.statii[i]._id) > -1) {
                        results.statii[i].checked= 'true';
                     }
                 }
                 res.render('clientrequest_form', { title: 'Create ClientRequest',clients:results.clients, appnames:results.appnames, clientrequest: clientrequest, errors: errors.array() });
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
      console.log('@@@ $ entering clientrequest_delete_get params follows');
      console.log(req.params);

      ClientRequest.findByIdAndRemove(req.params.id, function deleteClientRequest(err){
                 if(err){
                   console.log('@@@ $ error in deleting (fast) clientrequest: ' + err);
                   return next(err);
                 }
                console.log('@@@ $ redirecting to clientrequests for res: ' + res);
                res.redirect('/catalog/clientrequests')
      });//ends findby etc..
  }; //ends export.clientrequest_delete_get
      //here was async.parallel({key1:func,key2:func},function(err,results))


// Handle ClientRequest delete on POST.
exports.clientrequest_delete_post = function(req, res, next) {
  console.log('@@@ $ entering clientrequest_delete_post req.params below');
  console.log(req.params);
  // client instances being deleted have no dependencies; just do it.
  ClientRequest.findByIdAndRemove(req.params.id, function deleteClientRequest(err) {  //was Autthor....req.body.authorid, fn deletAuthor
      if (err) {
        console.log('delete_post err is: ' + err);
        return next(err);
      }
      // Success - go to clientrequests list
      //res.redirect('/catalog/clientrequests')
      return;
  })
  };

// Display ClientRequest update form on GET.
exports.clientrequest_update_get = function(req, res, next) {
  // Get book, authors and genres for form.
  async.parallel({
      clientrequest: function(callback) {
          ClientRequest.findById(req.params.id).populate('client').populate('appname').populate('status').exec(callback);
      },
      authors: function(callback) {
          Client.find(callback);
      },
      appnames: function(callback) {
          Appname.find(callback);
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
          for (var all_m_iter = 0; all_m_iter < results.appnames.length; all_m_iter++) {
              for (var clientrequest_m_iter = 0; clientrequest_m_iter < results.clientrequest.appname.length; clientrequest_m_iter++) {
                  if (results.appnames[all_m_iter]._id.toString()==results.clientrequest.appname[clientrequest_m_iter]._id.toString()) {
                      results.appnames[all_m_iter].checked='true';
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
          res.render('clientrequest_form', { title: 'Update ClientRequest', clients:results.clients, appnames:results.appnames, clientrequest: results.clientrequest });
      });

};

// Handle clientrequest update on POST.
  exports.clientrequest_update_post = [
      // Validate fields.
      body('appname', 'Specify which app: eg "PieSlicer"').isLength({ min: 1 }).trim(),
      body('status', 'optional').isLength({ min: 1 }).trim(),
      body('date_entered', 'Request date').optional({ checkFalsy: true }).isISO8601(),

      // Sanitize fields.
      sanitizeBody('appname').trim().escape(),
      sanitizeBody('status').trim().escape(),
      sanitizeBody('date_entered').toDate(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          // Create a ClientRequest object with escaped and trimmed data and old id
          var clientrequest = new ClientRequest( //.body. here is body of request which has many key fields
            { client: req.body.client,
              appname: req.body.appname,
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
