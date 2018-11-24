var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ClientTransactionSchema = new Schema(

  {
    client: { type: Schema.ObjectId, ref: 'Client', required: true }, //reference to the associated clientrequest
    appname: {type: String, required: true, enum: ['PieSlicer','FracSpeller']},
    status: {type: String, required: true, enum: ['pendingPay','validated','canceled','invalid'], default: 'validated'},
    transaction_date: {type: Date, default: Date.now}
  }
);

// Virtual for clientrequestinstance's URL
ClientTransactionSchema
.virtual('url')
.get(function () {
  return '/catalog/clienttransaction/' + this._id;
});

ClientTransactionSchema
.virtual('payment_date_formatted')
.get(function () {
  return moment(this.transaction_date).format();
});

ClientTransactionSchema
.virtual('appname_purchased')
.get(function(){
  return this.appname;
})

//Export model
module.exports = mongoose.model('ClientTransaction', ClientTransactionSchema);
