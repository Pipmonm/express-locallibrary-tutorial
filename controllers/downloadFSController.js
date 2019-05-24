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
  " Download the demo by clicking on the \"Download Demo\" button shown below.\n"+
  " Placing the file on your desktop will make it easier to \"verify the download\" as described"+
  " next.<br />"+
  " Verifying the file before running it is recommended to ensure its authenticity and"+
  " integrity.  Use Window's PowerShell utility to compare the file's SHA-256 hash code"+
  " (shown below) against the one generated for the downloaded file.<br />"+
  " Click on \"VERIFY DOWNLOAD\" button below for complete instructions. <br />"+
  "<br />"+
  " Running the demo:<br />"+
  " Once verified run the program from your desktop by double-cliking on it.  While in demo mode"+
  " it is recommended that you follow the 'quick tour' instructions as described at startup.<br />"+
  "<br />" +
  " FracSpellerDual.exe (vrs. 1.0.0.1) SHA-256 Hash file Verification code:<br />" +
  "<br />"+
  " FEB16DA5A5885D87ACD7A9E0FA211DEBF96ADEB3820B0ECC38F85417D2B9BD56 <br />" +
  " (copy & use this code in the \"VERIFICATION\" steps after downloading the demo file.)</p></div>";


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
