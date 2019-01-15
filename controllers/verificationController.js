const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//Display unique page details for Verification
exports.verify_view = function(req, res) {
  console.log("view Verification Process requested");
  let verify_1 = "Microsoft Windows can perform the verification of a file's authenticity\n"+
  "using its 'PowerShell' utility command 'FCI'. \n"+
  "Steps:\n"+
  "1- Type 'PowerShell' in the Search Command Box (bottom left of Window screen)\n"+
  "2- Select the first option (something like: 'Windows PowerShell ISE (x86)' ) \n"+
  "  (Next steps use file 'PieSlicer.exe' downloaded onto the desktop as an example,)\n"+
  "3- At PowerShell prompt (probably 'PS C:>' but not important ) type in: \n"+
  "   PS C:> \"Get-FileHash C:\Users\User\Desktop\PieSlicer.exe\"  + do Carriage Return (CR)\n"+
  "\n"+
  "  PowerShell will then print out a very long hash code (as in following example)\n"+
  "     HASH part:>  5B1332C19F156E8CCEBF8F7FD749F8D3D23CB30685BC52A35A4FA3C8F6EFCBE8 \n" +
  "\n"+
  " Next compare this Hash code with the one from our site:\n"+
  " In PowerShell\n"+
  "4- Double click right on the hash code shown (turns selected) then Right-Click & copy\n"+
  "5- Next, at PowerShell prompt, type: \"compare\" \n"+
  "  PowerShell will give a blurb and end with a prompt asking for first item to be compared\n"+
  "  ReferenceObject[0]: 5B1332C19F156..... (use rightClick to paste hash code here) \n"+
  "  ReferenceObject[1]: (paste nothing, do CR)\n"+
  "  DifferenceObject[0]: (paste SHA-256 Hash Code for 'PieSlicer.exe' as given on our site)\n"+
  "  DifferenceObject[1]: (paste nothing, do CR)\n"+
  "  PS C:>\n"+
  "\n"+
  "  If codes are exactly the same, only the normal prompt, as shown above, is returned.\n"+
  "  If some codes are shown with '=<' comparisons or similar then files are different.\n"+
  "  This normally comes from a download error or file corruption error.\n"+
  "  Do not run any file with an error, attempt to download again, or contact us."


  let verify_2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = "pieSlicerDwnld.js"; //this provides download href

res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: verify_1,
                                 themeDesc2: verify_2});
};
