var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var CountryTaxAuthoritySchema = new Schema(

  {
    country: { type: String, required: true }, //federal tax authority
    allowed: {type: Boolean, required: true, },//currently allowed to sell?
    restriction:{type: Number, required:true},//0:no restrictions, 1:transaction lim only 2:  amount only 3: both
    transaction_limit: {type: Number, required: true},//# of transactions allowed
    amount_limit: {type: Number, required:true},//$ limit
    transaction_period: {type: String, required:true},//restart per month,year???
    current_transaction_period: {type: String, required:true},//which is current period
    transaction_date: {type: Date, default: Date.now}
  }
);

// Virtual for clientrequestinstance's URL
CountryTaxAuthoritySchema
.virtual('url')
.get(function () {
  return '/catalog/taxauthority/' + this._id;
});

CountryTaxAuthoritySchema
.virtual('last_transaction_date_formatted')
.get(function () {
  return moment(this.transaction_date).format();
});

CountryTaxAuthoritySchema
.virtual('can_sell')
.get(function(){
  return this.allowed;
})

//Export model
module.exports = mongoose.model('CountryTaxAuthority', CountryTaxAuthoritySchema);
