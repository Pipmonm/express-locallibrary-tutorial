//client instance controller js
var Client = require('../models/client'); //collection will be known as 'clients'
var MessagesIn = require('../models/messagesIn');//as  'messagesIns'
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

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


function restore(item){
   //str = "Please visit Microsoft and Microsoft!";
   //var n = str.replace(/Microsoft/g, "W3Schools");
   for(x in item){
     if(typeof item[x]== 'string') item[x] = item[x].replace(/&#x27;/g, "'");
     console.log('@@@ $ item[x]: ',item[x]);
     //item2.replace(/&#x27;/g, "'");
   }
  return item;
}

// Display list of all messagesIns.
exports.messagesIn_list = function(req, res, next) {
  console.log('@@@ $ at messagesIn_list');
  MessagesIn.find({}) //was   ({}),'status'
    .exec(function (err, messages) {
      console.log("@@@ $ executing callback for messages list; if err> : " + err );
      if (err) { return next(err); }
      console.log('@@@ $ found messages as per: ');
      console.log(messages);
      res.render('messages_list', { title: 'All Messages List', messagesIn_list: messages });
    });

};

// Display list of all messagesIns.
//example from mongoose docs:
// executes, name LIKE john and only selecting the "name" and "friends" fields
//MyModel.find({ name: /john/i }, 'name friends', function (err, docs) { })
exports.messagesIn_list_follow = function(req, res, next) {
  console.log('@@@ $ at messagesIn_list_follow');
  MessagesIn.find({follow_up: true}, 'message url', function (err, messages) {
      console.log("@@@ $ executing callback for messages 'follow' list; if err> : " + err );
      if (err) { return next(err); }
      //console.log('@@@ $ found "follow" messages as per: ');
      //console.log(messages);
      let msgArray = [];
      for (each of messages) {
         each = restore(each);
         msgArray.push(each);
      }
      //res.render('messages_list', { title: 'Active Messages List', messagesIn_list: messages });
      res.render('messages_list', { title: 'Active Messages List', messagesIn_list: messages });
    });

};

// Display detail page for a specific messagesIn.
exports.messagesIn_detail = function(req, res, next) {
      //console.log('@@@ $ entering client_request_detail');
      sanitizeBody(req.params.id).trim().escape();
      var id = req.params.id;
      console.log('@@@ $ TODAY request to detail messagesIn with id: ' + id);

      MessagesIn.findById(id) //was req.params.id  //modified as per above change :MOD: 2018-03-08 9:20
        //.populate('client')
        .exec(function (err, messagesIn) { //results of findById passed as messagesIn
        console.log('@@@ $ returned value for messagesIn:');
        console.log(messagesIn);
        if (err) {
           console.log("@@@ $ messagesIn findById error: " + err);
           debug("messagesIn err: %s ",err);
           return next(err);
         }
        if (messagesIn==null) { // No results.
            console.log('@@@ $  err: no messagesIn found for this id ')
            var err = new Error('null messagesIn found');
            err.status = 404;
            return next(err);
          }
        //populate client
        //messagesIn.populate(messagesIn,'client',function(err,user){
              //console.log('@@@ $$ should have user: ' + user ); // + '  +user.client.name:' + user.client.name);
              //if(err)return console.error('@@@ $$ cannot populate client: err ' + err);
        //})
        // Successful, so render.
        console.log('@@@ $ rendering messagesIn_detail for message: ' + messagesIn.message);
        res.render('messagesIn_detail', { title: 'Messages: ', messagesIn:  messagesIn});
      })

  };

// NOT USED CURRENTLY & THEREFORE HAS NO PUG FILES
exports.msgs_reply_create_get = function(req, res, next) {

      MessagesIn.find() //was {},'client'
      .exec(function (err, clients) {
        if (err) { return next(err); }
        // Successful, so render.
        let message1 = "NOTE: Messages may only contain letters, punctuation, and " + "<br />"+
                     "numbers, any other characters will cause message to be ignored."
        console.log('@@@ $ client_list: ' + clients);
        res.render('messagesIn_form', {title: 'Create Message', client_list:clients, message1:message1});
      });

  };
//WOKING HERE TOMORROW
//somehow modification seems to not have been implementee

// Handle messagesIn create on POST.
exports.msgs_reply_create_post = [
    // Validate fields.
    body('sysIdString').isLength({min: 10 }).trim().withMessage('Paste text from clipboard here'),
    //body('sysIdString').isAlphanumeric().withMessage('clipboard text must be as given in module Registration Data'),
    body('msgString').isLength({min:5, max:300}).trim().withMessage("Place comment here"),
    //body('msgString').isAlphanumeric().withMessage('message can only have letters, punctuation, and numbers'),
    // Sanitize fields.
    body('replyString').isLength({max:500}).trim().withMessage(""),
    body('viewed', 'True/False').isBoolean().withMessage("if you're reading this it's been viewed!"),
    body('responded', 'True/False').isBoolean().withMessage("true only if responded"),
    body('follow_up', 'True/False whether more req.').isBoolean().withMessage("True if further action req."),
    body('action', 'dscrptn of follow-on action').isLength({max:200}).withMessage("to be done"),

    sanitizeBody('sysIdString').trim().escape(),
    sanitizeBody('msgString').trim().escape(),
    sanitizeBody('replyString').trim().escape(),
    sanitizeBody('viewed').trim().escape(),
    sanitizeBody('responded').trim().escape(),
    sanitizeBody('follow_up').trim().escape(),
    sanitizeBody('action').trim().escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {
        //extract whether its a user or site-support message
        var fromUser = req.params.user;//2019-09-30
        //based on user should do full create if 'client'
        //but only upsert reply into existing msg if reply
        //by that reasoning should probably have explicit
        //reply function and leave create alone

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        //2019-09-29  extra checks on sysIdString and msgString
        let checkString = checkValidIdString(req.body.sysIdString);//returns pass/fail
        let moddedSysIdString = findModdedIdString(req.body.sysIdString);//mod:0001>>2019-10-30 added line
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
            console.log('@@@ $ strings are: moddedSysIdString: ',moddedSysIdString, "  & msgString: ",suspectString, "  & ", suspectWord);
            let message1 = "NOTE: Messages are verified and filtered for improper characters which may cause " +
                           "message to be rejected. "
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('client_msg_form', { title: 'Message Errors', message1:message1, errors: errors.array() });
            return;

         }else{

           console.log('@@@ $ msg from id is: ' + rgrqcd + '  type: ' + typeof rgrqcd );
           req.body.msgString.replace("'","\'");//allow single quote
           console.log('@@@ $ message follows');
           console.log(req.body.msgString);
         }

         //var datedREply = "";//2019-10-03 added
        // Create a messagesIn object with escaped and trimmed data.
        var messagesIn = new MessagesIn( //.body. here is body of request which has many key fields
          {
            license_string: moddedSysIdString, //mod:0001>>2019-10-30 replaced rgrqcd, //sysIdString
            name: clientName,
            message: datedMsg,
            reply: datedReply,
            viewed: false,
            responded: false,
            follow_up: false,
            action: "inactive"
          });

        if (!errors.isEmpty()) {
            console.log('@@@ $ in messagesIn_create_post, validate error report not empty');
            console.log('@@@ $ errors: ' + errors);
            // There are errors. Render form again with sanitized values and error messages.
            // Get all clients and appnames & statii for form.
            async.parallel({
                clients: function(callback) {
                    Client.find(callback);
                },
               messages: function(callback) {
                    MessagesIn.find(callback);
               },

            }, function(err, results) {
                if (err) { return next(err); }

                console.log('@@@ $ rendering messagesIn_form for clrq_create_post');
                res.render('messagesIn_form', { title: 'Create MessageIn',clients:results.clients, messagesIn: messagesIn, errors: errors.array() });
            }); //ends async clause
            return;

        } else {
            // Data from form is valid.
            messagesIn.save(function (err) {
                if (err) { return next(err); }
                   //else Successful - redirect to new record.
                   res.redirect(messagesIn.url);
                });
        }//end the else
    }
];

