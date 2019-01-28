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
  "whose system ID was used to obtain the license key.  \n"+
  "Therefore be sure to get this ID from the computer where the software will be used.  \n"+
  "Installing on a USB is possible, but you should view the demo versions on a CPU first\n"+
  "because a 'demo' mode is not available for USB's.\n"+
  "Otherwise USB versions are the same as the computer based versions.  NOTE:Some USB's\n"+
  "cannot be used because they do not have a serial number.  (not often seen)\n"+
  "  \n"+
  "Getting the license key:\n"+
  "Every module's first page has a tab labelled \"REGISTRATION DATA\".\n"+
  "Clicking on that tab automatically puts the system ID in your window's clipboard.\n"+
  "Paste this information where requested when you fill the \"REGISTER FORM\" to get \n"+
  "a license Key.\n"+
  "After registering, immediately use that same System ID code as the password to view\n"+
  "the license key for that module in the \"VIEW ACCOUNT\" page. \n" +
  "\n" +
  "File Verification (using SHA-256 hash code): \n" +
  "SHA-256 Hash Code:   F889CC16B94F51D2A29726773175172D772C9000C168D7B8247552D6F6D239AA \n" +
  "(see VERIFICATION page for info on how to verify secure file download using this code)"

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
