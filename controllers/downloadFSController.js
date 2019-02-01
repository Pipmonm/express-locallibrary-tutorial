const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadFS_view = function(req, res) {
  console.log("specifics of FS downloads");
  let downloadFSDesc1 = "<pre style='color:yellow; background:green; width:660px'> \n" +
  "Dowloading FracSpellerDual Demo:  \n"+
  "Download the demo by clicking on the \"Download Demo\" button shown below.  Placing it\n"+
  "on your desktop will make it easy to \"verify the download\" as described next.\n"+
  "\n"+
  "Verifying the file before running it is recommended to ensure its authenticity and\n"+
  "integrity.  Use Window's PowerShell utility to compare the file's SHA-256 hash code\n"+
  "(shown below) against the one generated for the downloaded file. (follow the detailed\n"+
  " intructions in the \"VERIFICATION\" page on this site)\n"+
  "\n"+
  "\n"+
  "Running the demo:\n"+
  "After verifying it run the program from your desktop by double-cliking on it.\n"+
  "\n" +
  "FracSpellerDual.exe (vrs. 1.0.0.1)  file Verification code:\n" +
  "SHA-256 Hash Code:   FEB16DA5A5885D87ACD7A9E0FA211DEBF96ADEB3820B0ECC38F85417D2B9BD56 \n" +
  "(copy & use this code in the \"VERIFICATION\" steps after downloading the demo file.)"

  let extra = "USB Version: \n" +
  "The application may also be placed on a USB drive allowing use on any computer. \n" +
  "The USB version does not offer a \"DEMO\" mode.  View the DEMO first on a CPU or Notebook, \n" +
  "(WINDOWS only) then if you prefer a USB version, move the .exe file to a USB.\n" +
  "Run it there and follow the same procedure as described above to register the application.\n" +
  "The USB version will not run until you enter its unique Key Code. \n" +
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
