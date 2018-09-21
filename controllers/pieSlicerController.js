const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM


//Display unique page details for PieSlicer
exports.pieSlicer_detail = function(req, res) {
  console.log("trying for pieSlicerDetails");
  let PieSlicerDesc1 = "<pre style='color:yellow; background:green'>Pie Slicer is an interactive visual aid application to help students visualize \n" +
                    "and fully understand the math operations of fraction addition/subtraction.  \n" +
                    "Students are able to easily manipulate pie pieces representing any fraction \n" +
                    "problem and discover on their own the solutions and the central concepts behind \n " +
                    "fraction addition and subtraction. \n" +
                    "\n" +
                    "As an exerciser, it fulfills one of the most important requirements in ensuring  \n" +
                    "optimal retention and improvement of any new skill while using strong visual impact.\n" +
                    "  - problems are generated randomly for different levels  \n" +
                    "  - students' answers are verified immediately \n" +
                    "  - the visual representation is updated automatically for correct answers \n" +
                    "  - tracks users performance at each level \n" +
                    "  - a dedicated help window is available for questions about the application itself or \n" +
                    "    concerning the topic under study."
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
