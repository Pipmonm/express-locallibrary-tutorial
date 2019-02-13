//2019-02-13 entirely new module for Stripe Checkout
var express = require('express');
var router = express.Router();

console.log("@@@ $$ not too sure from here");

router.get('/charge',verification_controller.verify_start);
