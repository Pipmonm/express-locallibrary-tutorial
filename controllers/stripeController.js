//const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY;//2019-02-10 added for STRIPE integration
//const keySecret = process.env.STRIPE_SECRET_KEY;//2019-02-10 added for STRIPE integration
//const stripe = require("stripe")(keySecret);//2019-02-10 added for STRIPE integration
//let amount = STRIPE.stripeCharge.toString();//2019-02-13 must be a penny amount
//let fancyAmount = "$" + `(amount/100)`.toString();
//**************curiously STRIPE is not defined outside of exported functions
//               ie only find STRIPE when wherever imported????
//2019-02-10  bare bones to start with

//stuff from clientController to enable SystemId verification;

//clientrequest instance controller js
var Client = require('../models/client');//client is filename minus extension
var ClientRequest = require('../models/clientrequest');//2019-01-31 removed chasing E11000
var CountryTaxAuthority = require('../models/countryTaxAuthority')
var RegionalAuthority = require('../models/regionalAuthority')
////var clientrequestInstance = require('../models/clientrequestinstance');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug')('client');
    //debugging specific module,   start prog setting   "set DEBUG= client_controller, ...+ others"



//validation check on sysId and Format Code string  //2018-12-14 new function
function checkValidIdString(inString){
  let stringPieces = inString.split(":");
  if(stringPieces.length !=4)return "fail";//2019-01-31 now of size 4 with module name-version
  for (var i=0;i<2;i++){
    if(isNaN(stringPieces[i]))return "fail";
  }
  if(stringPieces[2] != "USB" && stringPieces[2] != "CPU")return "fail";
  return "pass";
};

function getCurrentQuarterYear(nowDate){ //fiscal year for 'small suppliers' is normal year quarters
  let quarter = 4;//illegal number
  let month = nowDate.getMonth();//recall January = 0
  if(month<=2){
    quarter = 0;
  }else if(month<= 5){
    quarter = 1;
  }else if(month<=8){
    quarter = 2;
  }else{quarter = 3;}
  console.log("@@@ $  'current quarter' is: ",quarter);
  return quarter;
}


function updateYear(doc){
  console.log("@@@ $ updating year now.");
  let innerDoc = doc;
  first.year += 1;//new fiscal dates for upcoming year
  second.year += 1;
  third.year += 1;
  fourth.year += 1;

  let temp = [];
  let temp2 = [];
  temp2 = innerDoc[0].previous_years_amounts;
  temp[0] = innerDoc[0].current_year_amount;//needed to place at top of array
  innerDoc[0].current_count = 0; //reset for a new year (no need to save)
                            //might need to change if ever reset required by fiscal Period

  innerDoc[0].previous_years_amounts = temp.concat(temp2);//save in records;//for update
  innerDoc[0].current_year_amount = 0;

  return innerDoc;

  //reset year and count and  do "first" etc..
  //leave redo four_quarters array THEN new current amount + reset quarter_amount
  // + transaction period to updateQuarter function
}

function updateQuarter(doc){
  console.log("@@@ $ updating quarter now");
  let doc2 = doc;
  let temp = [];
  let temp2 = [];
  temp2 = doc2[0].last_three_quarters_array;
  temp[0] = doc2[0].current_quarter_amount;//make into array of 1 element
  doc2[0].last_three_quarters_array = temp.concat(temp2);//place at top, now with 4 elements
  temp[0] = doc2[0].last_three_quarters_array.pop();//load temp with dropped out fourth value
  doc2[0].current_quarter_amount = 0;//reset for new quarter
  temp2 = doc2[0].previous_quarters_amounts;
  doc2[0].previous_quarters_amounts = temp.concat(temp2);//place at top

  doc2[0].current_four_quarters_amount = sumTotal(doc2);

  //document.getElementById("demo").innerHTML = doc2[0].current_four_quarters_amount;
  return doc2;
  }
  //as outlined above

function sumTotal(doc) {//for summing arrays
  let innerDoc = doc;
  let total = 0;
  let size = innerDoc[0].last_three_quarters_array.length; //don't need current quarter (= 0 for sure)
  for(var k=0;k<size;k++)total += innerDoc[0].last_three_quarters_array[k];
  console.log("@@@ $ new sum total= ",total);
  return total;
}

