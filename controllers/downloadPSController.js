const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadPS_view = function(req, res) {

  let downloadPSDesc1 = "<div style='position:relative; color:yellow;  background:green; padding:10px; align:center'>" +
  "<p>" +
  "Dowloading PieSlicerDual Demo:<br />"+
  "Download the demo by clicking on the \"Download Demo\" button shown below.  Placing it\n"+
  "on your desktop will make it easy to \"verify the download\" as described next.<br />"+
  "<br />"+
  "Verifying the file before running it is recommended to ensure its authenticity and\n"+
  "integrity.  Use Window's PowerShell utility to compare the file's SHA-256 hash code\n"+
  "(shown below) against the one generated for the downloaded file.<br />"+
  " Click on \"VERIFY DOWNLOAD\" button below for complete instructions. <br />"+
  "<br />"+
  "Running the demo:<br />"+
  " Once verified run the program from your desktop by double-cliking on it.  While in demo mode"+
  " it is recommended that you follow the 'quick tour' instructions as described at startup.<br />"+
  "<br />"+
  "PieSlicerDual.exe (vrs. 1.0.0.3)  file SHA-256 Verification code:<br />" +
  "F889CC16B94F51D2A29726773175172D772C9000C168D7B8247552D6F6D239AA<br />" +
  "(copy & use this code in the \"VERIFICATION\" steps after downloading the demo file.),</p></div>"

  let blurb = "USB Version: \n" +
  "The application may also be placed on a USB drive allowing use on any computer. \n" +
  "The USB version does not offer a \"DEMO\" mode.  View the DEMO first on a CPU or Notebook, \n" +
  "(WINDOWS only) then if you prefer a USB version, move the .exe file to a USB.\n" +
  "Run it there and follow the same procedure as described above to register the application.\n" +
  "The USB version will not run until you enter its unique Key Code. \n" +
  " \n" +
  "    NOTE CAREFULLY: Some USB drives do not have a serial id and cannot be used.\n"+
  "                    Message 'UNKNOWN DRIVE' will alert you to this condition.\n"+
  "                    (most USB devices have an ID)"

  let downloadPSDesc2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = '/catalog/get_S3_PS'; //this provides download href

res.render('downloadPS_view', { title: "PieSlicer Downloads",
                                 themeDesc1: downloadPSDesc1,
                                 themeDesc2: downloadPSDesc2,
                                 source:source});
};
