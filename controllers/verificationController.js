const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//Display unique page details for Verification
exports.verify_view = function(req, res) {
  console.log("view Verification Process requested");
  let verify_1 = "<pre style='position:relative; left:50px; color:yellow;  background:green; width:700px; padding:10px; align:center'> \n" +
  "Microsoft Windows can perform the verification of a file's authenticity by using its\n" +
  "'PowerShell' utility command 'FCI'. \n"+
  "Steps:\n"+
  "1- Type 'PowerShell' in the Search Command Box (white box bottom left of screen)\n"+
  "2- Click the first option ('Windows PowerShell ISE (x86)' or similar ) \n"+
  "  (Following example assumes 'PieSlicer.exe' was downloaded onto the desktop)\n"+
  "3- At PowerShell prompt (probably 'PS C:>' but OK if different) type in: \n"+
  "   PS C:> \"Get-FileHash C:\\Users\\User\\Desktop\\PieSlicer.exe\"  + press 'ENTER' (aka CR)\n"+
  "\n"+
  "  PS will then print out a very long hash code (as in following example)\n"+
  "     HASH part:>  5B1332C19F156E8CCEBF8F7FD749F8D3D23CB30685BC52A35A4FA3C8F6EFCBE8 \n" +
  "\n"+
  " Next we copy this Hash code and compare it with the one from our site:\n"+
  " Still in PowerShell\n"+
  "4- Double click directly on the hash code (turns highlighted) then Right-Click on it & copy\n"+
  "5- Go to PowerShell prompt (PS C:>) and type: \"compare\" \n"+
  "  PowerShell prints stuff then requests information as shown below (we include your responses):\n"+
  "            prompt      your response \n"+
  "  ReferenceObject[0]: 5B1332C19F156..... (use rightClick to paste hash code from step 4 here) \n"+
  "  ReferenceObject[1]: (press ENTER)\n"+
  "  DifferenceObject[0]: (paste SHA-256 Hash Code for 'PieSlicer.exe' as shown on our web site)\n"+
  "  DifferenceObject[1]: (press ENTER)\n"+
  "  PS C:>\n"+
  "\n"+
  "  If codes are exactly the same, only the normal prompt, as shown above, is returned.\n"+
  "  If hash codes are shown, with '=<' comparisons or similar, then files are different.\n"+
  "  This normally comes from a download error or file corruption error.\n"+
  "  Do not run any file with an error, attempt to download again, or contact us.\n"+
  "</pre>"


  let verify_2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = "pieSlicerDwnld.js"; //this provides download href

res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: verify_1,
                                 themeDesc2: verify_2});
};
