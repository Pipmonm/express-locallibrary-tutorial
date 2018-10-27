const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//following index function currently moved to introsController.


//Display unique page details for PieSlicer
exports.downloadPS_view = function(req, res) {
  console.log("specifics of PS downloads");
  let downloadPSDesc1 = "<pre style='color:yellow; background:green; width:650px'> \n" +
                    "PieSlicer application is restricted to the specific computer whose \n" +
                    "system ID and Format Code has been used to obtain a license. (Key Code)   \n" +
                    "Therefore be sure to run the demo on the computer that is to be used   \n" +
                    "by whomever is to be using the application.  \n " +
                    "  \n" +
                    "The 'Registration' tab on the opening screen of PieSlicer provides both \n" +
                    "a System Id and a Format Code.  They are automatically placed in your system  \n" +
                    "clipboard upon entering the Registration page.   You will be asked to provide  \n" +
                    "these when ordering the unrestricted license for the application.  Simply 'PASTE'  \n" +
                    "these in the indicated position when asked.  \n" +
                    "  \n" +
                    "A portable USB (thumb drive) version is available allowing use on any computer.  \n" +
                    "However a 'Demo' for the USB version is not available.   Therefore the unlicensed \n" +
                    "USB version will only display the opening screen (same as CPU version) which   \n" +
                    "will allow you to retrieve the USB_ID and Format Code required to obtain the  \n" +
                    "unrestricted license for the USB version.   The application will then be able \n" +
                    "to be run on any computer using that specific USB.  \n" +
                    "\n" +
                    "It is advised to run the CPU version to 'demo' the application.  After if you prefer \n" +
                    "to get the USB version, simply delete the CPU demo file and download the USB version. \n" +
                    " \n" +
                    "    NOTE CAREFULLY: Some USB drives do not have a serial id and cannot be used.\n" +
                    "                    Message 'UNKNOWN DRIVE' will alert you to this condition.\n"  +
                    "                    (most USB drives have an ID)"

  let downloadPSDesc2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

  let source = "pieSlicerDownld.js"; //this provides download href

res.render('downloadPS_view', { title: "PieSlicer Downloads",
                                 themeDesc1: downloadPSDesc1,
                                 themeDesc2: downloadPSDesc2});
};
