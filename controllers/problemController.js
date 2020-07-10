//client instance controller js
var Problem = require('../models/problem');
var problem = require('../models/problem'); //collection of problems
console.log("@@@ $ force update");
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

//2019-12-10 added function to allow presentation of transaction date in detail & update pugs
//function findModdedIdString(inString){ //any changes here must be relfected in stripecontroller
//  let modArray = inString.split(":");//2019-10-29 added
//  let moddedSysIdString = modArray[0] + ":" + modArray[1] + ":" + modArray[2] + ":" + modArray[3].slice(0,2);//2019-10-29 added
//  console.log("@@@ $ modded string from sysIdString): " + moddedSysIdString);//2019-10-29 modified
//  return moddedSysIdString;
//}

// Display list of all problems.
exports.problems_list = function(req, res, next) {
  console.log('@@@ $ at problems_list');
  Problem.find({}) //was   ({}),'status'
    //.populate({
       //path:'regionaltaxauthorities', //2019-06-05 a guess as to path
       //model:'regionalTaxAuthority'})  //have attempted 'Client' & others
    .exec(function (err, problems) {
      console.log("@@@ $ executing callback for problems list; if err> : " + err );
      if (err) { return next(err); }
      console.log('@@@ $ found problems as per: ');
      console.log(problems);
      res.render('problems_list', { title: 'Problems List', problems_list: problems });
    });

};

//Message facility for region disallowed message
exports.specificproblem_disallowed_msg = function(req,res,next) {//2019-09-26  added

    let errMsg = "This problem is not currently in our database"
    let errMsg2 = "For now only problems that have been assigned are available"
    res.render('disallowedErrorMsg', { title: 'Request Cancelled', message:errMsg, message2:errMsg2});
    return;

}

// Display detail page for a specific specificproblem.
exports.specificproblem_detail = function(req, res, next) {
      //console.log('@@@ $ entering client_request_detail');
      //var id = req.params.id;
      var id = mongoose.Types.ObjectId(req.params.id.toString());
      console.log('@@@ $ looking for Problem with id: ', id);

      Problem.findById(id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
        //.populate('client')
        .exec(function (err, specificproblem) { //results of findById passed as specificproblem
        console.log('@@@ $ returned value for specificproblem:');
        console.log(specificproblem);
        if (err) {
           console.log("@@@ $ findById error: " + err);
           debug("specificproblem err: %s ",err);
           return next(err);
         }
        if (specificproblem==null) { // No results.
            console.log('@@@ $  err: no specificproblem found for this id ')
            var err = new Error('null specificproblem found');
            err.status = 404;
            return next(err);
          }
        //populate problem

        // Successful, so render.
        console.log('@@@ $ rendering specificproblem_detail with specificproblem: ' + specificproblem);
        res.render('specificproblem_detail', { title: 'Specific Problem Detail: ',
                                                 specificproblem:  specificproblem});
      })

  };

// Display problem create form on GET.
exports.specificproblem_create_get = function(req, res, next) {

  var gradeOptions = ['Focus-9',
                        'MathWorks 10',
                        'MathWorks 11',
                        'Mathworks 12',
                        'PreCalcus 12',
                        'other'];


        res.render('specificproblem_form', {title: 'Create Specific Problem',
                                            gradeOptions:gradeOptions});
  };


// Handle specificproblem create on POST.
exports.specificproblem_create_post = [
    // Validate fields.
    body('grade', 'choose grade level from dropdown list').isLength({ max: 12 }).trim(),
    body('other', 'give other source '),isLength({max:15}).trim(),
    body('pageNumber', 'page number where problem first appears').isNumeric({no_symbols: true}),
    body('problemNumber', 'problem number (no ")" or "-")').isNumeric({no_symbols: true}),
    body('subSection').isIn(['a','b','c','d','e','f','g','h','i','j','k','l']),
    body('problemAnswer', 'text value for answer').trim(),
    body('problemHint','optinal hint').trim(),
    body('problemExample','example optional').trim(),

    // Sanitize fields.
    sanitizeBody('grade').trim().escape(),
    sanitizeBody('ohter').trim().escape(),
    sanitizeBody('pageNumber').trim().escape(),
    sanitizeBody('problemNumber').trim().escape(),
    sanitizeBody('subSection').trim().escape(),
    sanitizeBody('problemAnswer').trim().escape(),
    sanitizeBody('problemHint').trim().escape(),
    sanitizeBody('problemExample').trim().escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('@@@ $ Console: errors spotted in validationResult for "specificproblem_create_post"  f_r_aProxy: ',fed_rate_activeProxy);
            debug('DEBUG: errors spotted in validationResult for "specificproblem_create_post"');
            // There are errors. Render form again with sanitized values/errors messages.
            //res.render('specificproblemErr_form', { title: 'Create Specific Problem', specificproblem: req.body,allowedProxy:allowedProxy,stringDate:stringDate, errors: errors.array() });
            res.render('specificproblemErr_form', { title: 'Create Problem Error',
                                                specificproblem: req.body,
                                                errors: errors.array()});//2019-06-12
            return;
          }
        var otherSrcFlag = req.body.grade;
        var keyCode;

        if(otherSrcFlag != 'other'){
           keyCode = req.body.grade + req.body.pageNumber.toString() + req.body.problemNumber.toString() + req.body.subSection;
        }else{
           keyCode = req.body.other.toString() }
        // Create a specificproblem object with escaped and trimmed data.
        var specificproblem = new Problem( //.body. here is body of request which has many key fields
          {
            keyCode: keyCode,
            answer: req.body.problemAnswer,
            hint: req.body.problemHint,
            example: req.body.problemExample

           });


          // Data from form is valid.
          specificproblem.save(function (err) {
            if (err) {
              console.log("@@@ $ saving new countryTA gives err: ",err);
              return next(err);
            }
            //else Successful - redirect to new record.
            console.log("@@@ $ redirecting to url for detailed view")
            res.redirect(specificproblem.url);
            });//ends save function
    } // ends the fat arrow req, res, next  fn
]

