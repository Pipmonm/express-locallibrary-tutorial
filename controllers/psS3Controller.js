//2019-02-24 added controller for S3 limited access
exports.get_S3_PS_file = function (req, res) { //2019-02-24 added this controller
let fs = require('fs');
let path = require('path');
console.log("@@@ $ in getS3_FS_File.js");
let filename = 'PieSlicerDual.exe';
//let absPath = path.join('c:/Users/User/Illustrated/Math-Dev/public/javascripts/downloading', filename);
let absPath = path.join('https://s3.ca-central-1.amazonaws.com/pieslicer/', filename);
//https://s3.ca-central-1.amazonaws.com/pipsbucket/FracSpellerDecimal.exe
let relPath = path.join('./public/javascripts/downloading', filename); // path relative to server root
console.log(absPath);
res.redirect("https://s3.ca-central-1.amazonaws.com/pieslicer/" + filename);//brute force 2018-09-19
};
