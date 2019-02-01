var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ClientRequestSchema = Schema(
  {
    appname: {type: String, required: true, max : 20},
    client: { type: Schema.Types.ObjectId, ref: 'Client' }, //reference to the associated clientrequest
    formatCode: {type: String, required: true},
    status: {type: String, required: true},
    moduleIdVrs: {type: String, max : 50}, //2019-01-30 added
    date_entered: {type: Date, default: Date.now}
  }
);

// Virtual for clientrequestinstance's URL
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
