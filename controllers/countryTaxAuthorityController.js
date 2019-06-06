//client instance controller js
var CountryTaxAuthority = require('../models/countrytaxauthority'); //collection 'countrytaxauthorities'
var ProvStateTaxAuthority = require('../models/provstatetaxauthority');// 'provstatetaxautorities'
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

// Display list of all ClientRequests.
exports.countrytaxauthorities_list = function(req, res, next) {
  console.log('@@@ $ at countriesTaxAuthorities_list');
  CountryTaxAuthority.find({}) //was   ({}),'status'
    .populate({
       path:'provstatetaxauthorities', //2019-06-05 a guess as to path
       model:'ProvStateTaxAuthority'})  //have attempted 'Client' & others
    .exec(function (err, provstatetaxauthorities) {
      console.log("@@@ $ executing callback for provstatetaxauthorities list; if err> : " + err );
      if (err) { return next(err); }
      console.log('@@@ $ found provstatetaxauthorities as per: ');
      console.log(provstatetaxauthorities);
      res.render('provstatetaxauthorities_list', { title: 'Province or State List', provstatetaxauthorities_list: provstatetaxauthorities });
    });

};

// Display detail page for a specific ClientRequest.
exports.clientrequest_detail = function(req, res, next) {
      //console.log('@@@ $ entering client_request_detail');
      var id = req.params.id;
      console.log('@@@ $ looking for ClReq with id: ' + id);

      ClientRequest.findById(id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
        //.populate('client')
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
        //ClientRequest.populate(clientrequest,'client',function(err,user){
              //console.log('@@@ $$ should have user: ' + user ); // + '  +user.client.name:' + user.client.name);
              //if(err)return console.error('@@@ $$ cannot populate client: err ' + err);
        //})
        // Successful, so render.
        console.log('@@@ $ rendering clientrequest_detail with clientrequest: ' + clientrequest);
        res.render('clientrequest_detail', { title: 'ClientRequest: ', clientrequest:  clientrequest});
      })

  };

// Display ProvStateTaxAuthority create form on GET.
exports.countrytaxauthority_create_get = function(req, res, next) {
        res.render('countrytaxauthority_form', {title: 'Create CountryTaxAuthority', countrytaxauthority_list:countrytaxauthorities});
  };


