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
  let PieSlicerDesc1 = "<pre style='position:relative; left:50px; color:yellow;  background:green; width:650px; padding:10px; align:center'> \n" +
                    "PieSlicer is an interactive visual aid application designed to help students  \n" +
                    "fully understand the math operations of fraction addition/subtraction.  \n" +
                    "By easily manipulating pie pieces representing any fraction students are  \n" +
                    "very often able to discover on their own the solutions and the central  \n" +
                    "concepts for the addition and subtraction of positive or negative fractions. \n" +
                    "\n" +
                    "As shown on the screenshot above Pie Slicer will:  \n" +
                    "  - easily let you enter problems of your choice when in 'user_mode' \n" +
                    "  - allow 'user_mode' to generate fraction problems using any denominator \n" +
                    "  - generate random problems automatically in 3 different level modes  \n" +
                    "  - update the visual representation automatically for correct answers \n" +
                    "  - track users performance at each level \n" +
                    "  - provide a dedicated help window for questions about the application  \n" +
                    "    itself or concerning the topic under study."
                    "\n" +
                    "Download the Demo version ( no obligations ) to experiment with it.\n" +
                    "The demo will be functional for a limited time only.\n" +
                    "Buying the license to convert the demo to the unlimited version is detailed\n" +
                    "on this website\'s HOME page.\n"  +
                    " \n" +
                    "<strong>NOTE CAREFULLY:</strong> \n" +
                    "  PieSlicer is a Windows executable (.exe) meant for Windows operating systems only.\n" +
                    "  A browser based version is in development that will run on any computer.</pre>"

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
