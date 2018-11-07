const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadFS_view = function(req, res) {
  console.log("specifics of FS downloads");
  let downloadFSDesc1 = "<pre style='color:yellow; background:green; width:650px'> \n"+
  "FracSpellerDual.exe application is restricted to the specific computer whose system ID and Format\n"+
  "Code has been used to obtain a license. (Key Code)   \n"+
  "Therefore be sure to run the demo on the computer that is to be used by whomever is to be using \n"+
  "the application.  \n "+
  "  \n"+
  "Clicking on the 'Registration' tab on the opening screen of FracSpeller gives Copyright information and \n"+
  "provides both a System ID and a Format Code for registration purposes.  They are automatically placed in\n"+
  "your system clipboard upon cancelling the alert message that comes up.  You will need this information\n"+
  "for registering your application.   Use this site's \"REGISTER\" page for registering the application.\n"+
  "  \n"+
  "The application may also be placed on a USB drive allowing use on any computer.  \n"+
  "However the USB version does not provide a DEMO.   Therefore an unlicensed USB version will only \n"+
  "display the opening screen (same as CPU version) so that you may access the \"REGISTRATION\" tab to\n" +
  "retrieve the USB_ID and Format Code required to get the license Key for the USB.  Use this data in the\n"+
  "same way as described for the CPU version.  (The first run on a USB may give 'Disk error' messages.\n"+
  "Simply disregard these and keep going.  All subsequent uses will be disk error free.)\n"+
  "So run the CPU version to 'demo' the application, then if you prefer to keep it on a USB, move\n"+
  "the FracSpellerDual.exe file to your USB drive.  Run it from there and follow the procedure as explained \n"+
  "above for the CPU version.  The full USB version will not run until you enter its unique Key Code."
  " \n" +
  "    NOTE CAREFULLY: Some USB drives do not have a serial id and cannot be used.\n"+
  "                    Message 'UNKNOWN DRIVE' will alert you to this condition.\n"+
  "                    (most USB drives have an ID)"

  let downloadFSDesc2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = "fracSpellerDwnld.js"; //this provides download href

res.render('downloadFS_view', { title: "FracSpeller Downloads",
                                 themeDesc1: downloadFSDesc1,
                                 themeDesc2: downloadFSDesc2});
};
