const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM
exports.getObjects = function (req, res) {
    var item = req.body;
    var params = { Bucket: req.params.bucketName, Key: 'keyname'}; // keyname can be a filename
    s3.getObject(params, function (err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        res.send({ data });
    });
}

//Display unique page details for PieSlicer
exports.pieSlicer_view = function(req, res) {
  console.log("trying for pieSlicerView");
  let PieSlicerDesc1 = "<div style='position:relative; color:yellow;  background:green; padding:10px; align:center'>" +
                    "<p>" +
                    "PieSlicer is an interactive visual aid application designed to help students\n"+
                    "fully understand the math operations of fraction addition/subtraction.<br />\n"+
                    "By easily manipulating pie pieces representing any fraction students are\n"+
                    "very often able to discover on their own the solutions and the central\n"+
                    "concepts for the addition and subtraction of positive or negative fractions.\n"+
                    "<br /><br />"+
                    "As shown on the screenshot above Pie Slicer will:<br />"+
                    "<UL style='list-style-type:square; color:yellow;  background:green';>"+
                    "  <li> easily let you enter problems of your own choice when in 'user_mode'</li>"+
                    "  <li> allow for generating problems with any denominator using 'wild-card' button</li>"+
                    "  <li> generate random problems automatically in 3 different level modes</li>"+
                    "  <li> update the visual representation automatically for correct answers</li>"+
                    "  <li> track users performance at each level</li>"+
                    "  <li> provide a dedicated help window for questions about the application "+
                    "itself or concerning the topic under study.</li>"+
                    "</ul>" +
                    "<br />" +
                    "Watch our video an PieSlicer's more advanced features: "+
                    "<a <style>{ color: #FF0000; } </style>  href='https://drive.google.com/open?id=1c-2o6268KGJALIXX28_TnIs4j8Ff78Cl' target='_blank'>..HERE..</a><br />"+
                    "Download the Demo version and experiment with it ( no obligations ).<br />"+
                    "The demo will be functional for a limited time only.<br />" +
                    "Buying the license to convert the demo to the unlimited version is detailed"+
                    " in the \"Registration Data\" page accessible on each module's startup page.<br /><br />"  +
                    "<strong>NOTE CAREFULLY:</strong><br />" +
                    "  PieSlicer is a Windows executable (.exe) meant for Windows operating systems only." +
                    "  A browser based version is in development that will run on any computer.</p></div>"

  let h3Header = "About PieSlicer Module"
  let PieSlicerDesc2 = "for download information click on"
  let source = '/catalog/downloadPS_view';
  let source2 = "DOWNLOADING DEMOS";//temporary
res.render('pieSlicer_view', { title: "Mastering Math Topic",
                                 h3Header: h3Header,
                                 pieSlicerDesc1: PieSlicerDesc1,
                                 pieSlicerDesc2: PieSlicerDesc2,
                                 source: source,
                                 source2: source2});
};
