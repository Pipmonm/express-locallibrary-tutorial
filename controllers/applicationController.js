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
   "Our Goal: \n " +
   " Given the large array of careers out there nowadays most parents are, rightfully, concerned about ensuring \n " +
   "their children will be able to choose whichever career they may want and that they will have been sufficiently \n " +
   "prepared so as to have the best chances of success at whatever that choice may be. \n " +
   "Fundamental language skills, confidence in their ability to learn, outlets for creative expression and \n " +
   "in our perhaps biased opinion, excellent understanding and proficiency in mathematics are crucial in helping \n" +
   "form the underpinnings of such success."
   " As a former teacher I can attest to many a thwarted ambition due to difficulties in these aforementioned\n " +
   "requirements. \n  " +
   " This site then is dedicated to providing what help we may be able to offer to teachers, home-schooling parents \n" +
   "and students in achieving those goals, specifically in our case, with math. \n " +
   " We do not in any way claim to be a substitute for any curriculum or textbook.  We only hope to provide a bit \n " +
   "more transparency with certain topics in mathematics and hopefully even make it more enjoyable, if not outright \n" +
   "fun, to master these.  It has been our experience that when students truly understand something they will invariably \n " +
   "retain it better and go on to pursue the matter witn more interest and curiosity for 'What comes next?'." +
   "If you decide to use any of our units, please let us know how we're doing.";

 let blurb3 = "<pre style='position:relative; left:50px; color:yellow; background:green; width:650px'> \n" +
 "Welcome \n" +
 "Our site features math modules designed to help a teacher or home-schooling parent \n" +
 "present students with interactive visual aids to make certain math topics easy to  \n" +
 "learn and more interesting.  The best way to get a good idea on how they could be \n" +
 "used is to download and try them out.  A few minutes at most and absolutely no fuss: \n" +
 "if you find you're not interested simply delete and forget about them.\n" +
 "\n" +
 "Downloading: \n" +
 "Click on either module currently available, read the blurb or jump right to 'Download \n" +
 "Demos'.  Once the download is done run the file. (Windows' will caution and advise the \n" +
 "file is certified to our site. )\n" +
 "\n" +
 "Getting a license key for unlimited use: \n" +
 "To obtain unlimited use first click on the \"REGISTER\" tab on the homepage of the \n" +
 "application. This places a unique system specific code on your clipboard. \n" +
 "Return to our site xxxx.com and click on the REGISTER FORM option.  Insert your data \n" +
 "as suggested. (all data is optional except for clipboard data which must be pasted in \n" +
 "the indicated text area. \n" +
 "You should then go to the \"VIEW ACCOUNT\" option and paste the same clipboard data there. \n" +
 "(the clipboard data is your password to the account showing your system's license key)\n" +
 "Take note of the license key code that will be shown and insert it in the application as\n" +
 "requested on startup. \n" +
 "That's it.   Well almost.  We would of course appreciate and thank you profusely for any \n" +
 "financial support you may provide so as to enable us to continue presenting other modules \n" +
 "on our site.\n" +
 "The 'DONATE' menu item allows you to do so.   Thank you"
 let err = false;

 res.render('index', { title: 'Math For All', error: err, blurb: blurb3 });
};
