const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadFS_view = function(req, res) {
  let downloadFSDesc1 = "<div style='position:relative; color:yellow;  background:green; padding:10px; width:80%; align:center'>" +
  "<p>"+
  " Dowloading FracSpellerDual Demo: <br />"+
  "<br />"+
  " Download the demo by clicking on the \"Download Demo\" button shown below.<br />"+
  " Placing the file on your desktop to easily \"verify the download\"  (as described"+
  " below) and also run the demo.<br />"+
  " Verifying the file before running it is recommended to ensure its authenticity and"+
  " integrity.  Use Window's PowerShell utility to compare the file's SHA-256 hash code"+
  " (shown below) against the one generated for the downloaded file. (follow the detailed"+
  " instructions by clicking on the 'Verify' button below.)<br />"+
  "<br />"+
  " Running the demo:<br />"+
  "<br />"+
  " Once verified run the program from your desktop by double-cliking on it.  In demo mode"+
  " it is recommended that you follow the 'quick tour' instructions as described on at startup.<br />"+
  "<br />" +
  " FracSpellerDual.exe (vrs. 1.0.0.1) SHA-256 Hash file Verification code:<br />" +
  "<br />"+
  " FEB16DA5A5885D87ACD7A9E0FA211DEBF96ADEB3820B0ECC38F85417D2B9BD56 <br />" +
  " (copy & use this code in the \"VERIFICATION\" steps after downloading the demo file.)</p></div>"

  let extra = "<div style='color:yellow; background:green; align:center; width:80%'>"+
  "<p>"+
  " USB Version:<br />" +
  " The application may also be placed on a USB drive allowing use on any computer.<br />" +
  " The USB version does not offer a \"DEMO\" mode.  View the DEMO first on a CPU or Notebook," +
  " (WINDOWS only) then if you prefer a USB version, move the .exe file to a USB.<br />"+
  " Run it there and follow the same procedure as described above to register the application." +
  " The USB version will not run until you enter its unique Key Code.<br />" +
  " <br />" +
  " &nbsp;&nbsp;&nbsp;&nbsp; NOTE CAREFULLY: Some USB drives do not have a serial id and cannot be used.<br />"+
  " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Message 'UNKNOWN DRIVE' will alert you to this condition.<br />"+
  " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (most USB devices have an ID)</p></div>"

  let downloadFSDesc2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = '/catalog/get_S3_FS'; //this provides download href

res.render('downloadFS_view', { title: "FracSpeller Downloads",
                                 themeDesc1: downloadFSDesc1,
                                 themeDesc2: downloadFSDesc2,
                                 source:source});
};