// Display messagesIn delete form on GET.
exports.messagesIn_delete_get = function(req, res, next) {
      console.log('@@@ $ entering messagesIn_delete_get params follows');
      sanitizeBody(req.params.id).trim().escape();//2019-08-16
      console.log(req.params);

      MessagesIn.findByIdAndRemove(req.params.id, function deleteMessagesIn(err){
                 if(err){
                   console.log('@@@ $ error in deleting (fast) messagesIn: ' + err);
                   return next(err);
                 }
                console.log('@@@ $ redirecting to messagesIn for res: ' + res);
                res.redirect('/catalog/active_messages_list')
      });//ends findby etc..
  }; //ends export.messagesIn_delete_get
      //here was async.parallel({key1:func,key2:func},function(err,results))


// Handle messagesIn delete on POST.
exports.messagesIn_delete = function(req, res, next) {
  console.log('@@@ $ entering messagesIn_delete_post req.params below');
  sanitizeBody(req.params.id).trim().escape();//2019-08-16
  console.log(req.params);
  // client instances being deleted have no dependencies; just do it.
  MessagesIn.findByIdAndRemove(req.params.id, function deleteMessagesIn(err) {  //was Autthor....req.body.clientid, fn deletclient
      if (err) {
        console.log('delete_post err is: ' + err);
        return next(err);
      }
      // Success - go to messagesIns list
      res.redirect('/catalog/active_messages_list')
      return;
  })
  };