// Display specificproblem delete form on GET.
exports.specificproblem_delete_get = function(req, res, next) {
      console.log('@@@ $ entering specificproblem_delete_get params follows');
      console.log(req.params);

      Problem.findByIdAndRemove(req.params.id, function deletespecificproblem(err){
                 if(err){
                   console.log('@@@ $ error in deleting (fast) specificproblem: ' + err);
                   return next(err);
                 }
                console.log('@@@ $ redirecting to problems for res: ' + res);
                res.redirect('/catalog/problems')
      });//ends findby etc..
  }; //ends export.specificproblem_delete_get
      //here was async.parallel({key1:func,key2:func},function(err,results))


// Handle specificproblem delete on POST.
exports.specificproblem_delete_post = function(req, res, next) {
  console.log('@@@ $ entering specificproblem_delete_post req.params below');
  console.log(req.params);
  // client instances being deleted have no dependencies; just do it.
  Problem.findByIdAndRemove(req.params.id, function deleteproblem(err) {  //was Autthor....req.body.clientid, fn deletclient
      if (err) {
        console.log('delete_post err is: ' + err);
        return next(err);
      }
      // Success - go to specificproblems list
      //res.redirect('/catalog/specificproblems')
      return;
  })
  };

//adding missing specificproblem_update_get
// Display specificproblem update form on GET.
exports.specificproblem_update_get = function(req, res, next) {
  console.log("@@@ $ sanitizing body in specificproblemUpdate");
      //req.params.sanitize('id').escape().trim();
      sanitizeBody(req.params.id).trim().escape();
      console.log("@@@ $ passed sanitizeBody for id: & id is: ",req.params.id);
      async.parallel({
       specificproblem: function(callback) {
        Problem.findById(req.params.id).exec(callback)
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
       console.log("@@@ $ try a results parameter: results.specificproblem.allowed: ",results.specificproblem.allowed);

       if(req != undefined)console.log("@@@ $ req is: ",req,"  of type: ",typeof req);
       console.log("@@@ $ results.specificproblem.for_transaction_period is ",results.specificproblem.for_transaction_period);
       //2019-06-12 req.body == {} at this point- confirmed
       //results.specificproblem.for_transaction_period
       console.log("@@@ $ after '=' results.specificproblem.for_transaction_period is ",results.specificproblem.for_transaction_period,"  of type: ", typeof results.specificproblem.for_transaction_period);
       let stringDate = new Date(results.specificproblem.for_transaction_period); //possible convert to string for mongodb dates
       stringDate = stringDate.toLocaleString().split(" ")[0];//2019-06-12
       console.log("@@@ $ stringDate2 is: ",stringDate,"  of type: ", typeof stringDate);

       let allowedProxy = 'false';
       if(results.specificproblem.allowed)allowedProxy = 'true';//as a string???
       //2019-08-14  similar for Harmonized
       let harmonizedProxy = 'false';
       if(results.specificproblem.harmonized)harmonizedProxy = 'true';//since do not display on form if sent as Booleans
       let fed_rate_activeProxy = 'false';
       if(results.specificproblem.fed_rate_active)fed_rate_activeProxy = 'true';//must start collecting GST or HST

       //let transactPeriod = req.body.transaction_date.toJSON();
       //console.log("@@@ $ transPeriod & type: ",transactPeriod,"   & type: ",typeof transactPeriod);
       //transactPeriod = transactPeriod.split("T")[0]//suddenly need to remove .toISOString() ???
                                                     //take only yyyy-mm-dd portion

       res.render('specificproblemErr_form', { title: 'Update Problem',
                                           specificproblem: results.specificproblem,
                                           allowedProxy:allowedProxy,
                                           harmonizedProxy:harmonizedProxy,
                                           fed_rate_activeProxy:fed_rate_activeProxy,
                                           stringDate:stringDate});//2019-06-12
       //res.render('specificproblemUpdate_form', { title: 'Update problem', specificproblem: results.client, query: "Update"});
  });//async ends note closing } is not for async's opening "{", that's closed above, this one closes  fn(err,rslts){
}; //export fn ends  NOTE this is a request to update with changes, only accepted if posted (as follows)



  // Handle specificproblem update on POST.
    exports.specificproblem_update_post = [
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
                console.log('@@@ $ rendering specificproblem_form for redisplay in clrq_update_post (validation err)');
                //res.render('specificproblemErr_form', { title: 'Update Specific Problem', specificproblem: req.body,allowedProxy:allowedProxy,stringDate:stringDate, errors: errors.array() });
                res.render('specificproblemErr_form', { title: 'Update Problem',
                                                    specificproblem: req.body,
                                                    allowedProxy:allowedProxy,
                                                    harmonizedProxy:harmonizedProxy,
                                                    fed_rate_activeProxy:fed_rate_activeProxy,
                                                    stringDate:stringDate,
                                                    errors: errors.array() });//2019-06-12

                return;

            } else {
                console.log('@@@ $ updating specificproblem document');
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
                Problem.findByIdAndUpdate(req.params.id,req.body,{}, function (err,thespecificproblem) { //2019-06-10  was "thespecificproblem"
                    if (err) {
                      console.log('@@@ $ updating specificproblem document throws err: ' + err);
                      return next(err);
                    }
                       //else Successful - redirect to new record.
                       res.redirect(thespecificproblem.url);
                       console.log('@@@ $ updating specificproblem document successful!');
                    })//closes findbyidandupdate

                  .then(function(thespecificproblem){
                      console.log("@@@ $ last 3 1/4's PROB array final: ",l_t_q_a_Array);
                      let arraySize = l_t_q_a_Array.length;
                      //console.log("@@@ $ and theregionalsauthority= ",thespecificproblem);
                      for(let k = 0;k<arraySize;k++){
                        thespecificproblem.last_three_quarters_array.set(k,l_t_q_a_Array[k]);
                      }
                      arraySize = p_y_amounts.length;
                      for(let k = 0;k<arraySize;k++){
                        thespecificproblem.previous_years_amounts.set(k,p_y_amounts[k]);
                      }
                      arraySize = p_q_amounts.length;
                      for(let k = 0;k<arraySize;k++){
                        thespecificproblem.previous_quarters_amounts.set(k,p_q_amounts[k]);
                      }

                      thespecificproblem.save();

                    })//closes .then
            }//closes else clause
        }//closes fat arrow req,res,next
      ]
