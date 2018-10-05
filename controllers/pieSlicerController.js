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
exports.pieSlicer_detail = function(req, res) {
  console.log("trying for pieSlicerDetails");
  let PieSlicerDesc1 = "<pre style='color:yellow; background:green'>Pie Slicer is an interactive visual aid application to help students  \n" +
                    "fully understand the math operations of fraction addition/subtraction.  \n" +
                    "By easily manipulating pie pieces representing any fraction students are  \n" +
                    "very often able to discover on their own the solutions and the central concepts \n " +
                    "relating to fraction addition and subtraction. \n" +
                    "\n" +
                    "As can be noted on the screenshot of the application shown above   \n" +
                    "Pie Slicer will: \n" +
                    "  - generate problems randomly for different levels  \n" +
                    "  - verify student answers immediately \n" +
                    "  - update the visual representation automatically for correct answers \n" +
                    "  - track users performance at each level \n" +
                    "  - provide a dedicated help window for questions about the  \n" +
                    "    application itself or concerning the topic under study."
                    "\n" +
                    "Download the Demo version ( no obligations ) to find out more.\n" +
                    "The demo will be functional for a limited time only.\n" +
                    "The option of buying the license to convert the demo to the unlimited version is \n" +
                    "presented on startup. (and all for the price of a hamburger!!! ;)\n"  +
                    " \n" +
                    "<strong>NOTE CAREFULLY:</strong> \n" +
                    "  PieSlicer is a Windows executable (.exe) meant for Windows operating systems only.</pre>"

  let PieSlicerDesc2 =   `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

res.render('pieSlicer_detail', { title: "",
                                 pieSlicerDesc1: PieSlicerDesc1,
                                 pieSlicerDesc2: PieSlicerDesc2});
};