// Handle ClientRequest create on POST.
exports.countrytaxauthority_create_post = [
    // Validate fields.
    body('country_code', 'choose country code from dropdown list').isLength({ max: 2 }).trim(),
    body('allowed', 'True/False value for "allowed"').isBoolean().withMessage('Boolean, must reflect current status of allowed/not allowed to sell'),
    body('rate', 'tax rate').isNumeric({no_symbols: false}),
    body('restriction_code','0:none,1:#transactions,2:total sales, 3:both').isNumeric({no_symbols: false}),
    body('transaction_limit').isNumeric({no_symbols: false}),
    body('amount_limit').isNumeric({no_symbols: false}),
    body('transaction_period','expiry date of current transaction period').optional({ checkFalsy: true }).isISO8601(),
    body('date_entered', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),  //need to integrate isBefore(str [, date])

    // Sanitize fields.
    sanitizeBody('country').trim().escape(),
    sanitizeBody('allowed').trim().escape(),
    sanitizeBody('restriction').trim().escape(),
    sanitizeBody('transaction_limit').trim().escape(),
    sanitizeBody('amount_limit').trim().escape(),
    sanitizeBody('transaction_period').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('@@@ $ Console: errors spotted in validationResult for "countrytaxauthority_create_post"');
            debug('DEBUG: errors spotted in validationResult for "countrytaxauthority_create_post"');
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('countrytaxauthority_form', { title: 'Create CountryTaxAuthority'});
            return;

        // Create a ClientRequest object with escaped and trimmed data.
        var provstatetaxauthority = new ProvStateTaxAuthority( //.body. here is body of request which has many key fields
          {
            countrytaxauthority: req.body.country,  //needs to be ._id of valid client
            countrytaxauthorityname: req.body.StateOrProv,
            status: req.body.status,
            formatCode: req.body.formatCode,
            date_entered: req.body.date_entered
           });

           // Extract the validation errors from a request.
           const errors = validationResult(req);
           if (!errors.isEmpty()) {
               console.log('@@@ $ Console: errors spotted in validationResult for "client_create_post"');
               debug('DEBUG: errors spotted in validationResult for "client_create_post"');
               // There are errors. Render form again with sanitized values/errors messages.
               res.render('countrytaxauthority_form', { title: 'Create CountryTaxAuthority', client: req.body, errors: errors.array() });
               return;

        } else {
            // Data from form is valid.
            countrytaxauthority.save(function (err) {
                if (err) { return next(err); }
                   //else Successful - redirect to new record.
                   res.redirect(countrytaxauthority.url);
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
  ClientRequest.findByIdAndRemove(req.params.id, function deleteClientRequest(err) {  //was Autthor....req.body.clientid, fn deletclient
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
  //console.log('@@@ $ clientrequest_update_get starts; req below');
  //console.log(req);
  // Get clientrequest, clients and genres for form.
  Client = require('../models/client'); //for fun
  async.parallel({
      clientrequest: function(callback) {
          console.log('@@@ $ clientrequest async updt clrq.find + populate: get');
          console.log('@@@ $ with req.params.id= ' + req.params.id);
          ClientRequest.findById(req.params.id).populate('client').exec(callback);//.populate('client') removed
      },
      clients: function(callback) {
          console.log('@@@ $ clientrequest async updt clnt.find: get');
          Client.find(callback);
        },

      }, function(err, results) {
          if (err) {
            console.log('@@@ $ clientrequest get async updt err: ' + err);
            return next(err);
          }
          if (results.clientrequest==null) { // No results.
              console.log('@@@ $ clientrequest get async callback results == null ');
              var err = new Error('ClientRequest not found');
              err.status = 404;
              return next(err);
          }

          console.log('@@@ WOW clientrequest get update results: ');
          //console.log('clients: ' + results.clients);
          //console.log('clientrequest: ' + results.clientrequest);
          res.render('clientrequestUpdate_form', { title: 'Update ClientRequest', clients:results.clients, clientrequest: results.clientrequest });
      });

};

// Handle clientrequest update on POST.
  exports.clientrequest_update_post = [
      // Validate fields.
      body('client','required').isLength({min:1}).trim(),
      body('formatCode','required').isLength({min:4, max:10}).trim(),
      body('status', 'optional').isLength({ min: 1 }).trim(),
      body('date_entered', 'Request date').optional({ checkFalsy: true }).isISO8601(),

      // Sanitize fields.
      sanitizeBody('appname').trim().escape(),
      sanitizeBody('client').trim().escape(),
      sanitizeBody('formatCode').trim().escape(),
      sanitizeBody('status').trim().escape(),
      sanitizeBody('date_entered').toDate(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          // Create a ClientRequest object with escaped and trimmed data and old id
          var clientrequest = new ClientRequest( //.body. here is body of request which has many key fields
            {
              appname: req.body.appname,
              client: req.body.client,
              formatCode: req.body.formatCode,
              status: req.body.status,
              date_entered: req.body.date_entered,
              _id:req.params.id //This is required, or a new ID will be assigned!
             });

          if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values and error messages.

              Client.find()
                  .exec(function (err, clients) {
                      if (err) {
                        console.log('@@@ $ clrq_update_post err> ' + err);
                        return next(err);
                      }
                      // Successful, so render.
                      console.log('@@@ $ rendering clientrequest_form for redisplay in clrq_update_post (validation err)');

                      res.render('clientrequestUpdate_form', { title: 'Create ClientRequest', client_list : clients, selected_client : clientrequest.client._id , errors: errors.array(), clientrequest:clientrequest });
              });
              return;
          }
          else {
              console.log('@@@ $ updating clientrequest document');
              // Data from form is valid.
              ClientRequest.findByIdAndUpdate(req.params.id,clientrequest,{}, function (err,theclientrequest) {
                  if (err) {
                    console.log('@@@ $ updating clientrequest document throws err: ' + err);
                    return next(err);
                  }
                     //else Successful - redirect to new record.
                     res.redirect(clientrequest.url);
                  });
          }
      }
  ];
