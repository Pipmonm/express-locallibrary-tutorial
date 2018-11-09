var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ClientTransactionSchema = new Schema(

  {
    book: { type: Schema.ObjectId, ref: 'Client', required: true }, //reference to the associated book
    //book: { type: mongoose.ObjectId, ref: 'Book', required: true },
    module: {type: String, required: true, enum: ['PieSlicer';'FracSpeller']},
    status: {type: String, required: true, enum: ['Pending', 'Refused', 'Validated'], default: 'Validated'},
    transaction_date: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
ClientTransactionSchema
.virtual('url')
.get(function () {
  return '/catalog/clienttransaction/' + this._id;
});

ClientTransactionSchema
.virtual('payment_date')
.get(function () {
  return moment(this.due_back).format('MMMM Do, YYYY');
});

ClientTransactionSchema
.virtual('module_purchased')
.get(function(){
  return this.module;
})

//Export model
module.exports = mongoose.model('ClientTransaction', ClientTransactionSchema);
