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
var aboutUs_controller = require('../controllers/aboutUsController');//2019-01-15
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

router.get('/verification',verification_controller.verify_view);//2019-01-15
router.get('/about',aboutUs_controller.aboutUs_view);//2019-01-15

router.get('/downloadPS_view',downloadPS_controller.downloadPS_view);
router.get('/downloadFS_view',downloadFS_controller.downloadFS_view);

//STEP 1 creating client records
router.get('/clients', client_controller.client_list);

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
