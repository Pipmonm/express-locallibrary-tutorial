const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//Display unique page details for Verification
exports.aboutUs_view = function(req, res) {
  console.log("view Verification Process requested");
  let aboutUs_1 = "<pre style='position:relative; left:50px; color:black;  background:gainsboro; width:650px; padding:10px; align:center'> \n" +
  "  This site is the outcome of having taught junior & senior high school students \n" +
  "  for many years and having noticed that for those who have had difficulty it can \n"+
  "  usually be traced back to some critical details that were not clearly understood \n" +
  "  at some point in their past study of mathematics.  When a few of these lapses pass \n" +
  "  undetected and not remedied then the outcome is quite naturally, at the very best, \n" +
  "  mediocre performance in math and at worst an active dislike of mathematics!\n" +
  "  \n"+
  "  There can surely be no worse outcome for a student's personal, and academic future \n"+
  "  than to prematurely discard an entire branch of study, be it Arts, Science or whatever! \n"+
  "  \n"+
  "  The intent of this site then is to help prevent such outcomes by hopefully avoiding\n" +
  "  them in the first place, or if the need arises, remedy any that may have cropped up.\n" +
  "  Our modules are intended to ASSIST teachers with some of the fundamental math concepts\n"+
  "  by presenting these in a way students will  find interesting and memorable.\n"+
  "  By using a striking and more interactive visual presentation coupled with problems\n"+
  "  linked to the material at hand (including immediate feedback on the student's responses)\n"+
  "  we are certain that we can help achieve that goal."

  let aboutUs_2 =  "  There is but one of \"Us\" in About Us and I would hope that all visitors to this\n"+
  "  site will keep that in mind and if our modules turn out to be of use in their efforts\n"+
  "  to instill a fondness (or a small liking anyway) for mathematics in their child(ren) \n"+
  "  then they will consider encouraging our efforts to provide more, and better, modules\n"+
  "  by making a donation that they feel is commensurate to the help we may have provided.\n"+
  "  Rest assured your support will be greatly appreciated.  Thank you.";// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

res.render('aboutUs_view', { title: "About Us",
                                 themeDesc1: aboutUs_1,
                                 themeDesc2: aboutUs_2});
};
