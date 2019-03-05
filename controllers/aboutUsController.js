const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//Display unique page details for Verification
exports.aboutUs_view = function(req, res) {
  console.log("view Verification Process requested");
  let aboutUs_1 = "<div style='position:relative; left:50px; color:black;  background:gainsboro; width:80%; padding:10px; align:center'> \n" +
  "<p>" +
  "&nbsp;&nbsp;&nbsp; This site is the outcome of having taught junior & senior high school students" +
  " for many years and having noticed that for those who have had difficulty it can"+
  " usually be traced back to some critical details that were not clearly understood" +
  " at some point in their past study of mathematics.  When a few of these lapses pass" +
  " undetected and unremedied then the outcome is quite naturally, at the very best," +
  " mediocre performance in math and at worst an active dislike of mathematics!<br />" +
  " <br />"+
  "There can surely be no worse outcome for a student's personal, and academic future"+
  " than to prematurely discard an entire branch of study, be it Arts, Science or whatever!<br />"+
  " <br />"+
  "The intent of this site then is to help prevent such outcomes by hopefully avoiding" +
  " them in the first place, or if the need arises, remedy any that may have cropped up." +
  " Our modules are intended to ASSIST teachers with some of the fundamental math concepts"+
  " by presenting these in a way students will  find interesting and memorable.<br />"+
  "By using a striking and more interactive visual presentation coupled with problems"+
  " linked to the material at hand (with immediate feedback on the student's responses)"+
  " we are certain that we can help achieve that goal.</p></div>"

  let aboutUs_2 =  "<div style='position:relative; left:50px; color:black;  background:gainsboro; width:80%; padding:10px; align:center'> \n" +
  "<p>" +
  "&nbsp;&nbsp;&nbsp; There is but one of \"Us\" in About Us and I would hope that all visitors to this"+
  " site will keep that in mind and if our modules turn out to be of use in their efforts"+
  " to instill a fondness (or a small liking anyway) for mathematics in their students/child(ren)"+
  " they will encourage our efforts to provide more, and better, modules.<br />"+
  "<br />"+
  "<br />"+
  "&nbsp;&nbsp;&nbsp;Thank you.</p></div"// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

res.render('aboutUs_view', { title: "About Us",
                                 themeDesc1: aboutUs_1,
                                 themeDesc2: aboutUs_2});
};
