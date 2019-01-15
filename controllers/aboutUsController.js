const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
//var mongoose = require('mongoose'); // added  :MOD: 2018-03-08 10:32 AM

//Display unique page details for Verification
exports.aboutUs_view = function(req, res) {
  console.log("view Verification Process requested");
  let aboutUs_1 = "We are whoever are We"


  let aboutUs_2 =  ' ';// `<a href='/pieSlicerDwnld'><span style='color:white; background:black'>DOWNLOAD DEMO</span>`;

res.render('aboutUs_view', { title: "About Us",
                                 themeDesc1: aboutUs_1,
                                 themeDesc2: aboutUs_2});
};
