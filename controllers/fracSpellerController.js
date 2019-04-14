//var PieSlicer = require('../models/pieSlicer');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM


//Display unique page details for PieSlicer
exports.fracSpeller_view = function(req, res) {
  console.log("trying for fracSpeller_view");
  let FracSpellerDesc1 = "<div style='position:relative; color:yellow;  background:green; padding:10px; align:center'>" +
                    "<p>" +
                    "FracSpeller is an interactive exerciser for helping practice proper spelling of " +
                    "numbers and fractions.<br />" +
                    "As a topic that is sometimes not given much attention it can only be beneficial for " +
                    "any student to develop confidence and expertise in the correct spelling of numbers as " +
                    "well as the general rules behind spelling fractions. <br />" +
                    "<br />" +
                    "Naturally, spelling of numbers is bound to the particular language in use.  For the " +
                    "present this module only concentrates on North American English (though other languages " +
                    "may be introduced in later versions). <br />" +
                    "<br />" +
                    "FracSpeller exerciser: <br />" +
                    "<UL style='list-style-type:square; color:yellow;  background:green';>"+
                    "  <li> generates problems randomly </li>" +
                    "  <li> students' answers are verified immediately </li>" +
                    "  <li> poses problems for converting written form to numeric form (eg  five halves >> 5/2) " +
                    "and converting numerical form to written form   (eg 3/27 >> three twenty-sevenths) </li>" +
                    "  <li> a dedicated help window is available for questions about the application itself or " +
                    "concerning the topic under study.</li>" +
                    "</ul>" +
                    "<br /><br />" +
                    "Download the Demo version to find out more ( no obligations ).<br />" +
                    "The demo will be functional for a limited time only.<br />" +
                    "The option of buying the license to convert the demo to the unlimited version is " +
                    "presented at this site\'s HOME page. (and all for the price of a hamburger!!! ;)<br />"  +
                    "<br />" +
                    "<strong>NOTE CAREFULLY:</strong> <br />" +
                    "  Fraction Speller is a Windows executable (.exe) meant for Windows operating systems only.<br />" +
                    "  A browser based version is in development that will allow use on any computer. Stay tuned.</p></div>"

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
