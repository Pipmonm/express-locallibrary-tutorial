//clientrequest instance controller js
var Client = require('../models/client');
var ClientRequest = require('../models/clientrequest');
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
  if(stringPieces.length !=3)return "fail";
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
     console.log("@@@ $ received status request for: " + sysIdString );
     let formatCheck = checkValidIdString(sysIdString);//2018-12-14  added conditins for validating id string
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
           console.log("@@@ $ finding client with sysIdString: " + sysIdString);
           var deviceId = sysIdString.split(":")[0]; //extract device id
           var mydoc;
           Client.find({'device_id':deviceId},function(err, doc){
             if(err){
               console.log("@@@ $ err in Client.find device_id" + err);
               return  next(err);
             }
             console.log("@@@ $ found client(s) for doc req. status >v" );
             console.log(doc[0].device_type);
             mydoc = doc;
             if(doc.length > 1 ){
               console.log("@@@ $ multiples of same deviceId " + deviceId);
             }
           //});  //needs to include following
           //we want to find yssId record, generate license key and display it as
           //part of client detail   !!!! may have to rename aeveryting client to sysId???
           //failing finding one we redirect to home page
           let R1=0x5c3f10bd9a;
           let R2=0xb9a3ce805c;
           //critical values above
           let id = doc[0].device_id;
           let randy = doc[0].format_code;

           let idSize = id.length;
           if(idSize<4)id=id + "1424953867";
           if(idSize>10)id = id.slice(0,10);
           id=parseInt(id,16);

           let key = -1;
           key = 0xffffffffff;
           let success = false;
           let result = 0x00000000;

           R1 = R1 + id;
           let shift = id & 0xf;
           R1 = R1 + (id>>shift);
           result = R1 ^ R2;

           result = result ^ randy;
           key = key ^ result;//done at server and sent to client
           console.log("licenseKey is: " + key.toString());

           Client.findByIdAndUpdate(doc[0]._id, {license_string: 'License is:', license_key: key.toString() },{upsert: true, 'new': true}, function(err,newdoc){
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
      res.render('client_form', { title: 'Register Form'});
  };

  // Handle Client create on POST.
  exports.client_create_post = [
        // Validate fields.
        body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),
        body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.'),
        body('email_address').isEmail().trim().withMessage('your email address'),
        body('register_request_code').isLength({min: 1 }).trim().withMessage('Paste text from clipboard here'),
            //.isAlphanumeric().withMessage('clipboard text must only be made up of letters and numbers'),
        // Sanitize fields.
        sanitizeBody('first_name').trim().escape(),
        sanitizeBody('family_name').trim().escape(),
        sanitizeBody('email_address').trim().escape(),
        sanitizeBody('register_request_code').trim().escape(),

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
                var rgrqcd = req.body.register_request_code;
                console.log('@@@ $ reg_reqst_code is: ' + rgrqcd + '  type: ' + typeof rgrqcd );
                var arrayFCode = [];
                arrayFCode = rgrqcd.split(":");
                console.log('@@@ $ arrayFCode follows');
                console.log(arrayFCode);
                //var appname = arrayFCode[2]; //name part USB or CPU
                var device_type = arrayFCode[2];
                var device_id = arrayFCode[0];
                var format_code = arrayFCode[1];//keep FCODE format for now

                //check that not already exists
                if(Client.find({device_id: "device_id"}, {device_id: 1}).limit(1)){
                  console.log('@@@ $ SystemId already registered"');
                  var errMsg = "This System Id is already in use" +
                  "Try logging into 'Account View' with it";
                  // There are errors. Render form again with sanitized values/errors messages.
                  //added comment to fix see no change error
                  res.render('errorMsg', { title: 'Registration Error', client: req.body, message:errMsg, message2:'for Id string: ',  message3:rgrqcd });
                  return;


                }


                //var stringId = client._id.toString();
                //console.log('stringId: ' + stringId + '  of type: ' + typeof stringId);
                //get date
                const now = Date();
                // Create a Client object with escaped and trimmed data.
                var client = new Client(
                    {
                        device_id: device_id,
                        device_type: device_type,
                        format_code: format_code,
                        status: "pending",
                        first_name: req.body.first_name,
                        family_name: req.body.family_name,
                        email_address: req.body.email_address,
                        registration_date: now,
                    });
                client.save(function (err) {
                    if (err) {
                      console.log('@@@ $ an error in client save: ' + err);
                      return next(err);
                    } // go on to create clientrequest entry
                console.log('@@@ $ CREATE client & clientrequest successful redirect to client URL: ' + client.url);

                var clientrequest = new ClientRequest (
                   {
                     appname:device_type,
                     client:client._id,   //client._id,
                     formatCode:format_code,
                     status:"pending"
                  });

                  console.log('@@@ ++ clientrequest.client is: ' + clientrequest.client);
                  //Statii available are:  ['pending','validated','canceled','invalid']
                  //these values have already been checked and sanitized so commit right away
                  clientrequest.save(function (err) {
                     if (err) {
                       console.log('@@@ $ an error in clientrequest save: ' + err);
                       return next(err);
                     }
                     console.log('@@@ $ clientrequest save OK');
                    })
                 // Successful - redirect to new clientrecord.
                 res.redirect(client.url);
                });
            }
        }
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
    console.log("@@@ $ sanitizing body in clientUpdate");
        //req.params.sanitize('id').escape().trim();
        sanitizeBody('id').trim().escape();
        //client: function(callback) {
        async.parallel({
        client: function(callback) {
        Client.findById(req.params.id).exec(callback)
      }, //only one function called asynchronously. ending comma allowed to simplify chaining a possible next one
    }, function(err, results) {   //note leading "}" closes async's opening "{"
         if(err) {
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
         res.render('client_form', { title: 'Update Client', client: results.client, query: "Update"});
    });//async ends note closing } is not for async's opening "{", that's closed above, this one closes  fn(err,rslts){
  }; //export fn ends  NOTE this is a request to update with changes, only accepted if posted (as follows)

  //new function for clientrequest for this specific client
  // Handle Client update on POST.
  exports.client_update_post = function(req, res, next)  {   //for validation this first line (past = sign) dissappears
          //[  //the line reads   blah blah blah = [    and following   (uncomment closing ]  at function end)
             // Validate fields.
             //body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),
             //body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.'),
             //body('email_address').isEmail().trim().withMessage('your email address'),
             //body('registration_date').isLength({min: 1 }).trim().withMessage('registration_date'),
                 //.isAlphanumeric().withMessage('clipboard text must be exactly as given in REGISTER tab'),
             // Sanitize fields.
             //sanitizeBody('first_name').trim().escape(),
             //sanitizeBody('family_name').trim().escape(),
             //sanitizeBody('email_address').trim().escape(),
             //sanitizeBody('registration_date').trim().escape(),

             // Process request after validation and sanitization.
             //(req, res, next) =>

          //
          console.log("@@@ ++ in POST client update, function part");
          // Extract the validation errors from a request.
          const errors = validationResult(req);

          if (!errors.isEmpty()) {
              console.log("@@@ ++ POST client update err: " + err);
              // There are errors. Render form again with sanitized values/errors messages.
              res.render('client_form', { title: 'Create Client', client: req.body, errors: errors.array() });
              return;
          }
          else {
            // Data from form is valid. Update the record.
            Client.findByIdAndUpdate(req.params.id, req.body, {}, function (err,theclient) {  //req.body was simply "client" (but caused error)
              console.log("@@@ $ error trying to update client, err> " + err);
              if (err) { return next(err); }
              // Successful - redirect to clientrequest detail page.
              res.redirect(theclient.url);
            });
          }
        }
    //]; //validation stuff hangs system up!!!
