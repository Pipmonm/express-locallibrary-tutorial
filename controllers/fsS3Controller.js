

exports.get_S3_FS_file = function (req, res) { //2019-02-24 added this controller
let fs = require('fs');
let path = require('path');
console.log("@@@ $ in getS3_FS_File.js");
let filename = 'FracSpellerDual.exe';
//let absPath = path.join('c:/Users/User/Illustrated/Math-Dev/public/javascripts/downloading', filename);
let absPath = path.join('https://s3.ca-central-1.amazonaws.com/fracspeller/', filename);
//https://s3.ca-central-1.amazonaws.com/pipsbucket/FracSpellerDecimal.exe
let relPath = path.join('./public/javascripts/downloading', filename); // path relative to server root
console.log(absPath);
res.redirect("https://s3.ca-central-1.amazonaws.com/fracspeller/" + filename);//brute force 2018-09-19
};
