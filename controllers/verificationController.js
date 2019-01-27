const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
var app = require('../app');//2019-01-22 need State variable to track steps for verify_x
let widthValue = "720px";
var scrWidth = ["720px","850px","720px","850px","300px","720px","850px","720px","850px"];

//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM
let label = [];
label[0] = " ";
label[1] = 'Windows 10 Search Box';
label[2] = 'starting PowerShell';
label[3] = 'Get-FileHash command & result';
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
"Step 1- Type 'PowerShell' in the Search Command Box (white box bottom left of screen)\n" +
"        This will bring up the menu with PowerShell option. (press 'Next')";

verify[2] = "Step 2- Click the first option ('Windows PowerShell ISE (x86)' ) \n"+
"  The PowerShell utility will start up, with probably 'PS C:\\Users\\User>' as the prompt. \n"+
"  (It is not important if the prompt is different)"

verify[3] = "Step 3-  (Following example assumes 'PieSlicerDual.exe' has been downloaded onto the desktop)\n"+
"  At the prompt type in the command: \"Get-FileHash C:\\Users\\User\\Desktop\\PieSlicerDual.exe\".\n"+
"  (as for all commands you must then press ENTER key to enter it)\n"+
"  Also notice that as you type PowerShell allows you to browse to any folder: you can use \n"+
"  this feature if your file is not located on the Desktop as in our example.\n"+
"  PS will then print out the long SHA-256 hash code, as shown below:"

verify[4] = "Step 4- Next we will copy this Hash code and compare it with the one from our site.\n"+
" While staying in PowerShell double click directly on the hash code shown (turns highlighted)\n"+
" then Right-Click on it & copy"

verify[5] = "Step 5- At the prompt (i.e. PS C:\\Users\\User>) type: \"compare\" \n"+
"  PowerShell prints stuff then requests information as shown below:\n"+
"   (we also show where you will need to 'PASTE' the codes being compared.  Where no input\n"+
"    is shown you must press 'ENTER' with no text) "

verify[6] = "Step 6- The screen image below shows the complete sequence of prompts and required \n"+
"  responses to verify the codes.  Note that the last hash code entered is obtained from this\n"+
"  site's page for the module being downloaded.\n"+
"  NOTE: For exactly matching codes the final 'Enter' (entered for DifferenceObject[1] ) will \n"+
"        result in only the PowerShell prompt being shown, signalling that the files are the same.\n"+
"        (proceed to Next step to see the output for files that do not compare)"

verify[7] = "Step 7-  If the final ENTER results in extra output shown with '=<' comparisons\n"+
"  or similar (as in the image below), then the files are different.  This normally comes from\n"+
"  a download error or a file corruption error.\n"+
"  Do not run any file with an error, attempt to download again."

verify[8] ="Finally:  The correct hash code for each module is obtained on this web site at\n"+
" the download page specific to each module.  For each module you need to click on the button\n"+
" shown at the bottom of the module's description page to see the page with the code.\n"+
" These download instructions pages are the same for each module, however the hash code shown\n"+
" is different for each file.  Be sure to use the correct code for the file you have downloaded."

exports.verify_start = function(req,res) {
  VerifyState.step = 1; //2019-01-21 VerifyState is a global defined in app.js
  let scriptText = verify[VerifyState.step];
  let filename = "step" + VerifyState.step.toString() + ".jpg";
  let prolog = "<pre style='position:relative; left:50px; color:yellow;  background:green; width:720px; padding:10px; align:center'>"

  //let image = '../public/images/'+ filename; //this provides download href
  let image = 'https://s3.ca-central-1.amazonaws.com/pipsverifybucket/' + filename;
  let nextLocation = '/catalog/verification';
  let prevLocation = '/catalog/backVerify';
  let nextLabel = 'Next';
  let prevLocLbl = 'Prev';
res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: prolog + scriptText,
                                 themeDesc2: " ",
                                 source: image,
                                 source2: "verify step1",
                                 nextLoc: nextLocation,
                                 nextLbl: nextLabel,
                                 prevLoc: prevLocation,
                                 prevLbl: prevLocLbl});
}
//Display unique page details for Verification
exports.verify_view = function(req, res) {
  VerifyState.step += 1; //2019-01-21 VerifyState is a global defined in app.js
  if(VerifyState.step>8)VerifyState.step=1;
  let scriptText = verify[VerifyState.step];
  let extension = ".png";
  if(VerifyState.step == 1)extension = ".jpg";
  let filename = "step" + VerifyState.step.toString() + extension;
  widthValue = scrWidth[VerifyState.step];//2019-01=25 added
  let prolog = "<pre style='position:relative; left:50px; color:yellow;  background:green; width:${widthValue}; padding:10px; align:center'>"

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
  let extension = ".png";
  if(VerifyState.step == 1)extension = ".jpg";
  let filename = "step" + VerifyState.step.toString() + extension;
  widthValue = scrWidth[VerifyState.step];//2019-01=25 added
  let prolog = "<pre style='position:relative; left:50px; color:yellow;  background:green; width:${widthValue}; padding:10px; align:center'>"


  console.log("@@@ $ looking for : " + filename);
  //line to force update
  let image = 'https://s3.ca-central-1.amazonaws.com/pipsverifybucket/' + filename;
  let imageTitle = 'Step ' + VerifyState.step.toString() + ' image';
  let nextLocation = '/catalog/nextVerify';
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
