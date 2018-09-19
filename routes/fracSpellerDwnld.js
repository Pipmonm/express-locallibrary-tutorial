var express = require('express');
var router = express.Router();


let fs = require('fs');
let path = require('path');
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
router.get('/', function(req, res, next) {
  //res.send("starting file download")//can only do 1 response and the download is one!
//});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//let myController = (req, res) => {
  let filename = 'FracSpellerDecimal.exe';
  console.log("next for frac dwnld");
  //console.log(__dirname)
  //let absPath = path.join('c:/Users/User/Illustrated/Math-Dev/public/javascripts/downloading', filename);
  let absPath = path.join('https://s3.ca-central-1.amazonaws.com/pipsbucket', filename);
  //https://s3.ca-central-1.amazonaws.com/pipsbucket/FracSpellerDecimal.exe
  let relPath = path.join('./public/javascripts/downloading', filename); // path relative to server root
  console.log(absPath);
  res.redirect("https://s3.ca-central-1.amazonaws.com/pipsbucket" + filename);//brute force 2018-09-19

  //fs.writeFile(absPath, 'File content', (err) => {
    //if (err) {
      //console.log(err);
    //}
    //res.download(absPath, (err) => {
      //if (err) {
        //console.log(err);
      //}
    //});
  //});
});

module.exports = router;
