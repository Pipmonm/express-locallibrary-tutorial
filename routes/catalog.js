//catalog js  main router to controller files
var express = require('express');
var router = express.Router();

// Require controller modules.
var application_controller = require('../controllers/applicationController');
var client_controller = require('../controllers/clientController');
var client_request_controller = require('../controllers/clientrequestController');
var appname_controller = require('../controllers/appnameController');
//var client_transaction_controller = require('../controllers/clienttransactionController');

//TESTING Download
var pieSlicer_controller = require('../controllers/pieSlicerController');
var fracSpeller_controller = require('../controllers/fracSpellerController');
var downloadFS_controller = require('../controllers/downloadFSController');//2018-09-24
var downloadPS_controller = require('../controllers/downloadPSController');//ibid
var verification_controller = require('../controllers/verificationController');//2019-01-15

var s3_fs_controller = require('../controllers/fsS3Controller');
var s3_ps_controller = require('../controllers/psS3Controller');

var aboutUs_controller = require('../controllers/aboutUsController');//2019-01-15

var stripe_controller = require('../controllers/stripeController');//2019-02-13 ????

var countrytaxauthority_controller = require('../controllers/countryTaxAuthorityController');//2019-06-06

var regionalauthority_controller = require('../controllers/regionalAuthorityController');//2019-06-17
// GET catalog home page.
//why aboutUsController not found????
router.get('/', application_controller.index);
//2018-10-09  was clientrequest_controller changed to application_controller
//temporary down below i think
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

//tEST DOWNLOAD routes
router.get('/pieSlicer_view',pieSlicer_controller.pieSlicer_view);
router.get('/fracSpeller_view',fracSpeller_controller.fracSpeller_view);

router.get('/verification',verification_controller.verify_start);//2019-01-17 for resetting need a 'start'//2019-01-15
router.get('/nextVerify',verification_controller.verify_view);//2019-01-17 complications require 'start' & 'next' & 'prev'
router.get('/backVerify',verification_controller.verify_back);//2019-01-22
router.get('/about',aboutUs_controller.aboutUs_view);//2019-01-15

router.get('/stripePrePay',stripe_controller.stripePrePay_get);//2019-05-15 payment mode mods
router.post('/stripePrePay',stripe_controller.stripePrePay_post);//2019-05-15 payment mode mods

router.get('/stripePay',stripe_controller.stripeGet);//2019-02-11
router.post('/charge',stripe_controller.stripePost);//2019-02-11 not too sure here


router.get('/downloadPS_view',downloadPS_controller.downloadPS_view);
router.get('/downloadFS_view',downloadFS_controller.downloadFS_view);
router.get('/downloadUSBFS_view',downloadFS_controller.download_USB_FS_view);
router.get('/downloadUSBPS_view',downloadPS_controller.download_USB_PS_view);
router.get('/get_S3_FS',s3_fs_controller.get_S3_FS_file);
router.get('/get_S3_PS',s3_ps_controller.get_S3_PS_file);

//STEP 1 creating client records
router.get('/clients', client_controller.client_list);
//finding what client requests
router.get('/clientprolog', client_controller.client_prolog);
//listing FAQs
router.get('/system_FAQ', appname_controller.appname_list);//replace with FAQ_list
//messaging ClientS
router.get('/clientmessages_in', client_controller.messages_in_get);
router.post('/clientmessages_in', client_controller.messages_in_post);

