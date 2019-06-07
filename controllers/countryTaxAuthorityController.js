//client instance controller js
var CountryTaxAuthority = require('../models/countryTaxAuthority'); //collection 'countrytaxauthorities'
var ProvStateTaxAuthority = require('../models/provstateTaxAuthority');// 'provstatetaxautorities'
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
exports.countrytaxauthority_detail = function(req, res, next) {
      //console.log('@@@ $ entering client_request_detail');
      var id = req.params.id;
      console.log('@@@ $ looking for CntryTxAuth with id: ' + id);

      CountryTaxAuthority.findById(id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
        //.populate('client')
        .exec(function (err, countrytaxauthority) { //results of findById passed as countrytaxauthority
        console.log('@@@ $ returned value for countrytaxauthority:');
        console.log(countrytaxauthority);
        if (err) {
           console.log("@@@ $ findById error: " + err);
           debug("countrytaxauthority err: %s ",err);
           return next(err);
         }
        if (countrytaxauthority==null) { // No results.
            console.log('@@@ $  err: no countrytaxauthority found for this id ')
            var err = new Error('null countrytaxauthority found');
            err.status = 404;
            return next(err);
          }
        //populate client
        //ClientRequest.populate(clientrequest,'client',function(err,user){
              //console.log('@@@ $$ should have user: ' + user ); // + '  +user.client.name:' + user.client.name);
              //if(err)return console.error('@@@ $$ cannot populate client: err ' + err);
        //})
        // Successful, so render.
        console.log('@@@ $ rendering countrytaxauthority_detail with countrytaxauthority: ' + countrytaxauthority);
        res.render('countrytaxauthority_detail', { title: 'Country Tax Authority Detail: ', countrytaxauthority:  countrytaxauthority});
      })

  };

// Display CountryTaxAuthority create form on GET.
exports.countrytaxauthority_create_get = function(req, res, next) {
        res.render('countrytaxauthority_form', {title: 'Create CountryTaxAuthority'});
  };


// Handle ClientRequest create on POST.
exports.countrytaxauthority_create_post = [
    // Validate fields.
    body('country_code', 'choose country code from dropdown list').isLength({ max: 2 }).trim(),
    body('allowed', 'True/False value for "allowed"').isBoolean().withMessage('Boolean (true/false), must reflect current status of allowed/not allowed to sell'),
    body('rate', 'tax rate').isDecimal({ local:"en-US",checkFalsy:true}),
    body('restriction_code','0:none,1:#transactions,2:total sales, 3:both').isInt({no_symbols: true, max:3}).withMessage("only codes allowed: 0:none, 1:# trans., 2:$ amnt., 3:both"),
    body('transaction_limit').isNumeric({no_symbols: true}),
    body('amount_limit').isNumeric({no_symbols: true}),
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
            res.render('countrytaxauthorityErr_form', { title: 'Create CountryTaxAuthority', countrytaxauthority: req.body, errors: errors.array() });
            return;
          }

          //temporarily to check out validators, make no record
          res.render('countrytaxauthorityErr_form', { title: 'Create CountryTaxAuthority', countrytaxauthority: req.body, errors: errors.array() });
          return;

        // Create a countrytaxauthority object with escaped and trimmed data.
        var countrytaxauthority = new CountryTaxAuthority( //.body. here is body of request which has many key fields
          {
            country_code: req.body.country_code,  //needs to be ._id of valid client
            allowed: req.body.allowed,
            rate: req.body.rate,
            restriction_code: req.body.restriction_code,
            transaction_limit: req.body.transaction_limit,
            amount_limit: req.body.amount_limit,
            transaction_period: req.body.transaction_period
           });


          // Data from form is valid.
          countrytaxauthority.save(function (err) {
            if (err) { return next(err); }
               //else Successful - redirect to new record.
               res.redirect(countrytaxauthority.url);
            });//ends save function
    } // ends the fat arrow req, res, next  fn
]

// Display countrytaxauthority delete form on GET.
exports.countrytaxauthority_delete_get = function(req, res, next) {
      console.log('@@@ $ entering countrytaxauthority_delete_get params follows');
      console.log(req.params);

      CountryTaxAuthority.findByIdAndRemove(req.params.id, function deletecountrytaxauthority(err){
                 if(err){
                   console.log('@@@ $ error in deleting (fast) countrytaxauthority: ' + err);
                   return next(err);
                 }
                console.log('@@@ $ redirecting to countrytaxauthorities for res: ' + res);
                res.redirect('/catalog/countrytaxauthorities')
      });//ends findby etc..
  }; //ends export.clientrequest_delete_get
      //here was async.parallel({key1:func,key2:func},function(err,results))


// Handle ClientRequest delete on POST.
exports.countrytaxauthority_delete_post = function(req, res, next) {
  console.log('@@@ $ entering countrytaxauthority_delete_post req.params below');
  console.log(req.params);
  // client instances being deleted have no dependencies; just do it.
  CountryTaxAuthority.findByIdAndRemove(req.params.id, function deleteCountryTaxAuthority(err) {  //was Autthor....req.body.clientid, fn deletclient
      if (err) {
        console.log('delete_post err is: ' + err);
        return next(err);
      }
      // Success - go to clientrequests list
      //res.redirect('/catalog/clientrequests')
      return;
  })
  };
