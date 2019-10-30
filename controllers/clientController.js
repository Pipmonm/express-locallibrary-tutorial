//clientrequest instance controller js
var Client = require('../models/client');
var ClientRequest = require('../models/clientrequest');//2019-01-31 removed chasing E11000
var MessagesIn = require('../models/messagesIn');//2019-10-01 for tracking msgs

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
  if(stringPieces[2] != "USB" && stringPieces[2] != "CPU" && stringPieces[2] != "NumLn" && stringPieces[2] != "Eqt")return "fail";
  return "pass";
};

//forcing recompile
function findModdedIdString(inString){
  let modArray = inString.split(":");//2019-10-29 added
  let moddedSysIdString = modArray[0] + ":" + modArray[1] + ":" + modArray[2] + ":" + modArray[3].slice(0,2);//2019-10-29 added
  console.log("@@@ $ modded string from sysIdString): " + moddedSysIdString);//2019-10-29 modified
  return moddedSysIdString;
}

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
           //var modArray = sysIdString.split(":");//2019-10-29 added
           let moddedSysIdString = findModdedIdString(sysIdString); //modArray[0] + modArray[1]+ modArray[2] + modArray[3].slice(0,2);//2019-10-29 added
           var deviceId = sysIdString.split(":")[0];//2019-01-30 not used currently  //extract device id
           var option2 = false;//2019-03-11 finding a way around record returned as an array vs. a single object



           async.parallel({
              client: function(callback) {
                  Client.find({'license_string':moddedSysIdString},callback);//2019-10-29 modified
                },
              messages: function(callback){
                  MessagesIn.find({'license_string':moddedSysIdString},callback);//2019-10-29 modded//2019-10-16 new //2019-01-30 TO BE MODIFIED to license_string
                },
            }, function(err, results) {
             if(err){
               console.log("@@@ $ err in Client.find license_string" + err);
               return  next(err);
             }
             console.log("@@@ $ quick glance at client messages: ",results.messages);

             console.log("@@@ $ found client(s) for doc req. status >v" );
             if(!results.client.length || results.client[0] == undefined || results.client[0].deviceId == undefined){
               if(!results.client.length || results.client == null ||results.client == undefined){
                 console.log("@@@ $ err Client record is invalid",results.client);
                 // There are errors. Render the form again with sanitized values/error messages.
                 res.render('clientstatus_form', { title: 'Request Status: This client data not Registered',
                              message1: "Use clipboard contents of application's Registration Data to Register first then try again",
                              message2: "(NOTE: These are placed in your ClipBoard upon entering Registration Data page)",
                              sysIdString: sysIdString, errors: errors.array()});
                 return;
               }else{//2019-03-11 seems should be in an array
                 option2 = true;//2019-03-11 seems like record is not an array
                 console.log("@@@ $ option2 is true & doc is: /n",results.client);
               }
             }

             if(!option2 && results.client.length > 1 ){//2019-03-11 was only 'doc'
               console.log("@@@ $ multiples of same license_string " + moddedSysIdString);//2019-01-30 modded from deviceId
             }
           //});  //needs to include following
           //we want to find yssId record, generate license key and display it as
           //part of client detail   !!!! may have to rename aeveryting client to sysId???
           //failing finding one we redirect to home page
           let doc = results.client;//2019-10-16 simpler than rewriting all 'doc' items
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
               res.render('client_licensekey', {title: 'License Key Details', client: newdoc, msgs:results.messages});
            });
         });//end "err, results" callback + async '('
      };//end else clause

   }//end "req,res, next" callback function WITHOUT SEMI-COLON OR COMMA  ie nothing follows in array
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

  //get client request for FAQ or messaging
  exports.client_prolog = function(req,res,next) {
    //otherwise
    let msg1 = "Please select field of interest by clicking on either of" +"<br />" +
                "the following options.";

     let msg2 = "Note that any messages returned to you can be seen by accessing the" + "<br />" +
                "'View Account' tab." + "<br />" +
                " (you will need the 'Registration Data' that is automatically loaded in the" + "<br />" +
                "Window's clipboard whenever you click on a module's 'Registration Data' tab)";

     let msg3 = "You will also need this 'Registration Data' to send us a message";

     let sourceA = '/catalog/clientmessages_in'
     let sourceA2 = 'SEND MSG';

     let sourceB = '/catalog/system_FAQ';
     let sourceB2 = 'FAQ';

     res.render('client_prolog', {title: "FAQ & Msg Request Page", msg1:msg1,msg2:msg2,msg3:msg3});
  };

  exports.messages_in_get = function(req,res,next){
      let title = "Message Service";
      let message1 = "NOTE: Messages can only contain letters, punctuation, and " + "<br />"+
                   "numbers, any other characters will cause message to be ignored."

      res.render('client_msg_form', {title: title, message1:message1, message2:""});

  };

  exports.messages_in_post = [
    // Validate fields.
    body('sysIdString').isLength({min: 10 }).trim().withMessage('Paste text from clipboard here'),
    //body('sysIdString').isAlphanumeric().withMessage('clipboard text must be as given in module Registration Data'),
    body('msgString').isLength({min:5, max:300}).trim().withMessage("Place comment here"),
    //body('msgString').isAlphanumeric().withMessage('message can only have letters, punctuation, and numbers'),
    // Sanitize fields.
    sanitizeBody('sysIdString').trim().escape(),
    sanitizeBody('msgString').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        var fromUser = req.params.user;//2019-09-30
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        //2019-09-29  extra checks on sysIdString and msgString
        let checkString = checkValidIdString(req.body.sysIdString);//returns pass/fail
        var moddedSysIdString = findModdedIdString(req.body.sysIdString);//mod:0001>>2019-10-30
        let bannedWords = ["fuck","f__k","fck"," shit ","piss"," screw ", " cock ","suck","asshole","damn", "__"," /",'"<'];
        let checkMsg ="pass";
        let suspectString = req.body.msgString;
        var suspectWord = [];
        for(var i=0;i<bannedWords.length;i++){
          if(suspectString.indexOf(bannedWords[i]) != -1){
            checkMsg = "fail";
            suspectWord.push(bannedWords[i]);
          }
        }

        if (!errors.isEmpty() || checkString != "pass" || checkMsg != "pass") {
            console.log('@@@ $ Errors in validationResult for "msgIn_create_post" in order: checkString & checkMsg',checkString," & ",checkMsg);
            console.log('@@@ $ strings are: sysIdString: ',req.body.sysIdString, "  & msgString: ",suspectString, "  & ", suspectWord);
            let message1 = "NOTE: Messages are verified and filtered for improper characters which may cause " +
                           "message to be rejected. "
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('client_msg_form', { title: 'Message Errors', message1:message1, errors: errors.array() });
            return;

        }else{
            // Data from form is valid.
            //multiple could happen so distinguish by date asynchronously
            //or possibly simply advise  (to be done later)
            var rgrqcd = req.body.sysIdString;
            var moddedSysIdString = findModdedIdString(rgrqcd);//mod:0001>>2019-10-30
            console.log('@@@ $ msg from moddedSysIdString is: ' + moddedSysIdString + '  type: ' + typeof moddedSysIdString );//mod:0001>>2019-10=29
            req.body.msgString.replace("'","\'");//allow single quote
            console.log('@@@ $ message follows');
            console.log(req.body.msgString);
            }
        //2019-09-30   insert message into client account & in messagesIn folder using app(name?)controller
        //first get client
        var option2 = false;//2019-03-11 finding a way around record returned as an array vs. a single object
        Client.find({'license_string':moddedSysIdString},function(err, doc){ //mod:0001>>2019-09-30 MODIFIED license_string
          if(err){
            console.log("@@@ $ err in Client.find license_string for msg delivery" + err);
            return  next(err);
          }
          console.log("@@@ $ found client for msg delivery & doc is of type: ",typeof doc );
          if(!doc.length || doc[0] == undefined || doc[0].device_id == undefined){
            if(!doc.length || doc == null || doc == undefined){
              console.log("@@@ $ err Client record is invalid" + doc);
              // There are errors. Render the form again with sanitized values/error messages.
              res.render('clientstatus_form', { title: 'Request Status: This client data not Registered',
                           message1: "Use clipboard contents of application's Registration Data to Register first then try again",
                           message2: "(NOTE: These are placed in your ClipBoard upon entering Registration Data page)",
                           sysIdString: moddedSysIdString, errors: errors.array()});//mod:0001>>2019-10-30 was rgrqcd
              return;
            }else{//2019-03-11 seems should be in an array
              option2 = true;//2019-03-11 seems like record is not an array
              console.log("@@@ $ option2 is true & doc is: /n" + doc);
            }
          }

          if(!option2 && doc.length > 1 ){//2019-03-11 was only 'doc'
            console.log("@@@ $ multiples of same license_string " + moddedSysIdString);//2019-01-30 modded from deviceId
            res.redirect('/catalog');//go home or better, give message
          }else{
            //2019-09-39  a general find (ie not FindOne) returns an array even if only 1 element in it.
            var docId = doc[0]._id;
            var clientName = doc[0].name;//2019-10-01 added
            var dummy = doc[0];
            console.log("@@@ $ doc[0]._id: ",docId);
            console.log("@@@ $ from doc[0]?: ",doc[0]);
            if(docId == undefined){
              docId = doc._id;
              dummy = doc;
            }
            var msgArray = dummy.return_msgs;
            let now = Date().toString();
            now = now.split("GMT")[0];//only date part
            let datedMsg = now + fromUser + ">>" + req.body.msgString;
            //2019-09-30  above was string 'client>>' now trying for pass in via URL param
            if(fromUser== "client_msg"){
               msgArray.unshift(datedMsg);//at the top for client
             }else{
               msgArray.push(datedMsg);//below for reply
             }
            console.log("@@@ $ updated msgArray for Client: ",msgArray);

            var message_in = new MessagesIn(
                  {
                    license_string: moddedSysIdString, //mod:0001>>2019-09-30 MODIFIED license_string
                    name: clientName,
                    message: datedMsg,
                    reply: "",
                    viewed: false,
                    responded: false,
                    follow_up: true,
                    action: "inactive"
                  });
            message_in.save(function (err){
                   if(err){return next(err)}
               });//WORKING HERE
            //2019-10-01 added (note ')' follows callback)   async parallel ends
            Client.findByIdAndUpdate(docId, {return_msgs: msgArray },{upsert: true, 'new': true}, function(err,newdoc){
                 //prolog was license_key !!! //2019-01-30  very critical update right here,  what makes ._id be whatever it is?
                 //2019-03-11 worse yet updated from 'doc[0]._id' to 'docId'

              if(err){
                console.log("@@@ $ error in async parallel for msg creation or client update : " + err);
              }
              console.log("@@@ $ client stored msg as: ",newdoc.messages);//2019-09-30  desperate measures

           });

             // Successful - redirect to new clientrecord.
        res.redirect('/catalog');//send to show client_detail
    }//end else clause
  })//end client find
}//callback fn ends
]

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

    res.render('client_formTAX', { title: 'Register Form', canadaRegions:canadaRegions, countryOptions:countryOptions});
  };

  // Handle Client create on POST.
  exports.client_create_post = [
        // Validate fields.
        body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),
        body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.'),
        body('country').isLength({min: 1}).trim().withMessage('Please fill in Country of Residence.'),//2019-08-16
        body('tax_region').isLength({min: 1}).trim().withMessage('Enter Pov. or Territory or State'),
        body('city_address').isLength({min: 1}).trim().withMessage('Fill in "#, street, city"'),
        body('postal_code').isLength({min:1}).trim().withMessage('Postal Code (ZipCode) required'),
        body('email_address').isEmail().trim().withMessage('your email address'),
        body('license_string').isLength({min: 1 }).trim().withMessage('Paste text from clipboard here'),
            //.isAlphanumeric().withMessage('clipboard text must only be made up of letters and numbers'),
        // Sanitize fields.
        sanitizeBody('first_name').trim().escape(),
        sanitizeBody('family_name').trim().escape(),
        sanitizeBody('country').trim().escape(),//2019-08-16
        sanitizeBody('tax_region').trim().escape(),
        sanitizeBody('city_address').trim().escape(),
        sanitizeBody('postal_code').trim().escape(),
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
                let moddedSysIdString=findModdedIdString(rgrqcd)//mod:0001>>2019-09-30 MODIFIED license_string
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
/*
        UserModel.find({ nick: act.params }, function (err, users) {
          if (err) { console.log(err) };
          if (!users.length) { //do stuff here };
          else {
            users.forEach(function (user) {
              console.log(user.nick);
            });
          }
        });
*/
                //check that not already exists //2019-01-30 added new view == errorMsg  also check changed
