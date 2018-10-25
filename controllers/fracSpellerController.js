//var PieSlicer = require('../models/pieSlicer');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM


//Display unique page details for PieSlicer
exports.fracSpeller_view = function(req, res) {
  console.log("trying for fracSpeller_view");
  let FracSpellerDesc1 = "<pre style='color:yellow; background:green; width:650px'>Fraction Speller is an interactive exerciser for helping \n" +
                    "practice proper spelling of numbers and fractions.  \n" +
                    "As a topic that is sometimes not given much attention it can only be beneficial for \n" +
                    "any student to develop confidence and expertise in the correct spelling of numbers and \n" +
                    "the general rules behind spelling fractions also. \n" +
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
                    "\n" +
                    "It is advised to run the CPU version to 'demo' the application.  After if you prefer \n" +
                    "to get the USB version, simply delete the CPU demo file and download the USB version. \n" +
                    " \n" +
                    "<strong>NOTE CAREFULLY:</strong> \n" +
                    "  Fraction Speller is a Windows executable (.exe) meant for Windows operating systems only.</pre>"

  //let FracSpellerDesc2 =   `<a href='/fracSpellerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;
  let h2Header = "Fraction Speller Module"
  let FracSpellerDesc2 = "for download information click on"
  let source =   '/catalog/downloadFS_view';
  let source2 = "DOWNLOADING DEMOS";//temporary


res.render('fracSpeller_view', { title: "",
                                 h2Header: h2Header,
                                 fracSpellerDesc1: FracSpellerDesc1,
                                 fracSpellerDesc2: FracSpellerDesc2,
                                 source: source,
                                 source2: source2});
};
