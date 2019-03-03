const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadPS_view = function(req, res) {
  console.log("@@@ $ details of PieSlicer download");
  let downloadPSDesc1 = "<p style='color:yellow; background:green; '> \n" +
  "Dowloading PieSlicerDual Demo:  \n"+
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
  "PieSlicerDual.exe (vrs. 1.0.0.3)  file Verification code:\n" +
  "SHA-256 Hash Code:   F889CC16B94F51D2A29726773175172D772C9000C168D7B8247552D6F6D239AA \n" +
  "(copy & use this code in the \"VERIFICATION\" steps after downloading the demo file.),</p>"

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
