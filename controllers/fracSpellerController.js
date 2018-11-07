//var PieSlicer = require('../models/pieSlicer');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM


//Display unique page details for PieSlicer
exports.fracSpeller_view = function(req, res) {
  console.log("trying for fracSpeller_view");
  let FracSpellerDesc1 = "<pre style='color:yellow; background:green; width:650px'> \n" +
                    "FracSpeller is an interactive exerciser for helping practice proper spelling of \n" +
                    "numbers and fractions.  \n" +
                    "As a topic that is sometimes not given much attention it can only be beneficial for \n" +
                    "any student to develop confidence and expertise in the correct spelling of numbers as \n" +
                    "well as the general rules behind spelling fractions. \n" +
                    "\n" +
                    "Naturally, spelling of numbers is bound to the particular language in use.  For the \n" +
                    "present this module only concentrates on North American English (though other languages \n" +
                    " may be introduced in later versions). \n" +
                    "\n" +
                    "This exerciser: \n" +
                    "  - generates problems randomly \n" +
                    "  - students' answers are verified immediately \n" +
                    "  - poses problems for converting written form to numeric form (eg  five halves >> 5/2)\n" +
                    "    and converting numerical form to written form   (eg 3/27 >> three twenty-sevenths) \n" +
                    "  - a dedicated help window is available for questions about the application itself or \n" +
                    "    concerning the topic under study."
                    "\n" +
                    "Download the Demo version ( no obligations ) to find out more.\n" +
                    "The demo will be functional for a limited time only.\n" +
                    "The option of buying the license to convert the demo to the unlimited version is \n" +
                    "presented on startup. (and all for the price of a hot dog!!! ;)\n"  +
                    " \n" +
                    "<strong>NOTE CAREFULLY:</strong> \n" +
                    "  Fraction Speller is a Windows executable (.exe) meant for Windows operating systems only. \n" +
                    "  A browser based version is in development that will allow use on any computer. Stay tuned.</pre>"

  //let FracSpellerDesc2 =   `<a href='/fracSpellerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;
  let h3Header = "Fraction Speller Module"
  let FracSpellerDesc2 = "for download information click on"
  let source =   '/catalog/downloadFS_view';
  let source2 = "DOWNLOADING DEMOS";//temporary


res.render('fracSpeller_view', { title: "Mastering Math Topic",
                                 h3Header: h3Header,
                                 fracSpellerDesc1: FracSpellerDesc1,
                                 fracSpellerDesc2: FracSpellerDesc2,
                                 source: source,
                                 source2: source2});
};
