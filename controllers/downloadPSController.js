const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadPS_view = function(req, res) {
  console.log("specifics of PS downloads");
  let downloadPSDesc1 = "<pre style='color:yellow; background:green; width:660px'> \n" +
  "PieSlicerDual.exe application is restricted to the specific computer (Windows based only)  \n"+
  "whose system ID and Format Code have been used to obtain a license. (Key Code)  \n"+
  "Therefore be sure to run the demo on the computer that is to be used by whomever is to  \n"+
  "be using the application.  (cf below for USB version) \n "+
  "  \n"+
  "The 'Registration' tab on the opening page of FracSpeller will display both the System ID \n"+
  "and a Format Code required for registration purposes.  They are automatically placed \n"+
  "in your system's clipboard upon cancelling the message that displays them.  \n"+
  "Paste this information in the indicated space when using this site's \"PURCHASE FORM\" page \n"+
  "as the first step in obtaining a fully functional registered copy.\n" +
  "  \n"+
  "USB Version: \n" +
  "The application may also be placed on a USB drive allowing use on any computer. \n" +
  "However the USB version does not provide a \"DEMO\" mode.  View the DEMO first on a CPU or \n" +
  "Notebook, (running WINDOWS only) then, if you prefer a USB based version, move the .exe file to\n" +
  "a USB.  Run it there and use the same procedure as described above to register the application.\n" +
  "The complete USB version will only run when you enter its unique Key Code. \n" +
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
