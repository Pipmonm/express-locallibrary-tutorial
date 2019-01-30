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
  "You may download the demo by simply clicking on the \"Download Demo\" button at the \n"+
  "bottom of this page and running the demo from your desktop after verifying the download.\n"+
  "\n"+
  "Verifying the downloaded file before running it is recommended to ensure the file's\n"+
  "authenticity and integrity.   Using Window's PowerShell utility you can easily compare \n"+
  "the file's SHA-256 hash code (given below) with the one generated for the downloaded\n"+
  "file as explained on this site's VERIFICATION menu item.\n"+
  "\n"+
  "Running the demo:\n"+
  "After verifying it run the program from your desktop by double-cliking on it.\n"+
  "\n" +
  "FracSpellerDual.exe (vrs. 1.0.0.1)  file Verification code:\n" +
  "SHA-256 Hash Code:   1B20803DDADB9C958AE23D97D6BDFC7EFCFB07C4B20594B947BD61F832D0CB0B \n" +
  "(copy & use this code when following instructions given in \"VERIFICATION\" menu item.)"

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
