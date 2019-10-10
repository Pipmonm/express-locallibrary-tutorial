//client instance controller js
var Client = require('../models/client'); //collection will be known as 'clients'
var MessagesIn = require('../models/messagesIn');//as  'messagesIns'
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

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
  console.log('@@@ $ at messagesIn_list');
  MessagesIn.find({responded: /false/i}, 'message url', function (err, messages) {
      console.log("@@@ $ executing callback for messages 'follow' list; if err> : " + err );
      if (err) { return next(err); }
      console.log('@@@ $ found "follow" messages as per: ');
      console.log(messages);
      res.render('messages_list', { title: 'Active Messages List', messagesIn_list: messages });
    });

};

// Display detail page for a specific messagesIn.
exports.messagesIn_detail = function(req, res, next) {
      //console.log('@@@ $ entering client_request_detail');
      var id = req.params.id;
      console.log('@@@ $ looking for messagesIn with id: ' + id);

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
        console.log('@@@ $ rendering messagesIn_detail with messagesIn: ' + messagesIn);
        res.render('messagesIn_detail', { title: 'Messages: ', messagesIn:  messagesIn});
      })

  };

// Display messagesIn create form on GET.
exports.msgs_reply_create_get = function(req, res, next) {

      MessagesIn.find() //was {},'client'
      .exec(function (err, clients) {
        if (err) { return next(err); }
        // Successful, so render.
        let message1 = "NOTE: Messages can only contain letters, punctuation, and " + "<br />"+
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

           console.log('@@@ $ msg from id is: ' + rgrqcd + '  type: ' + typeof rgrqcd );
           req.body.msgString.replace("'","\'");//allow single quote
           console.log('@@@ $ message follows');
           console.log(req.body.msgString);
         }

         //var datedREply = "";//2019-10-03 added
        // Create a messagesIn object with escaped and trimmed data.
        var messagesIn = new MessagesIn( //.body. here is body of request which has many key fields
          {
            license_string: rgrqcd, //sysIdString
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
      console.log(req.params);

      messagesIn.findByIdAndRemove(req.params.id, function deleteMessagesIn(err){
                 if(err){
                   console.log('@@@ $ error in deleting (fast) messagesIn: ' + err);
                   return next(err);
                 }
                console.log('@@@ $ redirecting to messagesIns for res: ' + res);
                res.redirect('/catalog/messagesIns')
      });//ends findby etc..
  }; //ends export.messagesIn_delete_get
      //here was async.parallel({key1:func,key2:func},function(err,results))


// Handle messagesIn delete on POST.
exports.messagesIn_delete_post = function(req, res, next) {
  console.log('@@@ $ entering messagesIn_delete_post req.params below');
  console.log(req.params);
  // client instances being deleted have no dependencies; just do it.
  MessagesIn.findByIdAndRemove(req.params.id, function deleteMessagesIn(err) {  //was Autthor....req.body.clientid, fn deletclient
      if (err) {
        console.log('delete_post err is: ' + err);
        return next(err);
      }
      // Success - go to messagesIns list
      //res.redirect('/catalog/messagesIns')
      return;
  })
  };

// Display messagesIn update form on GET.
exports.messagesIn_reply_get = function(req, res, next) {
  //console.log('@@@ $ messagesIn_update_get starts; req below');
  //console.log(req);
  // Get messagesIn, clients and genres for form.
  Client = require('../models/client'); //for fun
  async.parallel({
      messagesIn: function(callback) {
          console.log('@@@ $ messagesIn async updt clrq.find + populate: get');
          console.log('@@@ $ with req.params.id= ' + req.params.id);
          MessagesIn.findById(req.params.id).populate('client').exec(callback);//.populate('client') removed
      },
      clients: function(callback) {
          console.log('@@@ $ messagesIn async updt clnt.find: get');
          Client.find(callback);
        },

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

          console.log('@@@ WOW messagesIn get update results: ');
          //console.log('clients: ' + results.clients);
          //console.log('messagesIn: ' + results.messagesIn);
          res.render('messagesInUpdate_form', { title: 'Update MessagesIn', clients:results.clients, messagesIn: results.messagesIn });
      });

};

// Handle messagesIn update on POST.
  exports.messagesIn_reply_post = [
      // Validate fields.
      body('client','required').isLength({min:1}).trim(),
      body('formatCode','required').isLength({min:4, max:10}).trim(),
      body('status', 'optional').isLength({ min: 1 }).trim(),
      body('date_entered', 'Request date').optional({ checkFalsy: true }).isISO8601(),

      // Sanitize fields.
      sanitizeBody('appname').trim().escape(),
      sanitizeBody('client').trim().escape(),
      sanitizeBody('formatCode').trim().escape(),
      sanitizeBody('status').trim().escape(),
      sanitizeBody('date_entered').toDate(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          // Create a messagesIn object with escaped and trimmed data and old id
          var messagesIn = new MessagesIn( //.body. here is body of request which has many key fields
            {
              license_string: req.body.appname,
              name: req.body.client,
              message: req.body.formatCode,
              status: req.body.status,
              date_entered: req.body.date_entered,
              _id:req.params.id //This is required, or a new ID will be assigned!
             });

          if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values and error messages.

              Client.find()
                  .exec(function (err, clients) {
                      if (err) {
                        console.log('@@@ $ clrq_update_post err> ' + err);
                        return next(err);
                      }
                      // Successful, so render.
                      console.log('@@@ $ rendering messagesIn_form for redisplay in clrq_update_post (validation err)');

                      res.render('messagesInUpdate_form', { title: 'Create MessagesIn', client_list : clients, selected_client : messagesIn.client._id , errors: errors.array(), messagesIn:messagesIn });
              });
              return;
          }
          else {
              console.log('@@@ $ updating messagesIn document');
              // Data from form is valid.
              MessagesIn.findByIdAndUpdate(req.params.id,messagesIn,{}, function (err,themessagesIn) {
                  if (err) {
                    console.log('@@@ $ updating messagesIn document throws err: ' + err);
                    return next(err);
                  }
                     //else Successful - redirect to new record.
                     res.redirect(messagesIn.url);
                  });
          }
      }
  ];
