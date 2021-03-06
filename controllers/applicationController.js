exports.index = function(req, res) {
 let blurb = "<pre style='position:relative; left:50px; color:yellow; background:green; width:650px'> \n" +
   "This site is under development \n" +
   "Viewers are able to see changes as they are implemented.   \n" +
   "There is an ongoing effort to improve the site and turn it into an optimal experience \n" +
   "for teachers, homeschooling  parents and any student who may like a more 'hands-on' \n" +
   "and interactive approach in developing their math proficiency and understanding. \n" +
   "\n" +
   "Stay tuned.</pre>"

   let blurb2 = "<pre style='position:relative; left:50px; color:yellow; background:green; width:650px'> \n" +
   "Our Goal: \n" +
   "Given the large array of careers out there nowadays most parents are, rightfully, concerned about ensuring \n" +
   "their children will be able to choose whichever career they may want and that they will have been sufficiently \n" +
   "prepared so as to have the best chances of success at whatever that choice may be. \n" +
   "Fundamental language skills, confidence in their ability to learn, outlets for creative expression and \n" +
   "in our perhaps biased opinion, excellent understanding and proficiency in mathematics are crucial in helping \n" +
   "form the underpinnings of such success."
   " As a former teacher I can attest to many a thwarted ambition due to difficulties in these aforementioned\n" +
   "requirements. \n  " +
   " This site then is dedicated to providing what help we may be able to offer to teachers, home-schooling parents \n" +
   "and students in achieving those goals, specifically in our case, with math. \n" +
   " We do not in any way claim to be a substitute for any curriculum or textbook.  We only hope to provide a bit \n" +
   "more transparency with certain topics in mathematics and hopefully even make it more enjoyable, if not outright \n" +
   "fun, to master these.  It has been our experience that when students truly understand something they will invariably \n" +
   "retain it better and go on to pursue the matter witn more interest and curiosity for 'What comes next?'." +
   "If you decide to use any of our units, please let us know how we're doing.";

 let blurb3 = "<div style='position:relative; color:yellow;  background:green; padding:10px; width:80%; align:center'>"+
 "<p>" +
 " Welcome to all teachers and home-schooling parents.<br />"+
 "<br />"+
 " We invite you to try out the interactive math modules designed to make specific math topics both interesting,"+
 " and memorable for students.<br />"+
 "<br />"+
 " Download and explore these in 'demo' mode.  If of no interest, simply delete them.<br />"+
 "<br />"+
 " If on the other hand you would like to obtain a license for unlimited use, just"+
 " follow the instructions given in the \"Registration Data\" page which is made available at "+
 " each module's startup page. <br />"+
 "<br />"+
 " The \"Registration Data\" obtained from the module is used by following these steps, in order!:<br />"+
 "  1- Use the 'Register Form' tab on the site to register your system Id using the \"Registration Data\"<br />"+
 "  2- Use the same \"Registration Data\" string to process the payment via the 'View Cart' tab.<br />"+
 "  3- After a successful payment use that same \"Registration Data\" as the unique password to<br />"+
 "     access your account (via View Account tab on website) and obtain your License Key.<br />"+
 "     (Use this License Key as requested when starting the module to unlock it permanently)<br />"+
 "<br />"+
 " A license for unlimited use for any module is currently priced at $10 US. <br />"+
 " Finally, a most sincere 'thank you' to all who have supported our efforts and thereby have"+
 " hopefully enabled us to produce more and better modules."

 let blurb4 = "Downloading: \n" +
 "Click on either of the available modules and follow the instructions for downloading. \n" +
 "These are fully functional versions but in demo mode will run for a limited time only. \n" +
 " (Windows may raise CAUTION advisory on first run amd show Certificate of Origin) \n" +
 "\n" +
 "\n" +
 "Getting a license key: \n" +
 "Instructions for getting a license key are given on each download page."

 let blob = "First - click on the \"REGISTER\" tab on the homepage of the application you have \n" +
 "        downloaded.  This places a unique system specific code on your clipboard. \n" +
 "NEXT -  Go to \"REGISTER FORM\" option shown on this page.  Fill in as requested. \n" +
 "       (NOTE: all data is optional except for the clipboard data which must be pasted \n" +
 "        in the indicated text area. \n" +
 "THEN -  Go to \"VIEW ACCOUNT\" option and paste the same clipboard data there. \n" +
 "        (the clipboard data is your password for showing your system's license key)\n" +
 "\n" +
 "FINALLY- Note the license key code that is shown and insert it in the application \n" +
 "         where it is requested on startup. \n" +
 "\n"

 let err = false;
 var showFileArray = ["https://s3.ca-central-1.amazonaws.com/pipsbucket/PieSlicerHX.jpg",
                      "https://s3.ca-central-1.amazonaws.com/pipsbucket/PieSlicerGAEX.jpg",
                      "https://s3.ca-central-1.amazonaws.com/pipsbucket/PieSlicer.jpg"]

 res.render('index', { title: 'Math Topics', error: err, blurb: blurb3, fileArray:showFileArray});

};
