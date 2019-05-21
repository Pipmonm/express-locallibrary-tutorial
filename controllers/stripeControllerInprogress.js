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
var Client = require('../models/client');
var ClientRequest = require('../models/clientrequest');//2019-01-31 removed chasing E11000
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


//end stuff from clientController


exports.stripePrePay_get = (req,res) => {   //2019-05-15 part of payment mode mods
  STRIPE.registrationData = ""; //start with nulled system Id
  res.render('stripeprepay_form', {title: 'Payment Pre-Processing', message1: "Please paste clipboard contents from application's Registration Data page",
                             message2: 'Required to confirm that the SystemId is registered & ensure License Key is generated for that specific system & module',
                             message3: "(NOTE: These are loaded automatically upon entering module's Registration Data page)",
                             sysIdString: ""});

}; //end stripePrePay_get

exports.stripePrePay_post = [
   //validation
   body('sysIdString').isLength({ min: 1 }).trim().withMessage('Clipboard data must be provided'),
   //sanitize
   sanitizeBody('sysIdString').trim().escape(),

   // Process request after validation and sanitization.
   (req, res, next) => { //open 1
     console.log("@@@ $ starting processing of clientstatus_form post with req V ");
     console.log(req);
     // Extract the validation errors from a request.
     const errors = validationResult(req);

     var sysIdString = req.body.sysIdString;
     console.log("@@@ $ received prePay request for: " + sysIdString );
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
             if(doc[0] == undefined || doc[0].deviceId == undefined){ //open 4
               if(doc == null || doc == undefined){ //open 5
                 console.log("@@@ $ err Client record is invalid" + doc);
                 // There are errors. Render the form again with sanitized values/error messages.
                 res.render('clientstatus_form', { title: 'Request Status: This client data not Registered',
                              message1: "Use clipboard contents of application's Registration Data to Register first then try again",
                              message2: "(NOTE: These are placed in your ClipBoard upon entering Registration Data page)",
                              message3: "",
                              sysIdString: sysIdString, errors: errors.array()});
                 return;
               }else{//2019-03-11 seems should be in an array
                 option2 = true;//2019-03-11 seems like record is not an array
                 console.log("@@@ $ option2 is true & doc is: /n" + doc);
               } //close 5
             } //close 4

             if(!option2 && doc.length > 1 ){//2019-03-11 was only 'doc'
               console.log("@@@ $ multiples of same license_string " + sysIdString);//2019-01-30 modded from deviceId
               res.render('clientstatus_form', { title: 'Request Status: This client data is invalid',
                            message1: "Please contact support@k9math.xyz to report this error 'Invalid Record'",
                            message2: "Please include the Registration Data string that caused the error (shown below).",
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
exports.stripePost = (req, res) => {
  let rawAmount = STRIPE.stripeCharge/100;//2019  need number for fancyAmount
  let amount = STRIPE.stripeCharge.toString();//2019-02-13 must be a penny amount
  let fancyAmount = "$" + rawAmount.toFixed(2).toString();
  let registration_Data = STRIPE.registrationData;//2019-05-15 payment mode mods
  //let amount = stripeCharge;//2019-02-11 was 500 pennies (number not string)
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
       res.render("stripe_postError.pug",{errMsg:error,source:source,source2:source2, tactfulMsg:tactfulMsg});
       //2019-02-21  sees error but doesn't render and desn't exit
    })
  .then(charge => {
    let denomination = charge.currency.toUpperCase();
    let source =   '/';
    let source2 = "HOME";
    let systemId = charge.metadata.systemId;//2019-05-15 payment mode mods
    //console.log("@@@ $ trying for stripe_post.pug with charge: " + charge.amount);//2019-02-12 notion of using charge in render is mine

    //2019-05-21  Updating Status to "Paid"
    Client.find({'license_string':systemId},function(err, doc){ //open3  //2019-01-30 TO BE MODIFIED to license_string
           //2019-01-30 was: 'device_id' : deviceId
      var docId = doc._id;//2019-05-21  needed to update status, maybe doc[0]._id if more than 1 doc (possible???)
      if(err){ //open 4
        console.log("@@@ $ err in Client.find license_string" + err);
        return  next(err);
      } //close 4
      console.log("@@@ $ found client(s) for doc req. status >v" );
      if(doc[0] == undefined || doc[0].deviceId == undefined){ //open 4
        if(doc == null || doc == undefined){ //open 5
          console.log("@@@ $ err Client record is invalid" + doc);
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('clientstatus_form', { title: 'Request Status: This client data not Registered',
                       message1: "Use clipboard contents of application's Registration Data to Register first then try again",
                       message2: "(NOTE: These are placed in your ClipBoard upon entering Registration Data page)",
                       message3: "",
                       sysIdString: systemId, errors: errors.array()});
          return;
        }else{//2019-03-11 seems should be in an array
          option2 = true;//2019-03-11 seems like record is not an array
          console.log("@@@ $ option2 is true & doc is: /n" + doc);
        } //close 5
      } //close 4

      if(!option2 && doc.length > 1 ){//2019-03-11 was only 'doc'
        console.log("@@@ $ multiples of same license_string " + sysIdString);//2019-01-30 modded from deviceId
        res.render('clientstatus_form', { title: 'Request Status: This client data is invalid',
                     message1: "Please contact support@k9math.xyz to report this error 'Invalid Record'",
                     message2: "Please include the Registration Data string that caused the error (shown below).",
                     message3: "",
                     sysIdString: sysIdString, errors: errors.array()});
        return;
      }

    console.log("@@@ $ setting STRIPE.Status to 'validated' for license_string (aka sysIdString): " + STRIPE.registrationData);
    //do call to stripeGet here???? or another render with button to goto page
    Client.findByIdAndUpdate(docId, {status: "validated" },{upsert: true, 'new': true}, function(err,newdoc){
           //prolog was license_key !!! //2019-01-30  very critical update right here,  what makes ._id be whatever it is?
           //2019-03-11 worse yet updated from 'doc[0]._id' to 'docId'
        if(err){
          console.log("@@@ $ status update error: " + err);
          return  next(err);
        }else{ //2019-05-21 added as an else clause what was inline
        console.log("@@@ $ post client status update  client: >v");
        console.log(newdoc);
       }
     }); //close 3   //2019-05-21  end added clause for updating status

    res.render("stripe_post.pug",{source:source,source2:source2,charge:charge,denomination:denomination, fancyAmount:fancyAmount, systemId:systemId});//original only has filename and no variable declaration (no {})
  }).catch(error => {
     //console.log("@@@ EE 2nd attempt to catch error: " + error);
     let source =   '/';
     let source2 = "HOME";
     let tactfulMsge = "";
     res.render("stripe_postError.pug",{errMsg:error,source:source,source2:source2, tactfulMsg:tactfulMsg});
  })//.done(() => console.log("@@@ $ done"));
};
