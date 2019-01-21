const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//Display unique page details for Verification
exports.verify_view = function(req, res) {
  console.log("view Verification Process requested");
  let prolog = "<pre style='position:relative; left:50px; color:yellow;  background:green; width:720px; padding:10px; align:center'> \n" +
  let verify_1 ="Microsoft Windows can perform the verification of a file's authenticity by using its\n" +
  "'PowerShell' utility command 'FCI'.   Follow the steps as described below to accomplish this: \n"+
  "\n"+
  "Step 1- Type 'PowerShell' in the Search Command Box (white box bottom left of screen)\n"

  let verify_2 = "Step 2- Click the first option ('Windows PowerShell ISE (x86)' or similar ) \n"+
  "        This will bring up the PowerShell utility as shown below.\n"+
  "        (The PowerShell prompt 'PS C:>' may be different but this will not affect anything. )"

  let verify_3 = "Step 3-  (Following example assumes 'PieSlicerDual.exe' has been downloaded onto the desktop)\n"+
  "  At the prompt type in the command: \"Get-FileHash C:\\Users\\User\\Desktop\\PieSlicerDual.exe\"  as shown below.\n"+
  "   (as for all commands you must then press ENTER key to execute it)\n"+
  "   Also notice that as you type PowerShell allows you to browse to any folder: use if your file is not \n"+
  "   on the Desktop as in our example."

  let verify_4 - "Step 4- PS will then print out SHA-256 results including the long hash code\n"+
  "     HASH part:>  5B1332C19F156E8CCEBF8F7FD749F8D3D23CB30685BC52A35A4FA3C8F6EFCBE8 "

  let verify_5 = "Step 5- Next we will copy this Hash code and compare it with the one from our site.\n"+
  " The following steps are still done in PowerShell\n"+
  "  Double click directly on the hash code (turns highlighted) then Right-Click on it & copy"

  let verify_6 = "Step 6- At the prompt (i.e. PS C:>) type: \"compare\" \n"+
  "  PowerShell prints stuff then requests information as shown below:"

  let verify_7 = "Step 7- The screen image below shows the complete sequence of prompts and required \n"+
  "  responses to verify the codes.  Note that the last hash code entered is obtained from this site's pages \n"+
  "  for the module being downloaded."

  let verify_8 = "Results:  If codes are exactly the same only the normal prompt, as shown above, is returned.\n"+
  "  If hash codes are shown, with '=<' comparisons or similar (as in the image below), then files are different.\n"+
  "  This normally comes from a download error or file corruption error.\n"+
  "  Do not run any file with an error, attempt to download again, or contact us.\n"+
  "</pre>"

  app.VerifyState.step += 1; //next file
  let filename = "step" + app.VerifyState.step.toString() + ".png";
  let source = '/public/images/'+ filename; //this provides download href
  let source2 = 'Step ' + app.VerifyState.step.toString() + ' image';

res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: verify_1,
                                 themeDesc2: verify_2,
                                 source: source,
                                 source2: source2});
};