function cycleQuarters(doc){
  console.log("@@@ $ cyclingQuarterPeriod for target_object",target_object);
  let target_year = doc[0].transaction_date.getYear();
  let target_index = doc[0].for_period_index;

  while(target_index != this_transaction_period_index || target_year != this_year ){
        //complicated
        //update quarter by quarter and year by year as target_period hits zero till they're equal (both)
        target_index = (target_index + 1)%4; //modulo 4 to stay in (0~3) range
        updateQuarter(doc);
        if(target_index == 0)updateYear(doc);
    }
  }



//end stuff from clientController


exports.stripePrePay_get = (req,res) => {   //2019-05-15 part of payment mode mods
  STRIPE.registrationData = ""; //start with nulled system Id
  res.render('stripeprepay_form', {title: 'Payment Pre-Processing', message1: "Please paste clipboard contents from application's Registration Data page",
                             message2: 'Required to confirm that the SystemId is registered & ensure a License Key is generated for that specific system & module',
                             message3: "(NOTE: This content is different for each module & is loaded automatically upon entering a module's Registration Data page)",
                             sysIdString: ""});

}; //end stripePrePay_get

exports.stripePrePay_post = [
   //validation
   body('sysIdString').isLength({ min: 1 }).trim().withMessage('Clipboard data must be provided'),
   //sanitize

   sanitizeBody('sysIdString').trim().escape(),

   // Process request after validation and sanitization.
   (req, res, next) => { //open 1
     console.log("@@@ $ starting processing of stripeprepay_form post with req V ");
     console.log(req);
     // Extract the validation errors from a request.
     const errors = validationResult(req);

     var sysIdString = req.body.sysIdString;
     console.log("@@@ $ received prePay request for: " + sysIdString );
     if(sysIdString === "simpleTest"){//2019-06-03 WORKING HERE
        res.redirect('/catalog/countrytaxauthorities');
        //added line to force recompilation
        return;
     }
     let formatCheck = checkValidIdString(sysIdString);//2018-12-14  added conditions for validating id string
     console.log("@@@ $ formatCheck says: " + formatCheck);
     if(formatCheck == "fail")sysIdString = "incorrect string values"
     if (!errors.isEmpty()  || formatCheck == "fail") { //open 2    //2018-12-14 added second condition
         // There are errors. Render the form again with sanitized values/error messages.
         res.render('stripeprepay_form', { title: 'Request Status: Error Re-insert',
                        message1: "Please paste clipboard contents from math module's Registration Data page",
                        message2: "This information required for verification of prior registration and for generating License Key.",
                        message3: "(NOTE: These are loaded automatically upon entering each module's Registration Data page)",
                        sysIdString: sysIdString, errors: errors.array()});
     return;
   } //close 2
     else { //clause open2
           //find client
           console.log("@@@ $ finding client with license_string (aka sysIdString): " + sysIdString);
           var deviceId = sysIdString.split(":")[0];//2019-01-30 not used currently  //extract device id
           var option2 = false;//2019-03-11 finding a way around record returned as an array vs. a single object
           Client.find({'license_string':sysIdString},function(err, doc){ //open3  //2019-01-30 TO BE MODIFIED to license_string
                  //2019-01-30 was: 'device_id' : deviceId
             if(err){ //open 4
               console.log("@@@ $ err in Client.find license_string" + err);
               return  next(err);
             } //close 4
             console.log("@@@ $ found client(s) for doc req. status >v" );
             console.log(doc);
             if(doc.length>1){ //open 4
                 console.log("@@@ $ multiples of same license_string " + sysIdString);//2019-01-30 modded from deviceId
                 res.render('clientstatus_form', { title: 'Request Status: This client data is invalid',
                              message1: "Please contact support@k9math.xyz to report this error 'Invalid Record'",
                              message2: "Please include the Registration Data string that caused the error (shown below).",
                              message3: "",
                              sysIdString: sysIdString, errors: errors.array()});
                 return;
               }
             if(doc.length==0 ||doc == null || doc[0].device_id == undefined){ //open 4
                 let msg = [];
                 if(doc == null)msg.push("doc==null");
                 //if(doc == undefined)msg.push("doc==undefined");//supposedly same as ==null ???
                 if(doc.device_id==undefined)msg.push("doc.device_id==undefined");
                 if(doc.length==0)msg.push('doc.length==0');
                 console.log("@@@ $ err Client record is invalid","\n",msg);
                 // There are errors. Render the form again with sanitized values/error messages.
                 res.render('clientstatus_form', { title: 'Request Status: This client data not Registered',
                              message1: "Use clipboard contents of application's Registration Data to Register first then try again",
                              message2: "(NOTE: These are placed in your Window's ClipBoard upon entering any module's Registration Data page)",
                              message3: "",
                              sysIdString: sysIdString, errors: errors.array()});
                 return;
               }
           STRIPE.registrationData = sysIdString;
           console.log("@@@ $ setting STRIPE.registrationData with license_string (aka sysIdString): " + STRIPE.registrationData);
           //do call to stripeGet here???? or another render with button to goto page
           res.render('stripePay_redirect', { title: 'Data Confirmed',
                        message1: "Registration Data confirmed",
                        message2: "Please press 'Stripe Pay' button below to finish the transaction."});

           return;

         });//end callback  //close 3
      };//end if clause //close 2

   }// close 1   //end callback function WITHOUT SEMI-COLON OR COMMA  ie nothing follows in array

] //end client_status_post

