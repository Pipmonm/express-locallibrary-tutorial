//clientrequest instance controller js
var Client = require('../models/client');
var ClientRequest = require('../models/clientrequest');//2019-01-31 removed chasing E11000
var CountryTaxAuthority = require('../models/countryTaxAuthority');//2019-09-10
var RegionalAuthority = require('../models/regionalAuthority');
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

// Display list of all clients.
exports.client_list = function(req, res, next) {

   Client.find()
      .sort([['family_name','ascending']])
      .exec(function (err, list_clients) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('client_list', { title: 'Client List', client_list: list_clients });
      });

  };

exports.client_status_get = function(req, res, next) {
  res.render('clientstatus_form', {title: 'Request Status', message1: "Please paste clipboard contents from application's Registration Data page",
                             message2: "(NOTE: These are loaded automatically upon entering Registration Data page)",
                             sysIdString: ""});

}; //end client_status_get

//exports.client_status_postTest = function(req,res,next) {
       //console.log("@@@ $ here we are");
       //redirect('catalog/clients')
//}//end status post

exports.client_status_post = [
   //validation
   body('sysIdString').isLength({ min: 1 }).trim().withMessage('Clipboard data must be provided'),
   //sanitize
   sanitizeBody('sysIdString').trim().escape(),

   // Process request after validation and sanitization.
   (req, res, next) => {
     console.log("@@@ $ starting processing of clientstatus_form post with req V ");
     console.log(req);
     // Extract the validation errors from a request.
     const errors = validationResult(req);

     var sysIdString = req.body.sysIdString;
     console.log("@@@ $ received client_status request for: " + sysIdString );
     let formatCheck = checkValidIdString(sysIdString);//2018-12-14  added conditions for validating id string
     console.log("@@@ $ formatCheck says: " + formatCheck);
     if(formatCheck == "fail")sysIdString = "incorrect string values"
     if (!errors.isEmpty()  || formatCheck == "fail") { //2018-12-14 added second condition
         // There are errors. Render the form again with sanitized values/error messages.
         res.render('clientstatus_form', { title: 'Request Status: Error Re-insert',
                        message1: "Please paste clipboard contents from application's Registration Data page",
                        message2: "(NOTE: These are loaded automatically upon entering Registration Data page)",
                        sysIdString: sysIdString, errors: errors.array()});
     return;
     }
     else {
           //find client
           console.log("@@@ $ finding client with license_string (aka sysIdString): " + sysIdString);
           var deviceId = sysIdString.split(":")[0];//2019-01-30 not used currently  //extract device id
           var option2 = false;//2019-03-11 finding a way around record returned as an array vs. a single object
           Client.find({'license_string':sysIdString},function(err, doc){ //2019-01-30 TO BE MODIFIED to license_string
                  //2019-01-30 was: 'device_id' : deviceId
             if(err){
               console.log("@@@ $ err in Client.find license_string" + err);
               return  next(err);
             }
             console.log("@@@ $ found client(s) for doc req. status >v" );
             if(!doc.length || doc[0] == undefined || doc[0].deviceId == undefined){
               if(!doc.length || doc == null || doc == undefined){
                 console.log("@@@ $ err Client record is invalid" + doc);
                 // There are errors. Render the form again with sanitized values/error messages.
                 res.render('clientstatus_form', { title: 'Request Status: This client data not Registered',
                              message1: "Use clipboard contents of application's Registration Data to Register first then try again",
                              message2: "(NOTE: These are placed in your ClipBoard upon entering Registration Data page)",
                              sysIdString: sysIdString, errors: errors.array()});
                 return;
               }else{//2019-03-11 seems should be in an array
                 option2 = true;//2019-03-11 seems like record is not an array
                 console.log("@@@ $ option2 is true & doc is: /n" + doc);
               }
             }

             if(!option2 && doc.length > 1 ){//2019-03-11 was only 'doc'
               console.log("@@@ $ multiples of same license_string " + sysIdString);//2019-01-30 modded from deviceId
             }
           //});  //needs to include following
           //we want to find yssId record, generate license key and display it as
           //part of client detail   !!!! may have to rename aeveryting client to sysId???
           //failing finding one we redirect to home page
           let R1=0x5c3f10bd9a;
           let R2=0xb9a3ce805c;
           //critical values above
           if(!option2){//2019-03-11 required optional processing
             var devId = doc.device_id;
             var randy = doc.format_code;
             var docId = doc._id;
             console.log("@@@ $ option2 true & devId = " + devId);
           }else{
             var devId = doc[0].device_id;//2019-03-11 very dangerous
             var randy = doc[0].format_code;//ibid
             var docId = doc[0]._id;
             console.log("@@@ $ option2 false & devId = " + devId);
           }


           let idSize = devId.length;
           if(idSize<4)devId=devId + "1424953867";
           if(idSize>10)devId = devId.slice(0,10);
           devId=parseInt(devId,16);

           let key = -1;
           key = 0xffffffffff;
           let success = false;
           let result = 0x00000000;

           R1 = R1 + devId;
           let shift = devId & 0xf;
           R1 = R1 + (devId>>shift);
           result = R1 ^ R2;

           result = result ^ randy;
           key = key ^ result;//done at server and sent to client
           console.log("@@@ $ licenseKey is: " + key.toString());

           Client.findByIdAndUpdate(docId, {license_key: key.toString() },{upsert: true, 'new': true}, function(err,newdoc){
                  //prolog was license_key !!! //2019-01-30  very critical update right here,  what makes ._id be whatever it is?
                  //2019-03-11 worse yet updated from 'doc[0]._id' to 'docId'
               if(err){
                 console.log("@@@ $ update error: " + err);
               }
               console.log("@@@ $ post client update  client: >v");
               console.log(newdoc)
               res.render('client_licensekey', {title: 'License Key Details', client: newdoc});
            });
         });//end callback
      };//end if clause

   }//end callback function WITHOUT SEMI-COLON OR COMMA  ie nothing follows in array

] //end client_status_post


  // Display detail page for a specific Client.
  exports.client_detail = function(req, res, next) {
        var id = mongoose.Types.ObjectId(req.params.id.toString()); // added  :MOD: 2018-03-08 9:45 AM
        async.parallel({
            client: function(callback) {
                Client.findById(id)   //  was  req.params.id  // added  :MOD: 2018-03-08 9:45 AM
                  .exec(callback)
            },
            clients_requests: function(callback) {
              ClientRequest .find({ 'client':id}) // was required.params.id   // added  :MOD: 2018-03-08 9:45 AM
              .exec(callback)
            } //,
            //clients_transactions: function(callback){
              //ClientClientRequest  .find({ 'client': id},'status')
              //.exec(callback)
            //}
        }, function(err, results) {
            if (err) {
          console.log('@@@ $ error in clientcontroller ASYNC');
              return next(err); } // Error in API usage.
            if (results.client==null) { // No results.
            console.log("@@@ $ clientcontroller can't find client");
                var err = new Error('Client not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            console.log('@@@ $ rendering client detail');
            res.render('client_detail', { title: 'Client Detail', client: results.client, client_requests: results.clients_requests}); //, client_transactions: results.clients_transactions } );
        });

    };

  // Display Client create form on GET.
  exports.client_create_get = function(req, res, next) {
    var canadaRegions = ['AB',
                         'BC',
                         'MB',
                         'NB',
                         'Nl',
                         'NS',
                         'NT',
                         'NU',
                         'ON',
                         'PE',
                         'QC',
                         'SK',
                         'YT'];

    var countryOptions = ['Canada',
                          'United States',
                          'Other'];

    res.render('client_formTAX', { title: 'Register Form',countryOptions:countryOptions, canadaRegions:canadaRegions});
  };

  // Handle Client create on POST.
  exports.client_create_post = [
        // Validate fields.
        body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),
        body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.'),
        body('country').isLength({min: 1}).trim().withMessage('Please fill in Country of Residence.'),//2019-08-16
        body('tax_region').isLength({min: 1}).trim().withMessage('Enter Pov. or Territory or State'),
        body('city_address').isLength({min: 1}).trim().withMessage('Fill in "#, street, city"'),
        body('email_address').isEmail().trim().withMessage('your email address'),
        body('license_string').isLength({min: 1 }).trim().withMessage('Paste text from clipboard here'),
            //.isAlphanumeric().withMessage('clipboard text must only be made up of letters and numbers'),
        // Sanitize fields.
        sanitizeBody('first_name').trim().escape(),
        sanitizeBody('family_name').trim().escape(),
        sanitizeBody('country').trim().escape(),//2019-08-16
        sanitizeBody('tax_region').trim().escape(),
        sanitizeBody('city_address').trim().escape(),
        sanitizeBody('email_address').trim().escape(),
        sanitizeBody('license_string').trim().escape(),

        // Process request after validation and sanitization.
        (req, res, next) => {

            // Extract the validation errors from a request.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('@@@ $ Console: errors spotted in validationResult for "client_create_post"');
                debug('DEBUG: errors spotted in validationResult for "client_create_post"');
                // There are errors. Render form again with sanitized values/errors messages.
                res.render('client_form', { title: 'Create Client', client: req.body, errors: errors.array() });
                return;

            }else{
                // Data from form is valid.
                //multiple could happen so distinguish by date asynchronously
                //or possibly simply advise  (to be done later)
                var rgrqcd = req.body.license_string;
                console.log('@@@ $ reg_reqst_code is: ' + rgrqcd + '  type: ' + typeof rgrqcd );
                var arrayFCode = [];
                arrayFCode = rgrqcd.split(":");
                console.log('@@@ $ arrayFCode follows');
                console.log(arrayFCode);
                //var appname = arrayFCode[2]; //name part USB or CPU
                var device_type = arrayFCode[2];
                var device_id = arrayFCode[0];
                var format_code = arrayFCode[1];//keep FCODE format for now
                var mod_Id_Vrs = arrayFCode[3];//2019-01-30 added for version control with unique Ids
                var errMsg = "unspecified error";//2019-02-01 added
                var errMsg2 = "error:  unknown"; //ibid ^
                //added line to force recompition

                const now = Date();
                //find country_id and region_id from country_name and region_name, insert as countr_id & region_id variables

                async.parallel({
                 countrytaxauthority: function(callback){
                  CountryTaxAuthority.find({'country_name':target_country}).exec(callback)
                 },
                 regionalauthority: function(callback){
                  RegionalAuthority.find({'region_code':target_region_code}).exec(callback)
                 }
                }, function(err,results) {
                   console.log("@@@ $ in CTA.findById for create client callback")
                   if(err){
                     console.log('@@@ $ error in clientcontroller ASYNC for country & region.find for populate _id');
                     return  next(err);
                   }
                   if(results.countrytaxauthority==null){
                     console.log("@@@ $ clientcontroller can't find countrytaxauthority");
                     var err = new Error('CountryTaxAuthority not found');
                     err.status = 404;
                     return next(err);
                   }
                   if(results.regionalauthority==null){
                     console.log("@@@ $ clientcontroller can't find regionalauthority");
                     var err = new Error('RegionalAuthority not found');
                     err.status = 404;
                     return next(err);
                   }
                   var country_id = countrytaxauthority._id;
                   var regional_id = regionalauthority._id;

                 })//ends function(err,results) 2nd clause of ASYNC.PARALLEL

                .then(()=> {
                  // Create a Client object with escaped and trimmed data.
                  var client = new Client(
                    {
                        license_string: rgrqcd, //2019-01-30 added
                        device_id: device_id,
                        device_type: device_type,
                        format_code: format_code,
                        moduleIdVrs: mod_Id_Vrs,//2019-01-30 added
                        status: "pending",
                        first_name: req.body.first_name,
                        family_name: req.body.family_name,
                        country: req.body.country,//2019-08-16
                        country_id: country_id,//2019-09-10
                        tax_region: req.body.tax_region,
                        region_id: regional_id,//2019-09-19
                        city_address: req.body.city_address,
                        email_address: req.body.email_address,
                        registration_date: now,
                    });
                client.save(function (err) {
                    if (err) {
                      errMsg = "Probably this System Id string is already in use" + "<br />" +
                      "Try logging into 'Account View' with it instead.";
                      errMsg2 = "error: " + err;
                      res.render('errorMsg', { title: 'Registration Error', client: req.body, message:errMsg, message2:'for client create Id: ',  message3:rgrqcd, ExpressErr:errMsg2});
                      //return next(err);
                      return;//2019-02-01 temporary???
                    } // go on to create clientrequest entry

                console.log('@@@ $ CREATE client & clientrequest successful redirect to client URL: ' + client.url);

                var clientrequest = new ClientRequest (
                   {
                     //license_string: rgrqcd, //2019-01-30 added complete string to allow multiple modules on same computer (& versions)
                     appname:device_type,
                     client:client._id,   //client._id,
                     formatCode:format_code,
                     moduleIdVrs: mod_Id_Vrs,//2019-01-30 added
                     status:"pending"
                  });

                  console.log('@@@ ++ clientrequest.client is: ' + clientrequest.client);
                  //Statii available are:  ['pending','validated','canceled','invalid']
                  //these values have already been checked and sanitized so commit right away
                  clientrequest.save(function (err) {
                     if (err) {
                       console.log('@@@ $ an error in clientrequest save: ' + err);
                       errMsg = "Unknown error, verify if this Id String is already used for 'View Account'" +"<br />" +
                                  "If error persists contact us stating exact error message given below.";
                       errMsg2 = "error: " + err;
                       res.render('errorMsg', { title: 'Registration Error', client: req.body, message:errMsg, message2:'for client create Id: ',  message3:rgrqcd, ExpressErr:errMsg2});                       //return next(err);
                       return;//2019-02-01 maybe getting rid of moding headers after they were sent error
                     }
                     console.log('@@@ $ clientrequest save OK');
                    })
                 // Successful - redirect to new clientrecord.
                 res.redirect(client.url);//send to show client_detail
               });//end client.save
             })//ends .then clause
          }//ends major else clause
        }//ends initial (req,res,next) opening function
    ];


  // Display Client delete form on GET.
  exports.client_delete_get = function(req, res, next) {
        //console.log("@@@ $ entering client_delete_get")
        async.parallel({
            client: function(callback) {
                Client.findById(req.params.id).exec(callback)//findById executes the callback with
                                                             //presumably info needed by async
            },
            client_requests: function(callback) {
                //console.log("@@@ $ looking for clientrequests for client with id: " + req.params.id)
                ClientRequest.find({ 'client': req.params.id }).exec(callback)
            },

        }, function(err, results) {
            console.log('client_delete_get async results follow');
            console.log(results);
            if (err) {
              console.log('@@@ $ err in client_delete_get');
              return next(err);
            }
            if (results.client==null) { // No results.
                res.redirect('/catalog/clients');
            }
            if (results.client_requests === undefined) { //why?
                   console.log('@@@ $ assigning null to undefined client_requests');
                   results.client_requests = null;
                }
            // Successful, so render.
            //console.log("@@@ $ rendering client_delete_get form for:" + results.client);
            console.log('@@@ $ and client_requests: ' + results.client_requests);
            res.render('client_delete', { title: 'Delete Client', client: results.client, client_requests: results.client_requests}); //({ client_transactions: results.client_transactions } );
        });

    };

  // Handle Client delete on POST.
  exports.client_delete_post = function(req, res, next) {
      console.log("@@@ $ starting async parallel for client_delete_post");

      async.parallel({  //arguments are 2 objects:  ({fn's},callback
          client: function(callback) {
            console.log("@@@ $ in async for client find")
            Client.findById(req.body.clientid).exec(callback)
          },
          clients_requests: function(callback) {
            console.log("@@@ $ finding clientrequests in async")
            ClientRequest.find({ 'client': req.body.clientid }).exec(callback)
          },
          //clients_transactions: function(callback){
            //ClientTransaction.find({ 'client': req.body.client.id }).exec(callback)
          //},
      }, function(err, results) {  //Object of fn's + call to callback ends,  callback fn definition starts
          console.log('@@@ $ client_delete_post async results follow');
          console.log(results);
          if (err) {
            console.log('@@@ $ async callback error: ' + err);
            return next(err); }
          // Success
          if (results.clients_requests.length > 0 ) {
              console.log("@@@ $ client has archived requests");
              // Client has clientrequests. Render in same way as for GET route.
              res.render('client_delete', { title: 'Delete Client', client: results.client, client_requests: results.clients_requests} ) //, client_transactions: results.clients_transactions } );
              return console.error('@@@ $ tried to return to client_delete');

          } else {
              console.log('@@@ $ delete client next: ' + req.body.clientid);
              // Client has no outstanding requets or transacts. Delete object and redirect to the list of clients.
              Client.findByIdAndRemove(req.body.clientid, function deleteClient(err) {
                  if (err) {
                    console.log("@@@ $ error in deleting client" + err);
                     return next(err); }
                  // Success - go to client list
                  res.redirect('/catalog/clients')
               }) //findById ends
          } //callback fn ends
      }); //async ends
  }; //export fn ends

  // Display Client update form on GET.
  exports.client_update_get = function(req, res, next) {
    console.log("@@@ $ sanitizing body in client_update_get");
        //req.params.sanitize('id').escape().trim();
        sanitizeBody(req.params.id).trim().escape();//2019-08-16 modded from simple 'id'
        //client: function(callback) {
        async.parallel({
        client: function(callback) {
        Client.findById(req.params.id).exec(callback)
      }, //only one function called asynchronously. ending comma allowed to simplify chaining a possible next one
    }, function(err, results) {   //note leading "}" closes async's opening "{"
         console.log("@@@ # in client findById callback")
         if(err) {
           console.log("@@@ # in client findById error callback",err)
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
         console.log("@@@ $ render Client update form next:  using results???  vv");
         console.log(results);
         let stringRegisterDate = new Date(results.client.registration_date); //possible convert to string for mongodb dates
         stringRegisterDate = stringRegisterDate.toLocaleString().split(" ")[0];//2019-08-16
         console.log("@@@ $ stringRegisterDate is: ",stringRegisterDate,"  of type: ", typeof stringRegisterDate);

         res.render('client_form_Update', { title: 'Update Client',
                                     client: results.client,
                                     stringRegisterDate: stringRegisterDate,
                                     query: "Update"});
    });//async ends note closing } is not for async's opening "{", that's closed above, this one closes  fn(err,rslts){
  }; //export fn ends  NOTE this is a request to update with changes, only accepted if posted (as follows)

  //new function for clientrequest for this specific client
  // Handle Client update on POST.
  exports.client_update_post = [  //2019-08-16   try again
             // Validate fields.
             body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),
             body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.'),
             body('registration_date','Invalid date').optional({ checkFalsy: true }).isISO8601(),
                 //.isAlphanumeric().withMessage('clipboard text must be exactly as given in REGISTER tab'),
             body('country', 'specify country name').trim(),
             body('tax_region','specify Prov./Territory/State').trim(),
             body('city_address','enter: #, street, city').trim(),
             body('email_address').isEmail().trim().withMessage('your email address'),
             body('license_string').isLength({min: 1 }).trim().withMessage('Paste text from clipboard here'),
             // Sanitize fields.
             sanitizeBody('first_name').trim().escape(),
             sanitizeBody('family_name').trim().escape(),
             sanitizeBody('email_address').trim().escape(),
             sanitizeBody('country').trim().escape(),//2019-08-16
             sanitizeBody('tax_region').trim().escape(),
             sanitizeBody('city_address').trim().escape(),
             sanitizeBody('registration_date').trim().escape(),
             sanitizeBody('license_string').trim().escape(),

             //Process request after validation and sanitization.
             (req, res, next) => {

          //
          console.log("@@@ # in POST client update, function part");
          // Extract the validation errors from a request.
          const errors = validationResult(req);

          if (!errors.isEmpty()) {
              console.log("@@@ ++ POST client update err: " + err);
              // There are errors. Render form again with sanitized values/errors messages.
              res.render('client_form_Update', { title: 'Create Client', client: req.body, errors: errors.array() });
              return;

          } else {
            // Data from form is valid. Update the record.
            Client.findByIdAndUpdate(req.params.id, req.body, {}, function (err,theclient) {  //req.body was simply "client" (but caused error)
              console.log("@@@ $ error trying to update client, err> " + err);
              if (err) {
                console.log('@@@ $ updating client document throws err: ' + err);
                return next(err);
              }
              // Successful - redirect to clientrequest detail page.
              res.redirect(theclient.url);
            });
          }
        }
    ] //validation stuff hangs system up!!!
