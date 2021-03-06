//client instance controller js
var RegionalAuthority = require('../models/regionalAuthority');// 'regionaltaxautorities'
var regionalAuthority = require('../models/regionalAuthority'); //collection 'Regionalauthorities'
console.log("@@@ $ force update");
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

//2019-12-10 added function to allow presentation of transaction date in detail & update pugs
function findModdedIdString(inString){ //any changes here must be relfected in stripecontroller
  let modArray = inString.split(":");//2019-10-29 added
  let moddedSysIdString = modArray[0] + ":" + modArray[1] + ":" + modArray[2] + ":" + modArray[3].slice(0,2);//2019-10-29 added
  console.log("@@@ $ modded string from sysIdString): " + moddedSysIdString);//2019-10-29 modified
  return moddedSysIdString;
}

// Display list of all regionalauthorities.
exports.regionalauthorities_list = function(req, res, next) {
  console.log('@@@ $ at regionalAuthorities_list');
  RegionalAuthority.find({}) //was   ({}),'status'
    //.populate({
       //path:'regionaltaxauthorities', //2019-06-05 a guess as to path
       //model:'regionalTaxAuthority'})  //have attempted 'Client' & others
    .exec(function (err, regionalauthorities) {
      console.log("@@@ $ executing callback for regionalauthorities list; if err> : " + err );
      if (err) { return next(err); }
      console.log('@@@ $ found regionalauthorities as per: ');
      console.log(regionalauthorities);
      res.render('regionalauthorities_list', { title: 'Regional Tax Auth List', regionalauthorities_list: regionalauthorities });
    });

};

//Message facility for region disallowed message
exports.regionalauthority_disallowed_msg = function(req,res,next) {//2019-09-26  added

    let errMsg = "We are currently unable to  process your request due to" + "<br />" +
                  "Sales Tax restrictions in your province, state, or region.";
    let errMsg2 = "We regret the inconvenience and hope to have this matter" + "<br />" +
                  "resolved in the near future." + "<br />"+ "<br />" +
                  "Thank you for your patronage and please try again at a later date.";
    res.render('disallowedErrorMsg', { title: 'Request Cancelled', message:errMsg, message2:errMsg2});
    return;

}

