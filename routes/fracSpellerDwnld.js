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
  let filename = 'FracSpellerDecimal.txt';
  console.log("next for frac dwnld");
  //console.log(__dirname)
  let absPath = path.join('c:/Users/User/Illustrated/Math-Dev/public/javascripts/downloading', filename);
  let relPath = path.join('./public/javascripts/downloading', filename); // path relative to server root
  console.log(relPath)

  fs.writeFile(relPath, 'File content', (err) => {
    if (err) {
      console.log(err);
    }
    res.download(absPath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
});

module.exports = router;
