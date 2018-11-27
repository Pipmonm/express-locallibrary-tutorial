var mongoose = require('mongoose');
var moment = require('moment'); //added  :MOD: 2018-03-08 10:01 AM

var Schema = mongoose.Schema;

var ClientSchema = Schema(
  {
    _id: Schema.Types.ObjectId,
    first_name: {type: String, max: 100},
    family_name: {type: String, max: 100},
    email_address: {type: String, required: true, max: 100},
    registration_date: {type: Date},

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

ClientSchema
.virtual('date_registered')
.get(function () {
  return this.validation_date ? moment(this.validation_date).format('YYYY-MM-DD') : '';
});


//Export model
module.exports = mongoose.model('Client', ClientSchema);
