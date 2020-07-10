var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

//GET home page. (replacing original above)
router.get('/', function(req, res) {
  res.redirect('/catalog');//now all URLs are directed to the catalog routes/controllers
});

module.exports = router;
