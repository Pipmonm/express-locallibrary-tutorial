exports.go_online_GAE = function (req, res) { //2019-02-24 added this controller
//let fs = require('fs');
//let path = require('path');
console.log("@@@ $ transfer to GAE");
let blurb = "<pre style='color:yellow; background:green; width:660px'>\n"+
"Versions of PieSlicer and Fraction Speller are available online on a subscription basis.\n"+
"A limited demo version is accessible from the site.\n"+
"These are accessed by login into the application which initially comes up as a fraction \n"+
"with various option tabs at the bottom.  The PieSlicer & Fraction Speller are accessible \n"+
"by clicking on the 'EXPLORE' tab.   Instructions on how to proceed are given there.\n"+
"&nbsp;"+
"Note that depending on internet speed, an intial page that intorduces these modules may\n"+
"cause a slight 'holdup' of the download process of the modules to the browser."

var subscribing = "<pre style='color:yellow; background:green; width:660px'>\n"+
" While these online versions are in the form of a Google 'Cloud' application\n"+
" getting a subscription for these is done on this site. (cf. 'suscribe')"

var source = "https://mathapp-hrd.appspot.com/"

res.render('GAE_view', { title: "Online Modules",
                                 themeDesc1: blurb,
                                 themeDesc2: downloadPSDesc2,
                                 source: source});
};
