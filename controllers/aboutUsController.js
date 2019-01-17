const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//Display unique page details for Verification
exports.aboutUs_view = function(req, res) {
  console.log("view Verification Process requested");
  let aboutUs_1 = "<pre style='position:relative; left:50px; color:slategray;  background:gainsboro; width:650px; padding:10px; align:center'> \n" +
  "  This site is the outcome of having taught junior & senior high school students \n" +
  "  for many years and having noticed that for those who have had difficulty it can \n"+
  "  usually be traced back to some critical details that were not clearly understood \n" +
  "  at some point in their past study of mathematics.  When a few of these lapses pass \n" +
  "  undetected and not remedied then the outcome is quite naturally at the very best \n" +
  "  mediocre performance in math and at worst an active dislike of mathematics!\n" +
  "  \n"+
  "  There can surely be no worse outcome for a student's personal, and academic future than \n"+
  "  to prematurely completely discard an entire branch of study, be it Arts, Science or \n"+
  "  whatever.\n" +
  "  The intent of the modules made availbale on this site was to simply avoid such outcomes\n" +
  "  by trying to redress any shortcomings that may have occurred by presenting some essential\n" +
  "  and key basic math concepts in a way that might hopefully make them more interesting and\n" +
  "  memorable with a more impactful visual presentation and immediate feedback on students' \n" +
  "  understanding and mastery of the material."

  let aboutUs_2 =  "There is but one of \"Us\" in About Us and I would hope that all\n"+
  "   visitors to this site will keep that in mind should they find our effort to be\n"+
  "   of use in their effort to inculcate a fondness for mathematics in their child(ren)\n"
  "   or the students in their charge.";// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

res.render('aboutUs_view', { title: "About Us",
                                 themeDesc1: aboutUs_1,
                                 themeDesc2: aboutUs_2});
};
