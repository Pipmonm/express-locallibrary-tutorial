const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadPS_view = function(req, res) {
  console.log("specifics of PS downloads");
  let downloadPSDesc1 = "<pre style='color:yellow; background:green; width:660px'> \n" +
  "PieSlicerDual.exe application is limited to the specific computer (Windows based only)  \n"+
  "whose system ID and Format Code are used when obtaining the license key.  \n"+
  "Therefore be sure to get this data from the computer where the software will be used.  \n"+
  "Installing on a USB is possible, but you should view the demo on a CPU first because\n"+
  "a 'demo' mode is not available on USB versions.\n"+
  "Otherwise USB versions are installed using the same procefure as for the computer based\n"+
  "versions. \n"+
  "  \n"+
  "Registering:\n"+
  "Your System ID and Format Code are placed in your system's clipboard when you click \n"+
  "on the \"REGISTRATION DATA\" tab shown on the opening page of the demo application. \n"+
  "Paste this information where requested on this site's \"REGISTER FORM\" page to generate \n"+
  "the license Key.  Once successfully registered you may immediately obtain the unique \n"+
  "license key from this site's \"VIEW ACCOUNT\" page. \n"+
  "(the REGISTRATION DATA string permits access to your specific key via the \"VIEW ACCOUNT\" page.)\n"

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

  let source = "pieSlicerDownld.js"; //this provides download href

res.render('downloadPS_view', { title: "PieSlicer Downloads",
                                 themeDesc1: downloadPSDesc1,
                                 themeDesc2: downloadPSDesc2});
};
