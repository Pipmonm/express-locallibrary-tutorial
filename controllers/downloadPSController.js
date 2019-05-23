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
  "PieSlicerDual.exe (vrs. 1.0.0.4)  file SHA-256 Verification code:<br />" +
  "74A6E534F95E9B4F9FA58C344964F2A28DC86561529F276E66C626C76F0EFF60<br />" +
  "(copy & use this code in the \"VERIFICATION\" steps after downloading the demo file.),</p></div>"


  let downloadPSDesc2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = '/catalog/get_S3_PS'; //this provides download href

res.render('downloadPS_view', { title: "PieSlicer Downloads",
                                 themeDesc1: downloadPSDesc1,
                                 themeDesc2: downloadPSDesc2,
                                 source:source});
};


exports.download_USB_PS_view = function(req, res) {
  let downloadUSBPSDesc1 = "<div style='position:relative; color:yellow;  background:green; padding:10px; width:80%; align:center'>" +
  "<p>"+
  " USB Version info:<br />" +
  " The application may also be placed on a USB drive allowing use on any computer.<br />" +
  " However USB versions do not offer a \"DEMO\" mode. <br /> " +
  " So use a computer or laptop to view the Demo, then if you prefer a USB version, move(copy)"+
  " that same .exe file to the USB.<br />"+
  " Run it there and follow the same procedure for registration as described for CPU versions.<br />" +
  " An unregistered USB version allows reading the \"REGISTRATION DATA\" required to register it."+
  " But it will not run until you do register it, get its key-code and then enter it when requested. "+
  " <br /> (purchasing a CPU version includes free usage on 1 USB )<br />" +
  " <br />" +
  " &nbsp;&nbsp;&nbsp;&nbsp; NOTE CAREFULLY: Some USB drives do not have a serial id and cannot be used.<br />"+
  " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Message 'UNKNOWN DRIVE' will alert you to this condition.<br />"+
  " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (most USB devices have an ID)</p></div>";

  let downloadPSDesc2 =  ' ';

  let source = '/catalog/get_S3_PS'; //this provides download href

res.render('downloadPS_view', { title: "PieSlicer Downloads",
                                 themeDesc1: downloadUSBPSDesc1,
                                 themeDesc2: downloadPSDesc2,
                                 source:source});
};
