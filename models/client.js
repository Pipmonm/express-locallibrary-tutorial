var mongoose = require('mongoose');
var moment = require('moment'); //added  :MOD: 2018-03-08 10:01 AM

var Schema = mongoose.Schema;

var ClientSchema = Schema(
  {
    device_id: {type: String, max : 100, unique : true, required : true, dropDups: true },
    device_type: {type: String, max : 20},
    format_code: {type: String, max : 20},
    status: {type: String, max : 40, default:'pending'},
    first_name: {type: String, max: 100},
    family_name: {type: String, max: 100},
    email_address: {type: String, required: true, max: 100},
    registration_date: {type: Date},
    license_string: {type: String, max: 100, default:""},
    license_key: {type: String, max: 30, default:""}

  }
);

// Virtual for client's full name
ClientSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for client's URL
ClientSchema
.virtual('url')
.get(function () {
  console.log('client URL is: ' + this._id);
  return '/catalog/client/' + this._id;
});

ClientRequestSchema
.virtual('sysIdString')
.get(function() {
  return this.device_id + ":" + this.format_code + ":" + this.device_type;
})

ClientSchema
.virtual('date_registered')
.get(function () {
  return this.validation_date ? moment(this.validation_date).format('YYYY-MM-DD') : '';
});


//Export model
module.exports = mongoose.model('Client', ClientSchema);
