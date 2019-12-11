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
  " Download the demo by clicking on the \"Download Demo\" button shown below.<br />"+
  " It is recommended that you place it on your desktop to simplify following these steps.<br />"+
  " (Before running it you may want to 'verify' the download as described below)<br /><br />"+
  " To start the demo simply double-click on it (as any windows .exe file).  While in demo mode<br />"+
  " it is recommended that you follow the 'quick tour' instructions as described at startup.<br />"+
  "<br />"+
  " FILE VERIFICATION<br />"+
  " Verifying the file before running it is recommended to ensure its authenticity and<br />"+
  " integrity.  Use Window's PowerShell utility to compare the file's SHA-256 hash code<br />"+
  " (shown below) against the one generated for the downloaded file.<br />"+
  " Click on \"VERIFY DOWNLOAD\" button below for complete instructions. <br />"+
  "<br />"+
  " FracSpellerDual.exe (vrs. 1.0.0.1) SHA-256 Hash file Verification code:<br />" +
  "       2DB17CC7FF8CA696769BE62BCD58254F342E5E4A3A41B7ADD975B5A27DC12770 <br />" +
  "(copy & use this code as described in the Verify Download procedure.)</p></div>";


  let downloadFSDesc2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = '/catalog/get_S3_FS'; //this provides download href

res.render('downloadFS_view', { title: "FracSpeller Downloads",
                                 themeDesc1: downloadFSDesc1,
                                 themeDesc2: downloadFSDesc2,
                                 source:source});
};

exports.download_USB_FS_view = function(req, res) {
  let downloadUSBFSDesc1 = "<div style='position:relative; color:yellow;  background:green; padding:10px; width:80%; align:center'>" +
  "<p>"+
  " USB Version info:<br />" +
  " The application may also be placed on a USB drive allowing use on any computer.<br />" +
  " However USB versions do not offer a \"DEMO\" mode. <br /> " +
  " So use a computer or laptop to view the Demo, then if you prefer a USB version, move(copy)"+
  " that same .exe file to the USB.<br />"+
  " Run it there and follow the same procedure for registration as described for CPU versions.<br />" +
  " An unregistered USB version allows reading the \"REGISTRATION DATA\" required to register it."+
  " But it will not run until you do register it, get its key-code and then enter it when requested. "+
  " <br />" +
  " &nbsp;&nbsp;&nbsp;&nbsp; NOTE CAREFULLY: Some USB drives do not have a serial id and cannot be used.<br />"+
  " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Message 'UNKNOWN DRIVE' will alert you to this condition.<br />"+
  " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (most USB devices have an ID)</p></div>";

  let downloadFSDesc2 =  ' ';

  let source = '/catalog/get_S3_FS'; //this provides download href

res.render('downloadFS_view', { title: "FracSpeller Downloads",
                                 themeDesc1: downloadUSBFSDesc1,
                                 themeDesc2: downloadFSDesc2,
                                 source:source});
};