// Display detail page for a specific regionalauthority.
exports.regionalauthority_detail = function(req, res, next) {
      //console.log('@@@ $ entering client_request_detail');
      //var id = req.params.id;
      var id = mongoose.Types.ObjectId(req.params.id.toString());
      console.log('@@@ $ looking for RegTxAuth with id: ', id);

      RegionalAuthority.findById(id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
        //.populate('client')
        .exec(function (err, regionalauthority) { //results of findById passed as regionalauthority
        console.log('@@@ $ returned value for regionalauthority:');
        console.log(regionalauthority);
        if (err) {
           console.log("@@@ $ findById error: " + err);
           debug("regionalauthority err: %s ",err);
           return next(err);
         }
        if (regionalauthority==null) { // No results.
            console.log('@@@ $  err: no regionalauthority found for this id ')
            var err = new Error('null regionalauthority found');
            err.status = 404;
            return next(err);
          }
        //populate client
        //regionalauthority.populate(regionalauthority,'client',function(err,user){
              //console.log('@@@ $$ should have user: ' + user ); // + '  +user.client.name:' + user.client.name);
              //if(err)return console.error('@@@ $$ cannot populate client: err ' + err);
        //})
        // Successful, so render.
        //see if arrays can be rendered by proxy somehow
        let p_y_amounts_Proxy = "[";//2019-08-31  we'll build it ourselves
        let arrayString = regionalauthority.previous_years_amounts;
        p_y_amounts_Proxy += arrayString + "]";
        let pyaProxy = {'pyaProxy': p_y_amounts_Proxy};

        let p_q_amounts_Proxy = "[";//2019-08-31  we'll build it ourselves
        arrayString = regionalauthority.previous_quarters_amounts;
        p_q_amounts_Proxy += arrayString + "]";
        let pqaProxy = {'pqaProxy': p_q_amounts_Proxy};

        let l_t_q_a_Proxy = "[";//2019-08-31  we'll build it ourselves
        arrayString = regionalauthority.last_three_quarters_array;
        l_t_q_a_Proxy += arrayString + "]";
        let threeQ = {'threeQProxy': l_t_q_a_Proxy};
        console.log("@@@ $ threeQ.threeQProxy is: ",threeQ.threeQProxy,"  from CTA.last3qrtsarray: ",regionalauthority.last_three_quarters_array);
        console.log('@@@ $ rendering regionalauthority_detail with regionalauthority: ' + regionalauthority);
        // Successful, so render.
        console.log('@@@ $ rendering regionalauthority_detail with regionalauthority: ' + regionalauthority);
        res.render('regionalauthority_detail', { title: 'Regional Tax Authority Detail: ',
                                                 regionalauthority:  regionalauthority,
                                                 threeQ: threeQ,
                                                 pyaProxy: pyaProxy,
                                                 pqaProxy: pqaProxy});
      })

  };

// Display regionalAuthority create form on GET.
exports.regionalauthority_create_get = function(req, res, next) {
        res.render('regionalauthority_form', {title: 'Create Regional Authority'});
  };


// Handle regionalauthority create on POST.
exports.regionalauthority_create_post = [
    // Validate fields.
    body('region_name', 'specify region name').trim(),
    body('region_code', 'choose region code from dropdown list').isLength({ max: 2 }).trim(),
    body('country', 'country name').trim(),
    body('allowed', 'True/False value for "allowed"').isBoolean().withMessage('Boolean (true/false), must reflect current status of allowed/not allowed to sell'),
    body('harmonized','True/False value for "harmonized"').isBoolean().withMessage('Boolean (true/false), true = fed + reg tax is combined'),
    body('fed_rate', 'fed tax rate').isDecimal({ local:"en-US",checkFalsy:true}),
    body('fed_rate_active','True/False value for "fed_rate_active"').isBoolean().withMessage('If Fed sales tax is triggered set to "true"'),
    body('reg_rate', 'region tax rate').isDecimal({ local:"en-US",checkFalsy:true}),
    body('restriction_code','0:none,1:#transactions,2:total sales, 3:both').isInt({no_symbols: true, max:3}).withMessage("only codes allowed: 0:none, 1:# trans., 2:$ amnt., 3:both"),
    body('transaction_limit').isNumeric({no_symbols: true}),
    body('current_count').isNumeric({no_symbols:true}),
    body('amount_limit').isNumeric({no_symbols: true}),
    body('current_year_amount').isNumeric({no_symbols: true}),
    //body('previous_years_amounts').isArray(),
    body('current_quarter_amount').isNumeric({no_symbols: false}),
    //body('last_three_quarters_array').isArray(),
    body('current_four_quarters_amount').isNumeric({no_symbols:false}),
    //body('previous_quarters_amounts').isArray(),

    body('transaction_period_type').isIn(['week','month','quarter','year']),
    body('for_period_index').isIn([0,1,2,3]),
    body('date_entered', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),  //need to integrate isBefore(str [, date])
    body('attempted','# attempts').trim(),
    // Sanitize fields.
    sanitizeBody('region_name').trim().escape(),
    sanitizeBody('region_code').trim().escape(),
    sanitizeBody('country').trim().escape(),
    sanitizeBody('allowed').trim().escape(),
    sanitizeBody('harmonized').trim().escape(),
    sanitizeBody('fed_rate_active').trim().escape(),
    sanitizeBody('restriction_code').trim().escape(),
    sanitizeBody('transaction_limit').trim().escape(),
    sanitizeBody('current_count').trim().escape(),
    sanitizeBody('amount_limit').trim().escape(),
    sanitizeBody("current_year_amount").trim().escape(),
    sanitizeBody('target_previous_years_amounts').trim().escape(),
    sanitizeBody('current_quarter_amount').trim().escape(),
    sanitizeBody('target_last_three_quarters_array').trim().escape(),
    sanitizeBody('current_four_quarters_amount').trim().escape(),
    sanitizeBody('previous_quarters_amounts').trim().escape(),
    sanitizeBody('transaction_period_type').trim().escape(),
    sanitizeBody('for_period_index').trim().escape(),
    sanitizeBody('attempted').trim().escape(),
    //sanitizeBody('for_transaction_period').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        let stringDate = req.body.for_transaction_period;//2019-06-12
        //console.log("stringdate1 is: ",stringDate,"  of type: ",typeof stringDate)
        //transactPeriod = transactPeriod.toISOString().split("T")[0]//suddenly need to remove .toISOString() ???
        //console.log("@@@ $ transactPeriod post conversion",transactPeriod);                                              //take only yyyy-mm-dd portion

        if (!errors.isEmpty()) {
            let allowedProxy = 'false';
            if(req.body.allowed)allowedProxy = 'true';//as a string???
            //2019-08-14  similar for Harmonized
            let harmonizedProxy = 'false';
            if(req.body.harmonized)harmonizedProxy = 'true';//since do not display on form if sent as Booleans
            let fed_rate_activeProxy = 'false';
            if(req.body.fed_rate_active)fed_rate_activeProxy = 'true';//must start collecting GST or HST
            console.log('@@@ $ Console: errors spotted in validationResult for "regionalauthority_create_post"  f_r_aProxy: ',fed_rate_activeProxy);
            debug('DEBUG: errors spotted in validationResult for "regionalauthority_create_post"');
            // There are errors. Render form again with sanitized values/errors messages.
            //res.render('regionalauthorityErr_form', { title: 'Create Regional Authority', regionalauthority: req.body,allowedProxy:allowedProxy,stringDate:stringDate, errors: errors.array() });
            res.render('regionalauthorityErr_form', { title: 'Create RegionalAuthority',
                                                regionalauthority: req.body,
                                                allowedProxy:allowedProxy,
                                                harmonizedProxy:harmonizedProxy,
                                                fed_rate_activeProxy:fed_rate_activeProxy,
                                                stringDate:stringDate,
                                                errors: errors.array()});//2019-06-12
            return;
          }
          //console.log('@@@ $ modified transactionPeriod is given as: ', transactPeriod,"  of type: ",typeof transactPeriod);
          //temporarily to check out validators, make no record
          //res.render('regionalauthorityErr_form', { title: 'Create regionalAuthority', regionalauthority: req.body, transactPeriod:transactPeriod, errors: errors.array() });
          //return;

        // Create a regionalauthority object with escaped and trimmed data.
        var regionalauthority = new RegionalAuthority( //.body. here is body of request which has many key fields
          {
            region_name: req.body.region_name,
            region_code: req.body.region_code,  //needs to be ._id of valid client
            country: req.body.country,
            allowed: req.body.allowed,
            harmonized: req.body.harmonized,
            fed_rate: req.body.fed_rate,
            fed_rate_active: req.body.fed_rate_active,
            reg_rate: req.body.reg_rate,
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
            for_period_index: req.body.for__period_index,//2019-12-10 was 'for_transaction_period'???
            attempted: req.body.attempted
           });


          // Data from form is valid.
          regionalauthority.save(function (err) {
            if (err) {
              console.log("@@@ $ saving new countryTA gives err: ",err);
              return next(err);
            }
            //else Successful - redirect to new record.
            console.log("@@@ $ redirecting to url for detailed view")
            res.redirect(regionalauthority.url);
            });//ends save function
    } // ends the fat arrow req, res, next  fn
]

