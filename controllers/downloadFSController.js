const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadFS_view = function(req, res) {
  console.log("specifics of FS downloads");
  let downloadFSDesc1 = "<pre style='color:yellow; background:green; width:660px'> \n" +
  "FracSpellerDual.exe application is limited to the specific computer (Windows based only)  \n"+
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
  "(the REGISTRATION DATA string is used to set the license key in the site's \"REGISTER\" page \n" +
  " and then serves as a unique password to access your license key in the \"View Account\" page)\n" +
  "\n" +
  "File Verification (SHA-256 hash code): \n" +
  "SHA-256 Hash Code:   F889CC16B94F51D2A29726773175172D772C9000C168D7B8247552D6F6D239AA \n" +
  "(refer to VERIFICATION page for further info on how to verify secure file download using this code)"

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
