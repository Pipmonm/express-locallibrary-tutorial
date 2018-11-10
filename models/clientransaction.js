var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var DummyTransactionSchema = new Schema(

  {
    dummy: { type: Schema.ObjectId, ref: 'Client', required: true }, //reference to the associated book
    //book: { type: mongoose.ObjectId, ref: 'Book', required: true },
    module: {type: String, required: true, enum: ['PieSlicer','FracSpeller']},
    status: {type: String, required: true, enum: ['pendingPay','validated','canceled','invalid'], default: 'validated'},
    transaction_date: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
DummyTransactionSchema
.virtual('url')
.get(function () {
  return '/catalog/dummyTransaction/' + this._id;
});

DummyTransactionSchema
.virtual('payment_date_formatted')
.get(function () {
  return moment(this.transaction_date).format('MMMM Do, YYYY');
});

DummyTransactionSchema
.virtual('module_purchased')
.get(function(){
  return this.module;
})

//Export model
module.exports = mongoose.model('DummyTransaction', DummyTransactionSchema);