//STEP 2 service request to create new client_transactions
router.get('/clientcreate', client_controller.client_create_get);
//STEP 2b add client to database
router.post('/clientcreate', client_controller.client_create_post);
//Show client status including license key
router.get('/clientstatus', client_controller.client_status_get);
//lookup client id and display status (via re-routing to client_display)
router.post('/clientstatus', client_controller.client_status_post);
// GET request to delete specific Client
router.get('/client/:id/delete', client_controller.client_delete_get);
// POST process request to delete Client.
router.post('/client/:id/delete', client_controller.client_delete_post);
// GET request to update Client.
router.get('/client/:id/update', client_controller.client_update_get);
// POST reply to update Client.
router.post('/client/:id/update', client_controller.client_update_post);
// GET request for one Client.
router.get('/client/:id', client_controller.client_detail);
//send get for creating new client request
router.get('/clientrequest/create', client_request_controller.clientrequest_create_get);
//POST verify response
router.post('/clientrequest/create', client_request_controller.clientrequest_create_post);
//Get request for one clienrequest.
router.get('/clientrequest/:id', client_request_controller.clientrequest_detail);
//clientrequest delete get
router.get('/clientrequest/:id/delete', client_request_controller.clientrequest_delete_get);
//& accompanying post
router.post('/clientrequest/:id/delete', client_request_controller.clientrequest_delete_post);
// GET request to update Client.
router.get('/clientrequest/:id/update', client_request_controller.clientrequest_update_get);
// POST reply to update Client.
router.post('/clientrequest/:id/update', client_request_controller.clientrequest_update_post);
// GET request for list of all clientrequestInstance.
router.get('/clientrequests', client_request_controller.clientrequest_list);
//generate countrytaxauthority //2019-06-06
router.get('/countrytaxauthoritycreate', countrytaxauthority_controller.countrytaxauthority_create_get); //2019-06-06
router.post('/countrytaxauthoritycreate', countrytaxauthority_controller.countrytaxauthority_create_post); //2019-06-06
//get countrytaxauthority list
router.get('/countrytaxauthorities', countrytaxauthority_controller.countrytaxauthorities_list);
//restriction messages sent to ClientS
router.get('/countrydisallowed', countrytaxauthority_controller.countrytaxauthority_disallowed_msg);
//Canada disallowed on over threshold value
router.get('/canadadisallowed', countrytaxauthority_controller.countrytaxauthority_canada_msg);
//get countrytaxauthority detail by mod_Id
router.get('/countrytaxauthority/:id', countrytaxauthority_controller.countrytaxauthority_detail);
//cntryTA delete and update via url
router.get('/countrytaxauthority/:id/delete', countrytaxauthority_controller.countrytaxauthority_delete_get);
// POST process request to delete Client.
router.post('/countrytaxauthority/:id/delete', countrytaxauthority_controller.countrytaxauthority_delete_post);
// GET request to update countrytaxauthority.
router.get('/countrytaxauthority/:id/update', countrytaxauthority_controller.countrytaxauthority_update_get);
// POST reply to update countrytaxauthority.
router.post('/countrytaxauthority/:id/update', countrytaxauthority_controller.countrytaxauthority_update_post);

//repeat for Regions
router.get('/regionalauthoritycreate', regionalauthority_controller.regionalauthority_create_get); //2019-06-06
router.post('/regionalauthoritycreate', regionalauthority_controller.regionalauthority_create_post); //2019-06-06
//get regionalauthority list
router.get('/regionalauthorities', regionalauthority_controller.regionalauthorities_list);
//region disallowed messages
router.get('/regiondisallowed', regionalauthority_controller.regionalauthority_disallowed_msg);
//get regionalauthority detail by mod_Id
router.get('/regionalauthority/:id', regionalauthority_controller.regionalauthority_detail);
//cntryTA delete and update via url
router.get('/regionalauthority/:id/delete', regionalauthority_controller.regionalauthority_delete_get);
// POST process request to delete Client.
router.post('/regionalauthority/:id/delete', regionalauthority_controller.regionalauthority_delete_post);
// GET request to update regionalauthority.
router.get('/regionalauthority/:id/update', regionalauthority_controller.regionalauthority_update_get);
// POST reply to update regionalauthority.
router.post('/regionalauthority/:id/update', regionalauthority_controller.regionalauthority_update_post);

//generate appname document
// GET request for creating an Appname. NOTE This must come before route that displays Appname (uses id).
router.get('/appname/create', appname_controller.appname_create_get);
//POST request for creating Appname.
router.post('/appname/create', appname_controller.appname_create_post);
// GET request to delete Appname.
router.get('/appname/:id/delete', appname_controller.appname_delete_get);
// POST request to delete Appname.
router.post('/appname/:id/delete', appname_controller.appname_delete_post);
// GET request to update Appname.
router.get('/appname/:id/update', appname_controller.appname_update_get);
// POST request to update Appname.
router.post('/appname/:id/update', appname_controller.appname_update_post);
// GET request for list of all appnameInstance.
router.get('/appnames', appname_controller.appname_list);
// GET request for one Appname.
router.get('/appname/:id', appname_controller.appname_detail);

//send get for creating new client transaction
//router.get('/clienttransaction/create', client_transaction_controller.clienttransaction_create_get);
//POST verify response
//router.post('/clienttransaction/create', client_transaction_controller.clienttransaction_create_post);
//Get transaction for one clientransaction.
//router.get('/clienttransaction/:id', client_transaction_controller.clienttransaction_detail);

module.exports = router;
