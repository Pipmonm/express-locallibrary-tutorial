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
  " However the USB version does not offer a \"DEMO\" mode. <br /> " +
  " Use the same \"download (.exe)\" button as for a CPU or Notebook to get the file." +
  " Check it out in demo mode on a computer, then if you prefer a USB version, copy the .exe file to the USB.<br />"+
  " Run it there and follow the same procedure to register the application as described for the CPU version.<br />" +
  " The USB version will start and allow reading the \"REGISTRATION DATA\" required to register it."+
  " but it will not run until you do register it, get its key-code and then enter it as requested "+
  " when you attempt to run it in USB mode.<br /> (purchasing a CPU version includes free usage on 1 USB )<br />" +
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