exports.stripeGet = (req, res) => {
  let rawAmount = STRIPE.stripeCharge/100;//2019  need number for fancyAmount
  let amount = STRIPE.stripeCharge.toString();//2019-02-13 must be a penny amount
  STRIPE.denomination_US = "USD";//2019-02-18  TEMPORARY, move to general STRIPE declarations(?)
  let denomination = STRIPE.denomination_US;
  let fancyAmount = "$" + rawAmount.toFixed(2).toString();
  let source =   '/';
  let source2 = "Home";
  const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY; //2019-02-12 try directly (async???)
  //console.log("@@@ $ publishable key: "  + keyPublishable + "  & typeof: " + typeof keyPublishable);
  //res.render("stripe_get.pug", {keyPublishable:'pk_test_5uHse6DFoVXDYSj8H3l1dYvY',
  res.render("stripe_get.pug", {keyPublishable:keyPublishable,
                                amount:amount,
                                denomination:denomination,
                                labelAmount:fancyAmount,
                                source:source,
                                source2:source2});//STRIPE.stripeCharge.toString()});//2019-02-11 final version?
}

                                               //using variable seems to cause trouble
exports.stripePost = (req, res) => {//open 1
  let rawAmount = STRIPE.stripeCharge/100;//2019  need number for fancyAmount
  let amount = STRIPE.stripeCharge.toString();//2019-02-13 must be a penny amount
  let fancyAmount = "$" + rawAmount.toFixed(2).toString();
  let registration_Data = STRIPE.registrationData;//2019-05-15 payment mode mods
  let exitFlag = false;//2019-06-03  flag to signal not to process if true
  //let amount = stripeCharge;//2019-02-11 was 500 pennies (number not string)
  let chargeObject;//2019-06-03  make returned object available throughout chain processing
  var target_country;
  var target_region;
  var target_object;
  let allowed = true;
  let target_transaction_limit;
  let target_current_count;
  let target_amount_limit;
  let target_current_year_amount;
  let target_current_quarter_amount;
  let target_last_three_quarters_array;
  let target_current_four_quarters_amount;
  let target_restrictionCode;
  let target_for_period_index;
  let this_transaction_period_index;//from (0,1,2,3) for using modulo 4 cycling
  let this_year;
  let fiscalPeriods = ["first","second","third","fourth"];
  //must provide for update of year in following objects at each year end!
  let first={year:2019,month:2,date:31};//set to this for now but liable to be updated
  let second={year:2019,month:5,date:30};
  let third={year:2019,month:8,date:30};
  let fourth={year:2019,month:11,date:31};
  let combo = {price:7.50,currency:"CDN",sku:"unknown"}
  let now = new Date();//must ensure which fiscal quarter we are now in
  this_year = now.getYear();//format number  ie. 2019
  this_transaction_period_index = getCurrentQuarterYear(now);

  console.log("@@@ $ am at stripePost & stripeCharge is: " + STRIPE.stripeCharge + "  or (fancier): " + fancyAmount);
  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "usd",
         customer: customer.id,
         metadata: {'systemId': registration_Data} //2019-05-15 payment mode mods
    }))
  .catch(error => {
       console.log("@@@ EE 1st attempt to catch error: " + error);
       let source =   '/';
       let source2 = "HOME";
       let tactfulMsg = "Unable to process credit card charge";
       exitFlag = true;//2019-06-03  signal error was processed
       res.render("stripe_postError.pug",{errMsg:error,source:source,source2:source2, tactfulMsg:tactfulMsg});
       //2019-02-21  sees error but doesn't render and desn't exit
       //hrow("silly error");//2019-06-03 trying to avoid 'unhandled promise/rejection error as given in heroku logs'
       //let failed = Promise.reject("Stripe signals card error")
       //return Promise.reject(error);
    })
  .then(charge => { //open 2 with ({
    chargeObject = charge; //2019-06-03 keep for all chain
    if(exitFlag)return;//2019-06-03 trying to avoid running this 'then' on previous error
    var denomination = charge.currency.toUpperCase();//was let
    var source =   '/';//ibid
    var source2 = "HOME";//also
    var systemId = charge.metadata.systemId;//2019-05-15 payment mode mods //was let
    console.log("@@@ $ trying for stripe_post.pug with charge: " + charge.amount);//2019-02-12 notion of using charge in render is mine
    console.log("@@@ ### from address: ", charge.billing_details.address.state,"  & city: ",charge.billing_details.address.city);
    //2019-05-21  Updating Status to "Paid"
    Client.find({'license_string':systemId},function(err, doc){ //open3  //2019-01-30 TO BE MODIFIED to license_string
           //2019-01-30 was: 'device_id' : deviceId

      if(err){ //open 4
        console.log("@@@ $ err in Client.find license_string" + err);
        return  next(err);//HERE MUST FIND OUT HOW TO CANCEL CHARGE & NOTIFY CUSTOMER
      } //close 4
      console.log("@@@ $ found client(s) for doc pre-update, status: as follows",doc[0].status );
      target_country = doc[0].country;//2019-08-21
      target_region = doc[0].tax_region; //2019-08-23 CAREFUL, region authorities have both
                                         // region_name & region_code, but client only has tax_region
                                         // set as region_code!!
                                         //though region_name is available, we are only asking for CODE  (ie ON)
      console.log("@@@ $ country is: ",target_country);
      console.log("@@@ $ region is: ",target_region);
      console.log("@@@ $ doc >>: " + "type: ", typeof doc,"<br/>",doc);
      var docId = doc[0]._id;//2019-05-21  needed to update status, maybe doc[0]._id if more than 1 doc (possible???)
      console.log("@@@ $ setting STRIPE.Status to 'validated' for doc._id (as docId): " + docId);

      Client.findByIdAndUpdate(docId, {status: "validated" },{upsert: true, 'new': true}, function(err,newdoc){
             //prolog was license_key !!! //2019-01-30  very critical update right here,  what makes ._id be whatever it is?
             //2019-03-11 worse yet updated from 'doc[0]._id' to 'docId'
          if(err){
            console.log("@@@ $ update error: " + err);
            return next(err);
          }
          console.log("@@@ $ post client update  client: >v");
          console.log(newdoc);
        });//end client update
      //});//relocate to end
      //2019-08-21  updating amounts and count in country and region tax Authorities
      CountryTaxAuthority.find({'country_name':target_country},function(err, doc){ //open3  //2019-01-30 TO BE MODIFIED to license_string
            //2019-01-30 was: 'device_id' : deviceId

       if(err){
         console.log("@@@ $ err in CountryTaxAuthority find" + err);
         return  next(err);
       }
       console.log("@@@ $ found CountryTaxAuthority for doc pre-update status: as follows" );
       console.log("@@@ $ transaction_limit is: ",doc[0].transaction_limit);
       console.log("@@@ $ current_year_amount is: ", doc[0].current_year_amount);
       //console.log("@@@ $ doc >>: " + "type: ", typeof doc,"<br/>",doc);
       //first check if changes in fiscal quarter or year
       target_period_index = doc[0].for_period_index;
       target_object = target_country;//ensure cycling country document values
       console.log("@@@ $ period indices: now: ",this_transaction_period_index,"  then: ",target_period_index);
       if(this_transaction_period_index != target_period_index)cycleQuarters(doc);
         //take care of year change in here too
         //will result in many doc[0] items being modified
         //make sure to recalculate (& mod target for it) four_quarters_amount
         //also on year change we update items "first, second, etc... for year"
         //and we reset current_count & current_year_amount to zero (keep record???)


       allowed = doc[0].allowed;//currently (either for $ or # transactions)
       target_transaction_limit = doc[0].transaction_limit;
       target_current_count = doc[0].current_count + 1;//update count FOR YEARLY TOTAL
       target_amount_limit = doc[0].amount_limit;
       target_current_year_amount = doc[0].current_year_amount + rawAmount;//change to variable
       target_previous_years_amounts = doc[0].previous_years_amounts;
       //check for year cycling to be done on entry with "now" date

       target_current_quarter_amount = doc[0].current_quarter_amount + rawAmount;
       //check for quarters cycling to be done on entry with "now" date
       target_last_three_quarters_array = doc[0].last_three_quarters_array;
       target_current_four_quarters_amount = doc[0].current_four_quarters_amount + rawAmount;
        //do push/pull cycling at each quarter end + summing on each transaction
       target_previous_quarters_amounts = doc[0].previous_quarters_amounts;
       target_restrictionCode = doc[0].restriction_code;//what is the restriction  (o=always allowed, 1=# limit, 2=$ limit, 3= both)
       target_transaction_limit = doc[0].transaction_limit;


       if(!target_restrictionCode){ //with no restrictions skip all this
         if(target_restrictionCode == 1 || target_restrictionCode == 3){
           //check against target_transaction_limit
           if(target_current_count >= target_transaction_limit)allowed = false;//no more sales till next fiscal quarter
         }else if(target_restrictionCode == 2 || target_restrictionCode == 3){
           //check against target amount limit
           if(target_current_four_quarters_amount >= target_amount_limit)allowed = false;//stop sales till next fiscal quarter
         }
       }//end main if


       var docId = doc[0]._id;//2019-05-21  needed to update status, maybe doc[0]._id if more than 1 doc (possible???)
       CountryTaxAuthority.findByIdAndUpdate(docId, {allowed:allowed,
                                                     current_count:target_current_count,
                                                     current_year_amount:target_current_year_amount,
                                                     previous_years_amounts:target_previous_years_amounts,
                                                     current_quarter_amount:target_current_quarter_amount,
                                                     last_three_quarters_array:target_last_three_quarters_array,
                                                     current_four_quarters_amount:target_current_four_quarters_amount,
                                                     previous_quarters_amounts:target_previous_quarters_amounts,
                                                     for_period_index:target_period_index},
                                                     //transaction_date:Date.now},  //defaults to now
                                                     {upsert: true, 'new': true}, function(err,newdoc){
              //prolog was license_key !!! //2019-01-30  very critical update right here,  what makes ._id be whatever it is?
              //2019-03-11 worse yet updated from 'doc[0]._id' to 'docId'
           if(err){
             console.log("@@@ $ update error: " + err);
             return next(err);
           }
           console.log("@@@ $ post client update  client: >v");
           console.log(newdoc);
         });//end country update
      });//2019-08-21  WOKING HERE    end country find

   //}) //end Client find
//.then(() => {
      console.log("@@@ $ seeking regAuth for region: ",target_region, "  & combo.price is: ",combo.price);
    //2019-08-21  updating amounts and count in region and region tax Authorities
      RegionalAuthority.find({'region_code':target_region},function(err, doc){ //open3  //2019-01-30 TO BE MODIFIED to license_string
            //2019-01-30 was: 'device_id' : deviceId

       if(err){
         console.log("@@@ $ err in RegionalAuthority find" + err);
         return  next(err);
       }
       //console.log("@@@ $ found RegionalAuthority for doc pre-update status: as follows", doc,"  of type: ", typeof doc );
       //console.log("@@@ $ containing possibly: ", typeof doc[0]);

       //console.log("@@@ $ transaction_limit is: ",doc[0].transaction_limit);
       console.log("@@@ $ current_year_amount is: ", doc[0].current_year_amount);
       //console.log("@@@ $ doc >>: " + "type: ", typeof doc,"<br/>",doc);
       //first check if changes in fiscal quarter or year
       target_period_index = doc[0].for_period_index;
       target_object = target_region;//ensure cycling region document values
       if(this_transaction_period_index != target_period_index)cycleQuarters(doc);
         //take care of year change in here too
         //will result in many doc[0] items being modified
         //make sure to recalculate (& mod target for it) four_quarters_amount
         //also on year change we update items "first, second, etc... for year"
         //and we reset current_count & current_year_amount to zero (keep record???)


       allowed = doc[0].allowed;//currently (either for $ or # transactions)
       target_transaction_limit = doc[0].transaction_limit;
       target_current_count = doc[0].current_count + 1;//update count FOR YEARLY TOTAL
       target_amount_limit = doc[0].amount_limit;
       target_current_year_amount = doc[0].current_year_amount + rawAmount;//change to variable
       target_previous_years_amounts = doc[0].previous_years_amounts;
       //check for year cycling to be done on entry with "now" date

       target_current_quarter_amount = doc[0].current_quarter_amount + rawAmount;
       //check for quarters cycling to be done on entry with "now" date
       target_last_three_quarters_array = doc[0].last_three_quarters_array;
       target_current_four_quarters_amount = doc[0].current_four_quarters_amount + rawAmount;
        //do push/pull cycling at each quarter end + summing on each transaction
       target_previous_quarters_amounts = doc[0].previous_quarters_amounts;
       target_restrictionCode = doc[0].restriction_code;//what is the restriction  (o=always allowed, 1=# limit, 2=$ limit, 3= both)
       target_transaction_limit = doc[0].transaction_limit;


       if(!target_restrictionCode){ //with no restrictions skip all this
         if(target_restrictionCode == 1 || target_restrictionCode == 3){
           //check against target_transaction_limit
           if(target_current_count >= target_transaction_limit)allowed = false;//no more sales till next fiscal quarter
         }else if(target_restrictionCode == 2 || target_restrictionCode == 3){
           //check against target amount limit
           if(target_current_four_quarters_amount >= target_amount_limit)allowed = false;//stop sales till next fiscal quarter
         }
       }//end main if
       var docId = doc[0]._id;//2019-05-21  needed to update status, maybe doc[0]._id if more than 1 doc (possible???)
       RegionalAuthority.findByIdAndUpdate(docId, {allowed:allowed,
                                                   current_count:target_current_count,
                                                   current_year_amount:target_current_year_amount,
                                                   previous_years_amounts:target_previous_years_amounts,
                                                   current_quarter_amount:target_current_quarter_amount,
                                                   last_three_quarters_array:target_last_three_quarters_array,
                                                   current_four_quarters_amount:targetcurrent_four_quarters_amount,
                                                   previous_quarters_amounts:target_previous_quarters_amounts,
                                                   for_period_index:target_period_index},
                                                   //transaction_date:Date.now},  //defaults to now
                                                   {upsert: true, 'new': true}, function(err,newdoc){
              //prolog was license_key !!! //2019-01-30  very critical update right here,  what makes ._id be whatever it is?
              //2019-03-11 worse yet updated from 'doc[0]._id' to 'docId'
           if(err){
             console.log("@@@ $ update error: " + err);
             return next(err);
           }
           console.log("@@@ $ post client update  client: >v");
           console.log(newdoc);
         });//end region update
      });//2019-08-21  WOKING HERE    end region find

     res.render("stripe_post.pug",{source:source,source2:source2,charge:charge,denomination:denomination, fancyAmount:fancyAmount, systemId:systemId});//original only has filename and no variable declaration (no {})
  }).catch(error => {
     //2019-09-14  above close bracket now becomes end of Client Find ()
     let source =   '/';
     let source2 = "HOME";
     let tactfulMsg = "";
     res.render("stripe_postError.pug",{errMsg:error,source:source,source2:source2, tactfulMsg:tactfulMsg});
  })
 //}) //end Client find (maybe)
})}; //end the Charge then end it all!
