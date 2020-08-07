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
      //2020-04-24 sproblems chosen strictly to keep in batch of specificproblem views
      //ibid  only occurs here and as filename for pug file
   //for(item in problems)Problem.findByIdAndRemove(item.)

      res.render('sproblems_list', { title: 'Problems List', problems_list: problems });
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
      debugger;
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
         var source="http://www.youtube.com/watch?v=A-iTEtt6SN8"
        // Successful, so render.
        console.log('@@@ 79 $ rendering specificproblem_detail with specificproblem: ' + specificproblem);
        res.render('specificproblem_detail', { title: 'Specific Problem Detail: ',
                                                 source:source,
                                                 specificproblem:  specificproblem});
      })

  };
exports.imagefile_get = function(req, res, next) {
  const path = require("path");
    //const home = (req, res) => {
  //  return res.sendFile(path.join(`${__dirname}/../views/index.html`));
//};
  res.render('image_preView',{});
//module.exports = {
  //getHome: home
//};
}//imagefile_get ends

exports.imagefile_post = function(req,res,next) {

  for(var item of req)console.log("@@@ ### local: from SUBMIT req values: ",req.item);

  const upload = require("../middleware/upload");
  console.log("@@@  !!! local: into imagefile_post");
  debugger;
  //const upload = require("../middleware/upload"),
  //mod form since we are not routing through uploadFile.
  //const uploadFile = async (req, res) => {
  async function storeImage(req,res) {

    try {
      console.log("@@@ $$$ local: in async about to try await upload");
      await upload(req, res);

      for(var item of req)console.log("@@@ ### local: post middleware req values: ",req.item);

      console.log(req.file);
      if (req.file == undefined) {
        return res.send(`You must select a file.`);
      }

      return res.send(`File has been uploaded.`);
    } catch (error) {
      console.log(error);
      return res.send(`Error when trying upload image: ${error}`);
    }
  console.log("@@@ $ will exit successfuly if no error follows");
  if (err) { return next(err); }
  }
}//end of imagefile_post


// Display problem create form on GET.
exports.specificproblem_create_get = function(req, res, next) {

  var gradeOptions = ['Focus-9',
                        'MathWorks 10',
                        'MathWorks 11',
                        'Mathworks 12',
                        'PreCalcus 12',
                        'other'];

        //temporary replacement of specificproblem_form for testing img loading
        res.render('specificproblem_form', {title: 'Create Specific Problem',
                                            gradeOptions:gradeOptions});
  };


