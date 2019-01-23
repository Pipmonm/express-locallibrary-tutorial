const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
var app = require('../app');//2019-01-22 need State variable to track steps for verify_x
let prolog = "<pre style='position:relative; left:50px; color:yellow;  background:green; width:720px; padding:10px; align:center'>"
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM
let label = [];
label[0] = " ";
label[1] = 'Windows 10 Search Box';
label[2] = 'starting PowerShell';
label[3] = 'get Hash command & result';
label[4] = 'copying PowerShell Hash Code';
label[5] = 'compare command & result';
label[6] = 'inputs to compare command & results';
label[7] = "Compare's output for differing files";
label[8] = 'locating correct SHA-256 Hash Code';

let verify = [];
verify[0] = "Press Next";
verify[1] = "Microsoft Windows can perform the verification of a file's authenticity by using the\n" +
"'PowerShell' utility command 'FCI'.   Follow the steps as described below to accomplish this. \n"+
"\n"+
"Step 1- Type 'PowerShell' in the Search Command Box (white box bottom left of screen)\n"

verify[2] = "Step 2- Click the first option ('Windows PowerShell ISE (x86)' or similar ) \n"+
"        This will bring up the PowerShell utility as shown below.\n"+
"        (The PowerShell prompt 'PS C:>' may be different but this will not affect anything. )"

verify[3] = "Step 3-  (Following example assumes 'PieSlicerDual.exe' has been downloaded onto the desktop)\n"+
"  At the prompt type in the command: \"Get-FileHash C:\\Users\\User\\Desktop\\PieSlicerDual.exe\"  as shown below.\n"+
"   (as for all commands you must then press ENTER key to execute it)\n"+
"   Also notice that as you type PowerShell allows you to browse to any folder: use if your file is not \n"+
"   on the Desktop as in our example."

verify[4] = "Step 4- PS will then print out SHA-256 results including the long hash code\n"+
"     HASH part:>  5B1332C19F156E8CCEBF8F7FD749F8D3D23CB30685BC52A35A4FA3C8F6EFCBE8 "

verify[5] = "Step 5- Next we will copy this Hash code and compare it with the one from our site.\n"+
" The following steps are still done in PowerShell\n"+
"  Double click directly on the hash code (turns highlighted) then Right-Click on it & copy"

verify[6] = "Step 6- At the prompt (i.e. PS C:>) type: \"compare\" \n"+
"  PowerShell prints stuff then requests information as shown below:"

verify[7] = "Step 7- The screen image below shows the complete sequence of prompts and required \n"+
"  responses to verify the codes.  Note that the last hash code entered is obtained from this site's pages \n"+
"  for the module being downloaded."

verify[8] = "Results:  If codes are exactly the same only the normal prompt, as shown above, is returned.\n"+
"  If hash codes are shown, with '=<' comparisons or similar (as in the image below), then files are different.\n"+
"  This normally comes from a download error or file corruption error.\n"+
"  Do not run any file with an error, attempt to download again, or contact us."

//Display unique page details for Verification
exports.verify_view = function(req, res) {
  VerifyState.step += 1; //2019-01-21 VerifyState is a global defined in app.js
  if(VerifyState.step>8)VerifyState.step=1;
  let scriptText = verify[VerifyState.step];
  let filename = "step" + VerifyState.step.toString() + ".png";
  console.log("@@@ $ looking for : " + filename);
  //line to force update
  //let image = '../public/images/'+ filename; //this provides download href
  let image = 'https://s3.ca-central-1.amazonaws.com/pipsverifybucket/' + filename;
  let imageTitle = label[VerifyState.step];
  let nextLocation = '/catalog/verification';
  let prevLocation = '/catalog/backVerify';
  let nextLabel = 'Next';
  let prevLocLbl = 'Prev';
res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: prolog + scriptText,
                                 themeDesc2: " ",
                                 source: image,
                                 source2: imageTitle,
                                 nextLoc: nextLocation,
                                 nextLbl: nextLabel,
                                 prevLoc: prevLocation,
                                 prevLbl: prevLocLbl});

};

exports.verify_back = function(req,res){
  VerifyState.step -=1;//back up two and view will ++ interval
  if(VerifyState.step<=0)VerifyState.step=8;
  let scriptText = verify[VerifyState.step];
  let filename = "step" + VerifyState.step.toString() + ".png";
  console.log("@@@ $ looking for : " + filename);
  //line to force update
  let image = 'https://s3.ca-central-1.amazonaws.com/pipsverifybucket/' + filename;
  let imageTitle = 'Step ' + VerifyState.step.toString() + ' image';
  let nextLocation = '/catalog/verification';
  let prevLocation = '/catalog/backVerify';
  let nextLabel = 'Next';
  let prevLocLbl = 'Prev';
res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: prolog + scriptText,
                                 themeDesc2: " ",
                                 source: image,
                                 source2: imageTitle,
                                 nextLoc: nextLocation,
                                 nextLbl: nextLabel,
                                 prevLoc: prevLocation,
                                 prevLbl: prevLocLbl});

}
