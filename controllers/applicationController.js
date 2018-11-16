exports.index = function(req, res) {
 let blurb = "<pre style='position:relative; left:50px; color:yellow; background:green; width:650px'> \n" +
   "This site is under development \n" +
   "Viewers are able to see changes as they are implemented.   \n" +
   "There is an ongoing effort to improve the site and turn it into an optimal experience \n" +
   "for teachers, homeschooling  parents and any student who may like a more 'hands-on' \n" +
   "and interactive approach in developing their math proficiency and understanding. \n" +
   "\n" +
   "Stay tuned.</pre>"

 let err = false;

 res.render('index', { title: 'Math For All', error: err, blurb: blurb });
};