// Handle specificproblem create on POST.
exports.specificproblem_create_post = [
    // Validate fields.
    body('grade', 'choose grade level from dropdown list').isLength({ max: 12 }).trim(),
    body('other', 'give other source ').isLength({max:15}).trim(),
    body('pageNumber', 'page number where problem first appears').isLength({max:4}).trim(),//isNumeric({no_symbols: true}),
    body('problemNumber', 'problem number: no ")" or "-" ').isLength({max:3}).trim(),//isNumeric({no_symbols: true}),
    body('subSection', 'give sub-problem: "a or b or c etc." or roman numeral').isLength({max:3}).trim(),
    body('problemAnswer', 'text value for answer').isLength({max:200}).trim(),
    body('problemHint','optinal hint').isLength({max:200}).trim(),
    body('problemExample','example optional').isLength({max:200}).trim(),

    // Sanitize fields.
    sanitizeBody('grade').trim().escape(),
    sanitizeBody('other').trim().escape(),
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
        var gradeOptions = ['Focus-9',
                              'MathWorks 10',
                              'MathWorks 11',
                              'Mathworks 12',
                              'PreCalcus 12',
                              'other'];

        if (!errors.isEmpty()) {
            console.log('@@@ $ Console: errors spotted in validationResult for "specificproblem_create_post"',errors);
            debug('DEBUG: errors spotted in validationResult for "specificproblem_create_post"');
            // There are errors. Render form again with sanitized values/errors messages.
            //res.render('specificproblemErr_form', { title: 'Create Specific Problem', specificproblem: req.body,allowedProxy:allowedProxy,stringDate:stringDate, errors: errors.array() });
            res.render('specificproblemErr_form', { title: 'Create Problem Error',
                                                    specificproblem: req.body,
                                                    gradeOptions:gradeOptions,
                                                    errors: errors.array()});//2019-06-12
            return;
          }
        var otherSrcFlag = req.body.grade;
        var keyCode;
        var moddedSubsection = req.body.subSection;
        if(moddedSubsection == "" || moddedSubsection == undefined){
          moddedSubsection = "noSecs";//for no subsections
        }else{moddedSubsection = req.body.subSection.toString();}
        if(otherSrcFlag != 'other'){
           keyCode = req.body.grade + req.body.pageNumber.toString() + req.body.problemNumber.toString() + moddedSubsection;
        }else{
           if(req.body.other !== undefined && req.body.other.length>5){
                keyCode = req.body.other.toString();
              }else{
                console.log("Improperly formed expression for 'Other'");
                res.render('specificproblem_form', { title: 'If you choose grade "other" you must fill tab "Other" with a name >5 chars.  ',
                                                        gradeOptions:gradeOptions});//2019-06-12
                return -1;
              }}
        // Create a specificproblem object with escaped and trimmed data.
        var specificproblem = new Problem( //.body. here is body of request which has many key fields
          {
            keyCode: keyCode,
            grade: req.body.grade,
            other: req.body.other,
            pageNumber: req.body.pageNumber,
            problemNumber: req.body.problemNumber,
            subSection: req.body.subSection,
            answer: req.body.problemAnswer,
            hint: req.body.problemHint,
            example: req.body.problemExample

           });


          // Data from form is valid.
          specificproblem.save(function (err) {
            if (err) {
              console.log("@@@ $ saving new problem gives err: ",err);
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

      Problem.findById(req.params.id, function(err, results){
                 if(err){
                   console.log('@@@ $ error in finding specificproblem: ' + err);
                   return next(err);
                 }
                console.log("@@@ $$% attempting to delete results: ",results, " & _id: ",results._id);
                res.render('specificproblem_delete',{title:'Delete Problem', problem:results})
      });//ends findby etc..
  }; //ends export.specificproblem_delete_get
      //here was async.parallel({key1:func,key2:func},function(err,results))


// Handle specificproblem delete on POST.
exports.specificproblem_delete_post = function(req, res, next) {
  console.log('@@@ $ entering specificproblem_delete_post req.params below');
  console.log("@@@ $ req.body.problemid is: ", req.body.problemid);
  // client instances being deleted have no dependencies; just do it.
  Problem.findByIdAndRemove(req.body.problemid, function deleteproblem(err) {  //was Autthor....req.body.clientid, fn deletclient
      if (err) {
        console.log('delete_post err is: ' + err);
        return next(err);
      }
      // Success - go to specificproblems list
      //res.redirect('/catalog/specificproblems')
      res.redirect('/catalog/problems/list');
  })
  };

//adding missing specificproblem_update_get
// Display specificproblem update form on GET.
exports.specificproblem_update_get = function(req, res, next) {
  console.log("@@@ $ sanitizing body in specificproblemUpdate with req.params.id = ",req.params.id);
      //req.params.sanitize('id').escape().trim();
      sanitizeBody(req.params.id).trim().escape();
      console.log("@@@ $ passed sanitizeBody for id: & id is: " + req.params.id);
      async.parallel({
       specificproblem: function(callback) {
        Problem.findById(req.params.id).exec(callback)
        }, //only one function called asynchronously. ending comma allowed to simplify chaining a possible next one
       }, function(err, results) {   //note leading "}" closes async's opening "{"
        console.log("@@@ $ in specificproblem.findById callback")
        if(err) {
         console.log("@@@ $ error in specificproblem.findById callback ",err);
         debug('update error ' + err);
         return next(err);
         }

       console.log("@@@ $ render specificproblem update form next:  using results???  vv");
       console.log(results);
       //let transactPeriod = req.body.transaction_date.toJSON();
       //console.log("@@@ $ transPeriod & type: ",transactPeriod,"   & type: ",typeof transactPeriod);
       //transactPeriod = transactPeriod.split("T")[0]//suddenly need to remove .toISOString() ???
       var gradeOptions = ['Focus-9',
                             'MathWorks 10',
                             'MathWorks 11',
                             'Mathworks 12',
                             'PreCalcus 12',
                             'other'];                                             //take only yyyy-mm-dd portion

       res.render('specificproblemErr_form', { title: 'Update Problem',
                                           specificproblem: results.specificproblem,
                                           gradeOptions:gradeOptions});//2019-06-12
       //res.render('specificproblemUpdate_form', { title: 'Update problem', specificproblem: results.client, query: "Update"});
  });//async ends note closing } is not for async's opening "{", that's closed above, this one closes  fn(err,rslts){
}; //export fn ends  NOTE this is a request to update with changes, only accepted if posted (as follows)



  // Handle specificproblem update on POST.
    exports.specificproblem_update_post = [
      // Validate fields.

      body('problemAnswer', 'text value for answer').isLength({max:200}).trim(),
      body('problemHint','optional hint').isLength({max:200}).trim(),
      body('problemExample','example optional').isLength({max:200}).trim(),


      sanitizeBody('problemAnswer').trim().escape(),
      sanitizeBody('problemHint').trim().escape(),
      sanitizeBody('problemExample').trim().escape(),

      //sanitizeBody('for_transaction_period').toDate(),

        // Process request after validation and sanitization.
        (req, res, next) => {

            // Extract the validation errors from a request.
            const errors = validationResult(req);
            if(req != undefined)console.log("@@@ $ req is: ",req,"  of type: ",typeof req);
            console.log("@@@ $ req.body: below vvvv");
            console.log("@@@ $ ",req.body);
            var transferValues = {answer:req.body.problemAnswer,hint:req.body.problemHint,example:req.body.problemExample};
            console.log("@@@ or from params: ");
            if(req.params!=undefined)console.log(req.params);

            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values and error messages.

                console.log("@@@ $ update errors: ",errors);//2019-08-14
                console.log('@@@ $ rendering specificproblem_form for redisplay in specificproblem_update_post (validation err)');
                //res.render('specificproblemErr_form', { title: 'Update Specific Problem', specificproblem: req.body,allowedProxy:allowedProxy,stringDate:stringDate, errors: errors.array() });
                var gradeOptions = ['Focus-9',
                                      'MathWorks 10',
                                      'MathWorks 11',
                                      'Mathworks 12',
                                      'PreCalcus 12',
                                      'other'];

                res.render('specificproblemErr_form', { title: 'New Error in Problem',
                                                    specificproblem: req.body,
                                                    gradeOptions: gradeOptions});//2019-06-12

                return;

            } else {
                console.log('@@@ $ updating specificproblem document & req.params.id is: ' + req.params.id);
                console.log('### % with req.body as: ',transferValues);

                // Data from form is valid.
                //Problem.findByIdAndUpdate(req.params.id,req.body,{}, function (err,thespecificproblem) { //2019-06-10  was "thespecificproblem"
                //first find original so as to get immutable parts
                //function getOriginalProblem(req.body)

                async function getOriginalAsync(){

                 const originalProb = await Problem.findById(req.params.id,function(err,originalproblem){
                  console.log("@@@ $$$ checking in asynce if transferValues crosses over: > ",transferValues);
                  console.log("@@@ $ in async getOriginalAsync originalproblem is: ",originalproblem,"  params.id is: ", req.params.id);
                  if(err) {
                    console.log("@@@ $ error finding originalproblem to restore immutable parts ",originalproblem);
                    return next(err);
                  }
                  return originalproblem; // place after restoring immutable parts
                 });

                  //var originalProblem = getOriginalAsync(); //call from outside of async

                const step2 = await modify(originalProb,transferValues);


                //garnered from stackoverflow 40466323
                const something = await  Problem.update({_id:req.params.id},step2,{ new: true }, function (err,updatedproblem) {
                    //can now update atomic
                    console.log("@@@  ### updating params.id: ",req.params.id, "  with step2: ", step2);
                    if (err) {
                      console.log('@@@ $ updatedproblem document throws err: ' + err);
                      return next(err);
                    }
                    //else Successful - redirect to new record.
                    console.log('@@@ $ redirecting to: ',updatedproblem);
                    res.redirect('/catalog/problems/list'); //should be updatedproblem.url???
                    //res.redirect('/catalog/specificproblem/'+ req.params.id); //maybe


                    })//closes findbyidandupdate
                   return 0;//success
                  }//closes async function

            var modify = (originalProb,transferValues) => {
              console.log("@@@ $ restoring immutable parts in newDoc using transferValues: ",transferValues, "  & oriProblem: ", originalProb);
              const newDoc = {
                 _id:originalProb._id,
                 keyCode:originalProb.keyCode,
                 other:originalProb.other,
                 grade:originalProb.grade,
                 pageNumber:originalProb.pageNumber,
                 problemNumber:originalProb.problemNumber,
                 subSection:originalProb.subSection,
                 answer:transferValues.answer,
                 hint:transferValues.hint,
                 example:transferValues.example,
               }
              console.log("@@@ >>>> restored req.body is: ",newDoc);
              return newDoc;
            }; //async doesn't seem to accept fat arrow functions

            var originalProblem = getOriginalAsync(); //get async to do all the work
            }//closes else clause
        }//closes fat arrow req,res,next
      ]