/*  does not work and new way to be found for checking duplicates
                Client.find({license_string: "rgrqcd"}, function (err, result){           //2019-02-01 complete redo
                    if(err){console.log("@@@ $ error finding license_string in create client " + err)}
                    if(!result.length) {
                        console.log("@@@ $ System Id string  already registered");
                        var errMsg = "This System Id string is already in use" + "<br />" +
                        "Try instead to log into 'Account View' with it";
                        // There are errors. Render form again with sanitized values/errors messages.
                        //added comment to fix see no change error
                        res.render('errorMsg', { title: 'Registration Error', client: req.body, message:errMsg, message2:'for Id string: ',  message3:rgrqcd });
                        return;
                        //above sequence depends on 'res' being in scope from post handler that includes it
                    };
                });//2019-02-01  end duplicate check
*/

                //var stringId = client._id.toString();
                //console.log('stringId: ' + stringId + '  of type: ' + typeof stringId);
                //get date
                const now = Date();
                // Create a Client object with escaped and trimmed data.
                var client = new Client(
                    {
                        license_string: moddedSysIdString,//mod:0001>>2019-09-30 MODIFIED license_string
                        device_id: device_id,
                        device_type: device_type,
                        format_code: format_code,
                        moduleIdVrs: mod_Id_Vrs,//2019-01-30 added
                        status: "pending",
                        first_name: req.body.first_name,
                        family_name: req.body.family_name,
                        country: req.body.country,//2019-08-16
                        tax_region: req.body.tax_region,
                        city_address: req.body.city_address,
                        postal_code: req.body.postal_code,
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
             body('postal_code','Postal Code (ZipCode) required').trim(),
             body('email_address').isEmail().trim().withMessage('your email address'),
             body('license_string').isLength({min: 1 }).trim().withMessage('Paste text from clipboard here'),

             // Sanitize fields.
             sanitizeBody('first_name').trim().escape(),
             sanitizeBody('family_name').trim().escape(),
             sanitizeBody('email_address').trim().escape(),
             sanitizeBody('country').trim().escape(),//2019-08-16
             sanitizeBody('tax_region').trim().escape(),
             sanitizeBody('city_address').trim().escape(),
             sanitizeBody('postal_code').trim().escape(),
             sanitizeBody('registration_date').trim().escape(),
             sanitizeBody('license_string').trim().escape(),
             sanitizeBody('return_msgs').trim().escape(),//2019-09-30 added

             //Process request after validation and sanitization.
             (req, res, next) => {

          //
          console.log("@@@ # in POST client update, function part");
          // Extract the validation errors from a request.
          const errors = validationResult(req);

          if (!errors.isEmpty()) {
              console.log("@@@ ++ POST client update err: " + errors);
              // There are errors. Render form again with sanitized values/errors messages.
              res.render('client_form_Update', { title: 'Create Client', client: req.body, errors: errors.array() });
              return;

          } else {
            // Data from form is valid. Update the record.
            let moddedSysIdString = findModdedIdString(req.body.license_string);//mod:0001>>2019-09-30 MODIFIED license_string
            req.body.license_string = moddedSysIdString;//mod:0001>>2019-09-30 line added
            Client.findByIdAndUpdate(req.params.id, req.body, {}, function(err,theclient) {  //req.body was simply "client" (but caused error)
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