// Display regionalauthority delete form on GET.
exports.regionalauthority_delete_get = function(req, res, next) {
      console.log('@@@ $ entering regionalauthority_delete_get params follows');
      console.log(req.params);

      RegionalAuthority.findByIdAndRemove(req.params.id, function deleteregionalauthority(err){
                 if(err){
                   console.log('@@@ $ error in deleting (fast) regionalauthority: ' + err);
                   return next(err);
                 }
                console.log('@@@ $ redirecting to regionalauthorities for res: ' + res);
                res.redirect('/catalog/regionalauthorities')
      });//ends findby etc..
  }; //ends export.regionalauthority_delete_get
      //here was async.parallel({key1:func,key2:func},function(err,results))


// Handle regionalauthority delete on POST.
exports.regionalauthority_delete_post = function(req, res, next) {
  console.log('@@@ $ entering regionalauthority_delete_post req.params below');
  console.log(req.params);
  // client instances being deleted have no dependencies; just do it.
  RegionalAuthority.findByIdAndRemove(req.params.id, function deleteregionalAuthority(err) {  //was Autthor....req.body.clientid, fn deletclient
      if (err) {
        console.log('delete_post err is: ' + err);
        return next(err);
      }
      // Success - go to regionalauthoritys list
      //res.redirect('/catalog/regionalauthoritys')
      return;
  })
  };

