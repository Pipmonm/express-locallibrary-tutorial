//catalog js  main router to controller files
var express = require('express');
var router = express.Router();

// Require controller modules.
var application_controller = require('../controllers/applicationController');
var author_controller = require('../controllers/authorController');
var client_controller = require('../controllers/clientController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');
var client_request_controller = require('../controllers/clientrequestController');
var appname_controller = require('../controllers/appnameController');
console.log('what am I a piece of shit?')
//var client_transaction_controller = require('../controllers/clienttransactionController');

//TESTING Download
var pieSlicer_controller = require('../controllers/pieSlicerController');
var fracSpeller_controller = require('../controllers/fracSpellerController');
var downloadFS_controller = require('../controllers/downloadFSController');//2018-09-24
var downloadPS_controller = require('../controllers/downloadPSController');//ibid
/// BOOK ROUTES ///
var book_controller = require('../controllers/bookController');//rquired for now
// GET catalog home page.
router.get('/', application_controller.index);
//2018-10-09  was book_controller changed to application_controller
//temporary down below i think
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

//tEST DOWNLOAD routes
router.get('/pieSlicer_view',pieSlicer_controller.pieSlicer_view);
router.get('/fracSpeller_view',fracSpeller_controller.fracSpeller_view);

router.get('/downloadPS_view',downloadPS_controller.downloadPS_view);
router.get('/downloadFS_view',downloadFS_controller.downloadFS_view);

//STEP 1 creating client records
router.get('/clients', client_controller.client_list);

//STEP 2 service request to create new client_transactions
router.get('/clientcreate', client_controller.client_create_get);

//STEP 2b add client to database
router.post('/clientcreate', client_controller.client_create_post);
// GET request to delete specific Client
router.get('/client/:id/delete', client_controller.client_delete_get);
// POST process request to delete Client.
router.post('/client/:id/delete', client_controller.client_delete_post);
// GET request to update Client.
router.get('/client/:id/update', client_controller.client_update_get);
// POST reply to update Client.
router.get('/client/:id/update', client_controller.client_update_post);
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
router.get('/clientrequest/:id/delete', client_request_controller.clientrequest_delete_post);
// GET request to update Client.
router.get('/clientrequest/:id/update', client_request_controller.clientrequest_update_get);
// POST reply to update Client.
router.get('/clientrequest/:id/update', client_request_controller.clientrequest_update_post);
// GET request for list of all BookInstance.
router.get('/clientrequests', client_request_controller.clientrequest_list);
//generate appname document
// GET request for creating an Appname. NOTE This must come before route that displays Appname (uses id).
router.get('/appname/create', appname_controller.appname_create_get);

//POST request for creating Genre.
router.post('/appname/create', appname_controller.appname_create_post);


//send get for creating new client transaction
//router.get('/clienttransaction/create', client_transaction_controller.clienttransaction_create_get);
//POST verify response
//router.post('/clienttransaction/create', client_transaction_controller.clienttransaction_create_post);
//Get transaction for one clientransaction.
//router.get('/clienttransaction/:id', client_transaction_controller.clienttransaction_detail);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

// GET request for creating Author. (send form to client) NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author. (checking client filled form)
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance.
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router;
