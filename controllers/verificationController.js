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
label[4] = 'Compare Command';
label[5] = 'Pasting Reference Hash Code';
label[6] = 'Copying PowerShell generated code';
label[7] = "Compare's output for similar files";
label[8] = "Compare's output for differing files";
label[9] = "locating correct SHA-256 Hash Code";

let verify = [];
verify[0] = "Press Next";
verify[1] = "Microsoft Windows can perform the verification of a file's authenticity by using the\n" +
"'PowerShell' utility command 'Get-FileHash'. <br />\n" +
"Simply follow the steps as described below.<br /> \n"+
"Step 1- Type 'PowerShell' in the Search Command Box (white box bottom left of screen)<br />\n" +
"@nbsp;@nbsp;@nbsp;@nbsp;@nbsp;@nbsp;This will bring up the menu with PowerShell option. (press 'Next')";

verify[2] = "Step 2- Click the first option ('Windows PowerShell ISE (x86)' ) \n"+
"  The PowerShell utility will start up, with probably 'PS C:\\Users\\User>' as the prompt. \n"+
"  (It is not important if the prompt is different)"

verify[3] = "Step 3-  (Following example assumes 'PieSlicerDual.exe' has been downloaded onto the desktop)\n"+
"  At the prompt type in the command: \"Get-FileHash C:\\Users\\User\\Desktop\\PieSlicerDual.exe\".\n"+
"  (as for all commands you must then press ENTER key to enter it)\n"+
"  Also notice that as you type PowerShell allows you to browse to any folder: you can use \n"+
"  this feature if your file is not located on the Desktop as in our example.\n"+
"  PowerShell will then print out the long SHA-256 hash code, as shown below:"

verify[4] = "Step 4- At the prompt (i.e. PS C:\\Users\\User>) type: \"compare\" \n"+
"  PowerShell prints stuff then requests a prompt for \"ReferenceObject[0]\":<br />\n"+
"   (we show the completed sequence and where you will need to 'PASTE' the codes, \n"+
"   where \"(nothing)\" is shown you are to press 'ENTER' with no text)<br />\n"+
"   Go on to Step 5 to begin the sequence in order."

verify[5] = "Step 5- Paste the hash code from our site for the module you have downloaded at\n"+
"  the first position requested by 'Compare' (ie ReferenceObject[0]) then press ENTER twice\n"+
"  to bring up a request for \"DifferenceObject[0]\".  Proceed to Step-6.";

verify[6] = "Step 6- Next go back to the Hash code generated in Step-3 above.\n"+
" Double click directly on the hash code (turns highlighted) then 'Right-Click on it & copy.'\n"+
" Paste it in the compare dialog at line \"DifferenceObject[0] and press 'ENTER' twice.\n"+
" Go on to Step 7.\n"

verify[7] = "Step 7- For exactly similar files pressing 'ENTER' at the prompt \"DifferenceObject[1]\"\n"+
"  will result in only the prompt being shown (see below).  You may safely run this demo.\n"+
"  Step 8 shows output for files that are different."

verify[8] = "Step 8-  If the final ENTER results in extra output shown with '=<' comparisons\n"+
"  or similar (as in the image below), then the files are different.  This normally comes from\n"+
"  a download error or a file corruption error.\n"+
"  Do not run any file with an error; attempt to download again."

verify[9] ="Finally:  The correct hash code for each module is available at the download\n"+
" page specific to each module.  (accessed by clicking \"Downloading Demos\" shown at bottom \n"+
" of the module's description page)"
" These download instructions pages look the same for each module, however the hash code given\n"+
" for each file is different.  Be sure to use the code for the file you have downloaded."

exports.verify_start = function(req,res) {
  VerifyState.step = 1; //2019-01-21 VerifyState is a global defined in app.js
  let scriptText = verify[VerifyState.step];
  let filename = "step" + VerifyState.step.toString() + ".png";
  let prolog = "<div style='position:relative; color:yellow;  background:green; width:80%; padding:10px; align:center'>"

  //let image = '../public/images/'+ filename; //this provides download href
  let image = 'https://s3.ca-central-1.amazonaws.com/pipsverifybucket/' + filename;
  let imageTitle = label[VerifyState.step];
  let nextLocation = '/catalog/nextVerify';
  let prevLocation = '/catalog/backVerify';
  let nextLabel = 'Next';
  let prevLocLbl = 'Prev';
res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: prolog + "<p>" + scriptText + "</p></div>",
                                 themeDesc2: " ",
                                 source: image,
                                 source2: imageTitle,
                                 nextLoc: nextLocation,
                                 nextLbl: nextLabel,
                                 prevLoc: prevLocation,
                                 prevLbl: prevLocLbl});
};

//Display unique page details for Verification
exports.verify_view = function(req, res) {
  VerifyState.step += 1; //2019-01-21 VerifyState is a global defined in app.js
  if(VerifyState.step>9)VerifyState.step=1;
  let scriptText = verify[VerifyState.step];
  let filename = "step" + VerifyState.step.toString() + ".png";
  widthValue = scrWidth[VerifyState.step];//2019-01=25 added
  let prolog = "<div style='position:relative; color:yellow;  background:green; width:80%; padding:10px; align:center'>"

  //forcing update
  //let image = '../public/images/'+ filename; //this provides download href
  let image = 'https://s3.ca-central-1.amazonaws.com/pipsverifybucket/' + filename;
  let imageTitle = label[VerifyState.step];
  let nextLocation = '/catalog/nextVerify';
  let prevLocation = '/catalog/backVerify';
  let nextLabel = 'Next';
  let prevLocLbl = 'Prev';
res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: prolog + "<p>" + scriptText + "</p></div>",
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
  if(VerifyState.step<=0)VerifyState.step=9;
  let scriptText = verify[VerifyState.step];
  let filename = "step" + VerifyState.step.toString() + ".png";
  widthValue = scrWidth[VerifyState.step];//2019-01=25 added
  let prolog = "<div style='position:relative; color:yellow;  background:green; width:80%; padding:10px; align:center'>"
  //line to force update
  let image = 'https://s3.ca-central-1.amazonaws.com/pipsverifybucket/' + filename;
  let imageTitle = label[VerifyState.step];
  let nextLocation = '/catalog/nextVerify';
  let prevLocation = '/catalog/backVerify';
  let nextLabel = 'Next';
  let prevLocLbl = 'Prev';
res.render('verify_view', { title: "Verifying Downloads",
                                 themeDesc1: prolog + "<p>" + scriptText + "</p></div>",
                                 themeDesc2: " ",
                                 source: image,
                                 source2: imageTitle,
                                 nextLoc: nextLocation,
                                 nextLbl: nextLabel,
                                 prevLoc: prevLocation,
                                 prevLbl: prevLocLbl});

};
