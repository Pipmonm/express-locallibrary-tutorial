const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadPS_view = function(req, res) {
  console.log("specifics of PS downloads");
  let downloadPSDesc1 = "<pre style='color:yellow; background:green; width:660px'> \n" +
  "PieSlicerDual.exe application is restricted to the specific computer whose system ID and\n"+
  "Format Code has been used to obtain a license. (Key Code)  (cf below for USB version) \n"+
  "Therefore be sure to run the demo on the computer that is to be used by whomever is to  \n"+
  "be using the application.  \n "+
  "  \n"+
  "Clicking on the 'Registration' tab on the opening page of PieSlicer will display both the \n"+
  "System ID and a Format Code for registration purposes.  They are automatically placed in\n"+
  "your system's clipboard upon cancelling the message that displays them.  You will need  \n"+
  "this information for registering your application.   Use this site's \"REGISTER\" page \n"+
  "for registering the application.\n" +
  "  \n"+
  "The application may also be placed on a USB drive allowing use on any computer. \n" +
  "However the USB version does not provide a \"DEMO\" mode.  View the DEMO first on the CPU \n" +
  "based version, then move the PieSlicerDual.exe file to the USB.   Run it there and use the \n" +
  "same procedure as for the CPU version for registering the application.\n" +
  "The full USB version will not run until you enter its unique Key Code."
  " \n" +
  "    NOTE CAREFULLY: Some USB drives do not have a serial id and cannot be used.\n"+
  "                    Message 'UNKNOWN DRIVE' will alert you to this condition.\n"+
  "                    (most USB devices have an ID)"

  let downloadPSDesc2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = "pieSlicerDownld.js"; //this provides download href

res.render('downloadPS_view', { title: "PieSlicer Downloads",
                                 themeDesc1: downloadPSDesc1,
                                 themeDesc2: downloadPSDesc2});
};
