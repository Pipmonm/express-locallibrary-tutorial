// appname controller
var Client = require('../models/client');
var ClientRequest = require('../models/clientrequest');
var Appname = require('../models/appname');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var debug = require('debug')('appname');

// Display list of all Appname.
exports.appname_list = function(req, res, next) {

  Appname.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_appnames) {
      if (err) { return next(err); } //used 'console.log(err)' to bypass 'next' err 2018-03-19 7:54 PM
      //Successful, so render
      res.render('appname_list', { title: 'Appnames', appname_list: list_appnames });
    });

};

// Display detail page for a specific Appname.
exports.appname_detail = function(req, res, next) {
  let id = mongoose.Types.ObjectId(req.params.id); //added :MOD: 2018-03-08 9:20
  async.parallel({
      appname: function(callback) {
          Appname.findById(req.params.id)// was  req.params.id  modded as per above change :MOD: 2018-03-08 9:20
            .exec(callback);
      },

      appname_clientrequests: function(callback) {
        console.log("@@@ $ going for roundup of clientrequests");
        ClientRequest.find({ 'appname': req.params.id }) //replaced req.params.id with id :MOD: 2018-03-08 9:28
        .exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      if (results.appname==null) { // No results.
          var err = new Error('Appname not found');
          err.status = 404;
          return debug('appname_detail error: ' + err); //was 'next(err)' 2018-03-19 7:54 PM
      }
      // Successful, so render
      res.render('appname_detail', { title: 'Appname Detail', appname: results.appname, appname_clientrequests: results.appname_clientrequests } );
  });

};

// Display Appname create form on GET.
exports.appname_create_get = function(req, res, next) {
    res.render('appname_form', { title: 'Create Appname', appname:"" });
  };

// Handle Appname create on POST. via some JSON object (how works?)
exports.appname_create_post = [
   // Validate that the name field is not empty.
   body('name', 'Application name required').isLength({ min: 1 }).trim(),

   // Sanitize (trim and escape) the name field.
   sanitizeBody('name').trim().escape(),

   // Process request after validation and sanitization.
   (req, res, next) => {

       // Extract the validation errors from a request.
       const errors = validationResult(req);

       // Create a appname object with escaped and trimmed data.
       var appname = new Appname(
         { name: req.body.name }
       );


       if (!errors.isEmpty()) {
           // There are errors. Render the form again with sanitized values/error messages.
           res.render('appname_form', { title: 'Create Appname', appname: appname, errors: errors.array()});
       return;
       }
       else {
           // Data from form is valid.
           // Check if Appname with same name already exists.
           Appname.findOne({ 'name': req.body.name })
               .exec( function(err, found_appname) {
                    if (err) { return next(err); }

                    if (found_appname) {
                        // Appname exists, redirect to its detail page.
                        res.redirect(found_appname.url);
                    }
                    else {

                        appname.save(function (err) {  //very suspicious use of lowercase for 'appname'?
                          if (err) { return next(err); }
                          // Appname saved. Redirect to appname detail page.
                          res.redirect(appname.url);
                        });

                    }

                });
       }
   }
];

// Display Appname delete form on GET.
exports.appname_delete_get = function(req, res) {
  async.parallel({
      appname: function(callback) {
          Appname.findById(req.params.id).exec(callback)
      },
      appname_clientrequests: function(callback) {
        Appname.find({ 'appname': req.params.id }).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.appname==null) { // No results.
          res.redirect('/catalog/appnames');
      }
      // Successful, so render.
      res.render('appname_delete', { title: 'Delete Appname', appname: results.appname, appname_clientrequests: results.appname_clientrequests } );
  });

};

// Handle Appname delete on POST.
exports.appname_delete_post = function(req, res, next) {

    async.parallel({  //arguments are 2 objects:  ({fn's},callback
        appname: function(callback) {
          Appname.findById(req.body.appnameid).exec(callback)
        },
        appname_clientrequests: function(callback) {
          ClientRequest.find({ 'appname': req.body.appnameid }).exec(callback)
        },
    }, function(err, results) {  //Object of fn's + call to callback ends,  callback fn definition starts
        if (err) { return next(err); }
        // Success
        if (results.appname_clientrequests.length > 0) {
            console.log("@@@ $ this appname is in other clientrequests");
            // Client has clientrequests Render in same way as for GET route.
            res.render('appname_delete', { title: 'Delete Appname', appname: results.appname, appname_clientrequests: results.appname_clientrequests } );
            return;
        } else {
            // Client has no clientrequests. Delete object and redirect to the list of clients.
            Appname.findByIdAndRemove(req.body.appnameid, function deleteAppname(err) {
                if (err) { return next(err); }
                // Success - go to client list
                console.log("@@@ $ redirect after Appname delete");
                res.redirect('/catalog/appnames');
            }) //findById ends
        } //callback fn ends
    }); //async ends
}; //export fn ends

// Display Appname update form on GET.
exports.appname_update_get = function(req, res, next) {
 //console.log("req.params.id is: " + req.params.id);
  let id = mongoose.Types.ObjectId(req.params.id); //added :MOD: 2018-03-08 9:20
  async.parallel({
      appname: function(callback) {
          Appname.findById(id)// was  req.params.id  modded as per above change :MOD: 2018-03-08 9:20
            .exec(callback);
      },

      appname_clientrequests: function(callback) {
        ClientRequest.find({ 'appname': id }) //replaced req.params.id with id :MOD: 2018-03-08 9:28
        .exec(callback);
      },

  }, function(err, results) {
      if (err) { return next(err); }
      if (results.appname==null) { // No results.
          var err = new Error('Appname not found');
          err.status = 404;
          return next(err);
      }
      //cannot stick final use of async results within callback (i.e. callback may be visited more than once!)
      res.render('appname_form', { title: 'Update Appname', appname: results.appname, clientrequest_list: results.appname_clientrequests });
   });//bracket ends callback function, parenthesis ends 'async.parallel' statement



};

// Handle Appname update on POST.
exports.appname_update_post = [
   // Validate that the name field is not empty.
   body('name', 'Application name required').isLength({ min: 1 }).trim(),

   // Sanitize (trim and escape) the name field.
   sanitizeBody('name').trim().escape(),

   // Process request after validation and sanitization.
   (req, res, next) => {

       // Extract the validation errors from a request.
       const errors = validationResult(req);

       // Create a appname object with escaped and trimmed data.
       var appname = new Appname(
         { name: req.body.name }
       );


       if (!errors.isEmpty()) {
           // There are errors. Render the form again with sanitized values/error messages.
           res.render('appname_form', { title: 'Create Appname', appname: appname, errors: errors.array()});
           return;
       }else{
           // Data from form is valid.
           // Check if Appname with same name already exists.
           Appname.findOne({ 'name': req.body.name })
               .exec( function(err, found_appname) {
                    if (err) { return next(err); }

                    if (found_appname) {
                        // Appname exists, redirect to its detail page.
                        res.redirect(found_appname.url);
                    }
                    else {
                      // Data from form is valid. Update the record.
                      Appname.findByIdAndUpdate(req.params.id, req.body, {}, function (err,theappname) {  //req.body was simply "client" (but caused error)
                        //appname.save(function (err) {
                          if (err) { return next(err); }
                        // Appname saved. Redirect to appname detail page.
                        res.redirect(appname.url);
                        });

                    }

                });
       }
   }
];
