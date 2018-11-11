var mongoose = require('mongoose');
var moment = require('moment'); //added  :MOD: 2018-03-08 10:01 AM

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
  {
    first_name: {type: String, max: 100},
    family_name: {type: String, max: 100},
    email_address: {type: String, required: true, max: 100},
    register_request_code: {type: String, required: true, max: 150},
    registration_date: {type: Date},

  }
);

// Virtual for author's full name
ClientSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's URL
ClientSchema
.virtual('url')
.get(function () {
  return '/catalog/client/' + this._id;
});

ClientSchema
.virtual('date_registered')
.get(function () {
  return this.validation_date ? moment(this.validation_date).format('YYYY-MM-DD') : '';
});

ClientSchema
.virtual('licensekey:module')
.get(function () {
  return this.device_key + ':' + this.module_type;
});
//Export model
module.exports = mongoose.model('Client', ClientSchema);