//adding missing regionalauthority_update_get
// Display regionalauthority update form on GET.
exports.regionalauthority_update_get = function(req, res, next) {
  console.log("@@@ $ sanitizing body in regionalauthorityUpdate");
      //req.params.sanitize('id').escape().trim();
      sanitizeBody(req.params.id).trim().escape();
      console.log("@@@ $ passed sanitizeBody for id: & id is: ",req.params.id);
      async.parallel({
       regionalauthority: function(callback) {
        RegionalAuthority.findById(req.params.id).exec(callback)
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
       console.log("@@@ $ try a results parameter: results.regionalauthority.allowed: ",results.regionalauthority.allowed);

       if(req != undefined)console.log("@@@ $ req is: ",req,"  of type: ",typeof req);
       console.log("@@@ $ results.regionalauthority.for_transaction_period is ",results.regionalauthority.for_transaction_period);
       //2019-06-12 req.body == {} at this point- confirmed
       //results.regionalauthority.for_transaction_period
       console.log("@@@ $ after '=' results.regionalauthority.for_transaction_period is ",results.regionalauthority.for_transaction_period,"  of type: ", typeof results.regionalauthority.for_transaction_period);
       let stringDate = new Date(results.regionalauthority.for_transaction_period); //possible convert to string for mongodb dates
       stringDate = stringDate.toLocaleString().split(" ")[0];//2019-06-12
       console.log("@@@ $ stringDate2 is: ",stringDate,"  of type: ", typeof stringDate);

       let allowedProxy = 'false';
       if(results.regionalauthority.allowed)allowedProxy = 'true';//as a string???
       //2019-08-14  similar for Harmonized
       let harmonizedProxy = 'false';
       if(results.regionalauthority.harmonized)harmonizedProxy = 'true';//since do not display on form if sent as Booleans
       let fed_rate_activeProxy = 'false';
       if(results.regionalauthority.fed_rate_active)fed_rate_activeProxy = 'true';//must start collecting GST or HST

       //let transactPeriod = req.body.transaction_date.toJSON();
       //console.log("@@@ $ transPeriod & type: ",transactPeriod,"   & type: ",typeof transactPeriod);
       //transactPeriod = transactPeriod.split("T")[0]//suddenly need to remove .toISOString() ???
                                                     //take only yyyy-mm-dd portion

       res.render('regionalauthorityErr_form', { title: 'Update RegionalAuthority',
                                           regionalauthority: results.regionalauthority,
                                           allowedProxy:allowedProxy,
                                           harmonizedProxy:harmonizedProxy,
                                           fed_rate_activeProxy:fed_rate_activeProxy,
                                           stringDate:stringDate});//2019-06-12
       //res.render('regionalauthorityUpdate_form', { title: 'Update regionalAuthority', regionalauthority: results.client, query: "Update"});
  });//async ends note closing } is not for async's opening "{", that's closed above, this one closes  fn(err,rslts){
}; //export fn ends  NOTE this is a request to update with changes, only accepted if posted (as follows)



  // Handle regionalauthority update on POST.
    exports.regionalauthority_update_post = [
      // Validate fields.
      body('country_name', 'specify country name').trim(),
      body('country_code', 'choose country code from dropdown list').isLength({ max: 2 }).trim(),
      body('allowed', 'True/False value for "allowed"').isBoolean().withMessage('Boolean (true/false), must reflect current status of allowed/not allowed to sell'),
      body('harmonized','True/False value for "harmonized"').isBoolean().withMessage('Boolean (true/false), true = fed + reg tax is combined'),
      body('fed_rate', 'fed tax rate').isDecimal({ local:"en-US",checkFalsy:true}),
      body('fed_rate_active','True/False value for "fed_rate_active"').isBoolean().withMessage('If Fed sales tax is triggered set to "true"'),
      body('reg_rate', 'region tax rate').isDecimal({ local:"en-US",checkFalsy:true}),
      body('restriction_code','0:none,1:#transactions,2:total sales, 3:both').isInt({no_symbols: true, max:3}).withMessage("only codes allowed: 0:none, 1:# trans., 2:$ amnt., 3:both"),
      body('transaction_limit').isNumeric({no_symbols: true}),
      body('current_count').isNumeric({no_symbols:true}),
      body('amount_limit').isNumeric({no_symbols: true}),
      body('current_year_amount').isNumeric({no_symbols: true}),
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
      sanitizeBody('harmonized').trim().escape(),
      sanitizeBody('fed_rate_active').trim().escape(),
      sanitizeBody('restriction_code').trim().escape(),
      sanitizeBody('transaction_limit').trim().escape(),
      sanitizeBody('current_count').trim().escape(),
      sanitizeBody('amount_limit').trim().escape(),
      sanitizeBody('current_year_amount').trim().escape(),
      sanitizeBody('target_previous_years_amounts').trim().escape(),
      sanitizeBody('current_quarter_amount').trim().escape(),
      sanitizeBody('target_last_three_quarters_array').trim().escape(),
      sanitizeBody('current_four_quarters_amount').trim().escape(),
      sanitizeBody('previous_quarters_amounts').trim().escape(),
      sanitizeBody("current_year_amount").trim().escape(),
      sanitizeBody('transaction_period_type').trim().escape(),
      sanitizeBody('for_period_index').trim().escape(),
      //sanitizeBody('for_transaction_period').toDate(),

        // Process request after validation and sanitization.
        (req, res, next) => {

            // Extract the validation errors from a request.
            const errors = validationResult(req);
            if(req != undefined)console.log("@@@ $ req is: ",req,"  of type: ",typeof req);
            console.log("@@@ $ req.body: below vvvv");
            if(req.body != undefined)console.log(req.body);
            console.log("@@@ or from params: ");
            if(req.params!=undefined)console.log(req.params);
            if(req.body.for_transaction_period != undefined)console.log("ctp is: ",req.body.for_transaction_period);
            //yearMonthDayUTC: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
            //let transactPeriod = req.body.transaction_date.toJSON();//was   req.params.id.toString())
            //console.log("@@@ $ transactPeriod & type: ",transactPeriod,"   & type: ",typeof transactPeriod);
            //transactPeriod = transactPeriod.split("T")[0]//suddenly need to remove .toISOString() ???
            //let transactPeriod = "2019-12-31";                         //take only yyyy-mm-dd portion

            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values and error messages.
                let stringDate =req.body.for_transaction_period;//2019-06-12
                let fed_rate_activeSnap =req.body.fed_rate_active;//2019-08-14
                console.log("@@@ $ update errors: ",errors);//2019-08-14
                console.log("@@@ $ fed_rate_active is: ",fed_rate_activeSnap,"  of type: ",typeof fed_rate_activeSnap)
                let allowedProxy = 'false';
                if(req.body.allowed)allowedProxy = 'true';//as a string???
                //2019-08-14  similar for Harmonized
                let harmonizedProxy = 'false';
                if(req.body.harmonized)harmonizedProxy = 'true';//since do not display on form if sent as Booleans
                let fed_rate_activeProxy = 'false';
                if(req.body.fed_rate_active)fed_rate_activeProxy = 'true';//must start collecting GST or HST
                console.log('@@@ $ rendering regionalauthority_form for redisplay in clrq_update_post (validation err)');
                //res.render('regionalauthorityErr_form', { title: 'Update Regional Authority', regionalauthority: req.body,allowedProxy:allowedProxy,stringDate:stringDate, errors: errors.array() });
                res.render('regionalauthorityErr_form', { title: 'Update RegionalAuthority',
                                                    regionalauthority: req.body,
                                                    allowedProxy:allowedProxy,
                                                    harmonizedProxy:harmonizedProxy,
                                                    fed_rate_activeProxy:fed_rate_activeProxy,
                                                    stringDate:stringDate,
                                                    errors: errors.array() });//2019-06-12

                return;

            } else {
                console.log('@@@ $ updating regionalauthority document');
                if(req.body != undefined)console.log(req.body);
                if(req.params!=undefined)console.log("req.params: ",req.params);
                if(req.params!=undefined)console.log("req.params.id: ",req.params.id);

                //2019-09-09  array Updating
                var p_y_amounts = req.body.previous_years_amounts;
                var p_q_amounts = req.body.previous_quarters_amounts;
                var l_t_q_a_Array = req.body.last_three_quarters_array;
                console.log("@@@ $ last 3 1/4's array initial: ",l_t_q_a_Array, "  of type: ", typeof l_t_q_a_Array);
                p_y_amounts = p_y_amounts.replace("[","");
                p_y_amounts = p_y_amounts.replace("]","");
                p_y_amounts = p_y_amounts.split(",");

                p_q_amounts = p_q_amounts.replace("[","");
                p_q_amounts = p_q_amounts.replace("]","");
                p_q_amounts = p_q_amounts.split(",");

                l_t_q_a_Array = l_t_q_a_Array.replace("[","");
                l_t_q_a_Array = l_t_q_a_Array.replace("]","");
                l_t_q_a_Array = l_t_q_a_Array.split(",");//array with string values for numbers

                req.body.previous_years_amounts = 0;
                req.body.last_three_quarters_array = 0;
                req.body.previous_quarters_amounts = 0;


                // Data from form is valid.
                RegionalAuthority.findByIdAndUpdate(req.params.id,req.body,{}, function (err,theregionalauthority) { //2019-06-10  was "theregionalauthority"
                    if (err) {
                      console.log('@@@ $ updating regionalauthority document throws err: ' + err);
                      return next(err);
                    }
                       //else Successful - redirect to new record.
                       res.redirect(theregionalauthority.url);
                       console.log('@@@ $ updating regionalauthority document successful!');
                    })//closes findbyidandupdate

                  .then(function(theregionalauthority){
                      console.log("@@@ $ last 3 1/4's REGIONAL array final: ",l_t_q_a_Array);
                      let arraySize = l_t_q_a_Array.length;
                      //console.log("@@@ $ and theregionalsauthority= ",theregionalauthority);
                      for(let k = 0;k<arraySize;k++){
                        theregionalauthority.last_three_quarters_array.set(k,l_t_q_a_Array[k]);
                      }
                      arraySize = p_y_amounts.length;
                      for(let k = 0;k<arraySize;k++){
                        theregionalauthority.previous_years_amounts.set(k,p_y_amounts[k]);
                      }
                      arraySize = p_q_amounts.length;
                      for(let k = 0;k<arraySize;k++){
                        theregionalauthority.previous_quarters_amounts.set(k,p_q_amounts[k]);
                      }

                      theregionalauthority.save();

                    })//closes .then
            }//closes else clause
        }//closes fat arrow req,res,next
      ]