// Display messagesIn update form on GET.
exports.messagesIn_reply_get = function(req, res, next) {
  //console.log('@@@ $ messagesIn_update_get starts; req below');
  sanitizeBody(req.params.id).trim().escape();//2019-08-16
  // Get messagesIn, clients and genres for form.
  async.parallel({
      messagesIn: function(callback) {
          console.log('@@@ $ messagesIn async updt ');
          console.log('@@@ $ with req.params.id= ' + req.params.id);
          MessagesIn.findById(req.params.id).exec(callback);//.populate('client') removed
      },
      //clients: function(callback) {
          //console.log('@@@ $ messagesIn async updt clnt.find: get');
          //Client.find(callback);
        //},

      }, function(err, results) {
          if (err) {
            console.log('@@@ $ messagesIn get async updt err: ' + err);
            return next(err);
          }
          if (results.messagesIn==null) { // No results.
              console.log('@@@ $ messagesIn get async callback results == null ');
              var err = new Error('messagesIn not found');
              err.status = 404;
              return next(err);
          }

          console.log('@@@ $ messagesIn get reply_get findby Id value for URL: ');
          console.log('@@@ # URL: ',results.messagesIn.url)
          let message1 = "NOTE: Messages should contain only letters, punctuation, and " + "<br />"+
                       "numbers, any other characters will cause message to be ignored."
          //console.log('clients: ' + results.clients);
          //console.log('messagesIn: ' + results.messagesIn);
          res.render('messagesReply_update_form', { title: 'Reply Message',
                                                    messagesIn: results.messagesIn,
                                                    message1:message1});
      });

};

// Handle messagesIn update on POST.
  exports.messagesIn_reply_post = [
      // Validate fields.
      body('license_string').isLength({min: 10, max:80 }).trim().withMessage('Paste text from clipboard here'),
      body('name').isLength({max: 60}).trim().withMessage('surname,family name'),
      body('message').isLength({min:5, max:300}).trim().withMessage("Place message here"),
      //body('msgString').isAlphanumeric().withMessage('message can only have letters, punctuation, and numbers'),
      // Sanitize fields.
      body('reply').isLength({max:300}).trim().withMessage("post reply here"),
      body('viewed', 'True/False').isBoolean().withMessage("if you're reading this it's been viewed!"),
      body('responded', 'True/False').isBoolean().withMessage("true only if responded"),
      body('follow_up', 'True/False whether more req.').isBoolean().withMessage("True if further action req."),
      body('action', 'dscrptn of follow-on action').isLength({max:200}).withMessage("to be done"),

      sanitizeBody('license_string').trim().escape(),
      sanitizeBody('name').trim().escape(),
      sanitizeBody('msgString').trim().escape(),
      sanitizeBody('replyString').trim().escape(),
      sanitizeBody('viewed').trim().escape(),
      sanitizeBody('responded').trim().escape(),
      sanitizeBody('follow_up').trim().escape(),
      sanitizeBody('action').trim().escape(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);
          //2019-09-29  extra checks on license_string
          let checkString = checkValidIdString(req.body.license_string);//returns pass/fail

          if (!errors.isEmpty() || checkString == 'fail') {
              // There are errors. Render form again with sanitized values and error messages.
            let message1 = "NOTE: Messages can only contain letters, punctuation, and "  +
                           "numbers, any other characters will cause message to be ignored.";

            if(checkString == 'fail')message1 = 'REGISTRATION DATA INVALID, PLEASE CHECK AND RE-ENTER';
            console.log('@@@ $ rendering messagesIn_form for redisplay in msg_reply_post (validation err)');

            res.render('messagesReply_update_form', { title: 'Reply Msg Errors',
                                                      message1:message1,
                                                      errors: errors.array(),
                                                      messagesIn:req.body });
            return;
          }
          else {
              let moddedSysIdString = findModdedIdString(req.body.license_string);//mod:0001>>2019-10-30 added line
              req.body.license_string = moddedSysIdString;//mod:0001>>2019-10-30 added line

              console.log('@@@ $ updating messagesIn document');
              // Data from form is valid.
              MessagesIn.findByIdAndUpdate(req.params.id,req.body,{}, function (err,themessagesIn) {
                  if (err) {
                    console.log('@@@ $ updating messagesIn document throws err: ' + err);
                    return next(err);
                  }
                     //else Successful - redirect to new record.
                     //res.redirect('/catalog/messagesIn/' + ':' + req.body.url???? + '/detail');
                     res.redirect('/catalog/active_messages_list');//temporary
                  });
          }
      }
  ];
