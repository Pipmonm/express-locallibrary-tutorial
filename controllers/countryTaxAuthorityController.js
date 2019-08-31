//client instance controller js
var CountryTaxAuthority = require('../models/countryTaxAuthority'); //collection 'countrytaxauthorities'
var RegionalAuthority = require('../models/regionalAuthority');// 'regionaltaxautorities'
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

// Display list of all countrytaxauthorities.
exports.countrytaxauthorities_list = function(req, res, next) {
  console.log('@@@ $ at countryTaxAuthorities_list');
  CountryTaxAuthority.find({}) //was   ({}),'status'
    //.populate({
       //path:'regionaltaxauthorities', //2019-06-05 a guess as to path
       //model:'regionalTaxAuthority'})  //have attempted 'Client' & others
    .exec(function (err, countrytaxauthorities) {
      console.log("@@@ $ executing callback for countrytaxauthorities list; if err> : " + err );
      if (err) { return next(err); }
      console.log('@@@ $ found countrytaxauthorities as per: ');
      console.log(countrytaxauthorities);
      res.render('countrytaxauthorities_list', { title: 'Country Tax Auth List', countrytaxauthorities_list: countrytaxauthorities });
    });

};

// Display detail page for a specific countrytaxauthority.
exports.countrytaxauthority_detail = function(req, res, next) {
      //console.log('@@@ $ entering client_request_detail');
      //var id = req.params.id;
      var id = mongoose.Types.ObjectId(req.params.id.toString());
      console.log('@@@ $ looking for CntryTxAuth with id: ', id);

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
        //countrytaxauthority.populate(countrytaxauthority,'client',function(err,user){
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


// Handle countrytaxauthority create on POST.
exports.countrytaxauthority_create_post = [
    // Validate fields.
    body('country_name', 'specify country name').trim(),
    body('country_code', 'choose country code from dropdown list').isLength({ max: 2 }).trim(),
    body('allowed', 'True/False value for "allowed"').isBoolean().withMessage('Boolean (true/false), must reflect current status of allowed/not allowed to sell'),
    body('rate', 'tax rate').isDecimal({ local:"en-US",checkFalsy:true}),
    body('restriction_code','0:none,1:#transactions,2:total sales, 3:both').isInt({no_symbols: true, max:3}).withMessage("only codes allowed: 0:none, 1:# trans., 2:$ amnt., 3:both"),
    body('transaction_limit').isNumeric({no_symbols: true}),
    body('current_count').isNumeric({no_symbols:true}),
    body('amount_limit').isNumeric({no_symbols: false}),
    body('current_year_amount').isNumeric({no_symbols: false}),
    //body('previous_years_amounts').isArray(),
    body('current_quarter_amount').isNumeric({no_symbols: false}),
    //body('last_three_quarters_array').isArray(),
    body('current_four_quarters_amount').isNumeric({no_symbols:false}),
    //body('previous_quarters_amounts').isArray(),
    body('transaction_period_type').isIn(['week','month','quarter','year']),
    body('for_period_index').isIn([0,1,2,3]),
    body('date_entered', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),  //need to integrate isBefore(str [, date])

    // Sanitize fields.
    sanitizeBody('country_name').trim().escape(),
    sanitizeBody('country_code').trim().escape(),
    sanitizeBody('allowed').trim().escape(),
    sanitizeBody('rate').trim().escape(),
    sanitizeBody('restriction').trim().escape(),
    sanitizeBody('transaction_limit').trim().escape(),
    sanitizeBody('current_count').trim().escape(),
    sanitizeBody('amount_limit').trim().escape(),
    sanitizeBody('current_year_amount').trim().escape(),
    sanitizeBody('target_previous_years_amounts').trim().escape(),
    sanitizeBody('current_quarter_amount').trim().escape(),
    sanitizeBody('target_last_three_quarters_array').trim().escape(),
    sanitizeBody('current_four_quarters_amount').trim().escape(),
    sanitizeBody('previous_quarters_amounts').trim().escape(),
    sanitizeBody('transaction_period_type').trim().escape(),
    sanitizeBody('for_period_index').trim().escape(),
    //sanitizeBody('for_period_index').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            let allowedProxy = false;
            if(req.body.allowed)allowedProxy = 'true';//as a string???
            console.log('@@@ $ Console: errors spotted in validationResult for "countrytaxauthority_create_post"');
            debug('DEBUG: errors spotted in validationResult for "countrytaxauthority_create_post"');
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('countrytaxauthorityErr_form', { title: 'Create CountryTaxAuthority', countrytaxauthority: req.body,allowedProxy:allowedProxy, errors: errors.array() });
            return;
          }
          //temporarily to check out validators, make no record
          //res.render('countrytaxauthorityErr_form', { title: 'Create CountryTaxAuthority', countrytaxauthority: req.body, transactPeriod:transactPeriod, errors: errors.array() });
          //return;

        // Create a countrytaxauthority object with escaped and trimmed data.
        var countrytaxauthority = new CountryTaxAuthority( //.body. here is body of request which has many key fields
          {
            country_name: req.body.country_name,
            country_code: req.body.country_code,  //needs to be ._id of valid client
            allowed: req.body.allowed,
            rate: req.body.rate,
            restriction_code: req.body.restriction_code,
            transaction_limit: req.body.transaction_limit,
            current_count: req.body.current_count,
            amount_limit: req.body.amount_limit,
            current_year_amount: req.body.current_year_amount,
            previous_years_amounts:req.body.previous_years_amounts,
            current_quarter_amount:req.body.current_quarter_amount,
            last_three_quarters_array:req.body.last_three_quarters_array,
            current_four_quarters_amount:req.body.current_four_quarters_amount,
            previous_quarters_amounts:req.body.previous_quarters_amounts,
            transaction_period_type: req.body.transaction_period_type,
            for_period_index: req.body.for_period_index
           });


          // Data from form is valid.
          countrytaxauthority.save(function (err) {
            if (err) {
              console.log("@@@ $ saving new countryTA gives err: ",err);
              return next(err);
            }
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
  }; //ends export.countrytaxauthority_delete_get
      //here was async.parallel({key1:func,key2:func},function(err,results))


// Handle countrytaxauthority delete on POST.
exports.countrytaxauthority_delete_post = function(req, res, next) {
  console.log('@@@ $ entering countrytaxauthority_delete_post req.params below');
  console.log(req.params);
  // client instances being deleted have no dependencies; just do it.
  CountryTaxAuthority.findByIdAndRemove(req.params.id, function deleteCountryTaxAuthority(err) {  //was Autthor....req.body.clientid, fn deletclient
      if (err) {
        console.log('delete_post err is: ' + err);
        return next(err);
      }
      // Success - go to countrytaxauthoritys list
      //res.redirect('/catalog/countrytaxauthoritys')
      return;
  })
  };

//adding missing countrytaxauthority_update_get
// Display countrytaxauthority update form on GET.
exports.countrytaxauthority_update_get = function(req, res, next) {
  console.log("@@@ $ sanitizing body in countrytaxauthorityUpdate");
      //req.params.sanitize('id').escape().trim();
      sanitizeBody(req.params.id).trim().escape();
      console.log("@@@ $ passed sanitizeBody for id: & id is: ",req.params.id);
      async.parallel({
       countrytaxauthority: function(callback) {
        CountryTaxAuthority.findById(req.params.id).exec(callback)
        }, //only one function called asynchronously. ending comma allowed to simplify chaining a possible next one
       }, function(err, results) {   //note leading "}" closes async's opening "{"
        console.log("@@@ $ in CTA.findById callback")
        if(err) {
         console.log("@@@ $ error in CTA.findById callback ",err);
         debug('update error ' + err);
         return next(err);
         }

       //let email = results.client.email_address;
       //if(!check('email').isEmail){
         //debug('invalid email');
         //console.log('@@@ $ doing funny error for inv. email in client_update_get');
         //return -1;//need to generate an error of some sort here
       //}else{  //not aware of callback style validator for emails, following is newer version
         //email =  check('email').isEmail().normalizeEmail();
       //}
       console.log("@@@ $ render CTA update form next:  using results???  vv");
       console.log(results);
       console.log("@@@ $ try a results parameter: results.countrytaxauthority.country_name: ",results.countrytaxauthority.country_name);

       if(req != undefined)console.log("@@@ $ req is: ",req,"  of type: ",typeof req);
       console.log("@@@ $ results.countrytaxauthority.for_period_index is ",results.countrytaxauthority.for_period_index);
       //2019-06-12 req.body == {} at this point- confirmed

       let allowedProxy = false;
       if(results.countrytaxauthority.allowed)allowedProxy = 'true';//as a string???
       //let transactPeriod = req.body.transaction_date.toJSON();
       //console.log("@@@ $ transPeriod & type: ",transactPeriod,"   & type: ",typeof transactPeriod);
       //transactPeriod = transactPeriod.split("T")[0]//suddenly need to remove .toISOString() ???
                                                     //take only yyyy-mm-dd portion

       res.render('countrytaxauthorityErr_form', { title: 'Update CountryTaxAuthority', countrytaxauthority: results.countrytaxauthority,allowedProxy:allowedProxy});//2019-06-12
       //res.render('countrytaxauthorityUpdate_form', { title: 'Update CountryTaxAuthority', countrytaxauthority: results.client, query: "Update"});
  });//async ends note closing } is not for async's opening "{", that's closed above, this one closes  fn(err,rslts){
}; //export fn ends  NOTE this is a request to update with changes, only accepted if posted (as follows)



  // Handle countrytaxauthority update on POST.
    exports.countrytaxauthority_update_post = [
      // Validate fields.
      body('country_name', 'specify country name').trim(),
      body('country_code', 'choose country code from dropdown list').isLength({ max: 2 }).trim(),
      body('allowed', 'True/False value for "allowed"').isBoolean().withMessage('Boolean (true/false), must reflect current status of allowed/not allowed to sell'),
      body('rate', 'tax rate').isDecimal({ local:"en-US",checkFalsy:true}),
      body('restriction_code','0:none,1:#transactions,2:total sales, 3:both').isInt({no_symbols: true, max:3}).withMessage("only codes allowed: 0:none, 1:# trans., 2:$ amnt., 3:both"),
      body('transaction_limit').isNumeric({no_symbols: true}),
      body('current_count').isNumeric({no_symbols:true}),
      body('amount_limit').isNumeric({no_symbols: false}),
      body('current_year_amount').isNumeric({no_symbols: false}),
      //body('previous_years_amounts').isArray(),
      body('current_quarter_amount').isNumeric({no_symbols: false}),
      //body('last_three_quarters_array').isArray(),
      body('current_four_quarters_amount').isNumeric({no_symbols:false}),
      //body('previous_quarters_amounts').isArray(),
      body('transaction_period_type').isIn(['week','month','quarter','year']),
      body('for_period_index').isIn([0,1,2,3]),
      body('date_entered', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
      body('transaction_date', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),  //need to integrate isBefore(str [, date])

      // Sanitize fields.
      sanitizeBody('country_name').trim().escape(),
      sanitizeBody('country_code').trim().escape(),
      sanitizeBody('allowed').trim().escape(),
      sanitizeBody('rate').trim().escape(),
      sanitizeBody('restriction').trim().escape(),
      sanitizeBody('transaction_limit').trim().escape(),
      sanitizeBody('current_count').trim().escape(),
      sanitizeBody('amount_limit').trim().escape(),
      sanitizeBody('current_year_amount').trim().escape(),
      sanitizeBody('target_previous_years_amounts').trim().escape(),
      sanitizeBody('current_quarter_amount').trim().escape(),
      sanitizeBody('target_last_three_quarters_array').trim().escape(),
      sanitizeBody('current_four_quarters_amount').trim().escape(),
      sanitizeBody('previous_quarters_amounts').trim().escape(),
      sanitizeBody('transaction_period_type').trim().escape(),
      sanitizeBody('for_period_index').trim().escape(),
      //sanitizeBody('for_period_index').toDate(),

        // Process request after validation and sanitization.
        (req, res, next) => {

            // Extract the validation errors from a request.
            const errors = validationResult(req);
            if(req != undefined)console.log("@@@ $ req is: ",req,"  of type: ",typeof req);
            console.log("@@@ $ req.body: below vvvv");
            if(req.body != undefined)console.log(req.body);
            console.log("@@@ or from params: ");
            if(req.params!=undefined)console.log(req.params);
            if(req.body.for_period_index != undefined)console.log("period index is: ",req.body.for_period_index);
            //yearMonthDayUTC: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
            //let transactPeriod = req.body.transaction_date.toJSON();//was   req.params.id.toString())
            //console.log("@@@ $ transactPeriod & type: ",transactPeriod,"   & type: ",typeof transactPeriod);
            //transactPeriod = transactPeriod.split("T")[0]//suddenly need to remove .toISOString() ???
            //let transactPeriod = "2019-12-31";                         //take only yyyy-mm-dd portion

            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values and error messages.
                let allowedProxy = false;
                if(req.body.allowed)allowedProxy = 'true';//as a string???
                console.log('@@@ $ rendering countrytaxauthority_form for redisplay in clrq_update_post (validation err)');
                res.render('countrytaxauthorityErr_form', { title: 'Update CountryTaxAuthority', countrytaxauthority: req.body,allowedProxy:allowedProxy, errors: errors.array() });
                //res.render('countrytaxauthorityUpdate_form', { title: 'Update CountryTaxAuthority', errors: errors.array(), countrytaxauthority:countrytaxauthority });
                return;

            } else {
                console.log('@@@ $ updating countrytaxauthority document');
                if(req.body != undefined)console.log(req.body);
                if(req.params!=undefined)console.log("req.params: ",req.params);
                if(req.params!=undefined)console.log("req.params.id: ",req.params.id);
                // Data from form is valid.
                CountryTaxAuthority.findByIdAndUpdate(req.params.id,req.body,{}, function (err,thecountrytaxauthority) { //2019-06-10  was "thecountrytaxauthority"
                    if (err) {
                      console.log('@@@ $ updating countrytaxauthority document throws err: ' + err);
                      return next(err);
                    }
                       //else Successful - redirect to new record.
                       res.redirect(thecountrytaxauthority.url);
                    });//closes findbyidandupdate
            }//closes else clause
        }//closes fat arrow req,res,next
    ]
