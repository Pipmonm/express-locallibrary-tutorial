//client instance controller js
var Client = require('../models/client');
var ClientRequest = require('../models/clientrequest');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment'); //added  :MOD: 2018-03-15 4:56 PM

var debug = require('debug');

// Display list of all ClientRequests.
exports.clientrequest_list = function(req, res, next) {
  console.log('@@@ $ at clientrequest_list');
  ClientRequest.find({}) //was   ({}),'status'
    .populate({
       path:'clients',
       model:'Client'})  //have attempted 'Client' & others
    .exec(function (err, clientrequests) {
      console.log("@@@ $ executing callback for ClntRqst list; if err> : " + err );
      if (err) { return next(err); }
      console.log('@@@ $ found clientrequests as per: ');
      console.log(clientrequests);
      res.render('clientrequest_list', { title: 'Client Request List', clientrequest_list: clientrequests });
    });

};
