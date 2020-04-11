exports.go_online_GAE = function (req, res) { //2019-02-24 added this controller
let fs = require('fs');
let path = require('path');
console.log("@@@ $ transfer to GAE");
//let absPath = path.join('c:/Users/User/Illustrated/Math-Dev/public/javascripts/downloading', filename);

res.redirect("https://mathapp-hrd.appspot.com/");//brute force 2018-09-19
};
