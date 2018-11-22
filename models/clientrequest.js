var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ClientRequestSchema = new Schema(

  {
    appname: {type: String, required: true},
    client: { type: Schema.ObjectId, ref: 'Client', required: true }, //reference to the associated book
    formatCode: {type: String, required: true},
    status: {type: String, required: true},
    date_entered: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
ClientRequestSchema
.virtual('url')
.get(function () {
  return '/catalog/clientrequest/' + this._id;
});

ClientRequestSchema
.virtual('request_date')
.get(function () {
  return moment(this.date_entered).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('ClientRequest', ClientRequestSchema);
