const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadFS_view = function(req, res) {
  console.log("specifics of FS downloads");
  let downloadFSDesc1 = "<pre style='color:yellow; background:green; width:660px'> \n" +
  "FracSpellerDual.exe application is restricted to the specific computer whose system ID \n"+
  "and Format Code has been used to obtain a license. (Key Code)  (cf below for USB version) \n"+
  "Therefore be sure to run the demo on the computer that is to be used by whomever is to  \n"+
  "be using the application.  \n "+
  "  \n"+
  "The 'Registration' tab on the opening page of FracSpeller will display both the System ID \n"+
  "and a Format Code required for registration purposes.  They are automatically placed \n"+
  "in your system's clipboard upon cancelling the message that displays them.  \n"+
  "Pate this information in the indicated space when using this site's \"REGISTER\" page \n"+
  "for registering the application.\n" +
  "  \n"+
  "USB Version: \n" +
  "The application may also be placed on a USB drive allowing use on any computer. \n" +
  "However the USB version does not provide a \"DEMO\" mode.  View the DEMO first on a CPU or \n" +
  "Notebook, (running WINDOWS only) then if you prefer a USB based application move exe fileto a\n " +
  "USB.  Run it there and use the same procedure as described above to register the application.\n" +
  "The full USB version will not run until you enter its unique Key Code."
  " \n" +
  "    NOTE CAREFULLY: Some USB drives do not have a serial id and cannot be used.\n"+
  "                    Message 'UNKNOWN DRIVE' will alert you to this condition.\n"+
  "                    (most USB devices have an ID)"

  let downloadFSDesc2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = "fracSpellerDwnld.js"; //this provides download href

res.render('downloadFS_view', { title: "FracSpeller Downloads",
                                 themeDesc1: downloadFSDesc1,
                                 themeDesc2: downloadFSDesc2});
};
