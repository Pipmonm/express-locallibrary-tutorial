var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var CountryTaxAuthoritySchema = new Schema(

  {
    country_code: { type: String, required: true }, //federal tax authority
    allowed: {type: Boolean, required: true },//currently allowed to sell?
    rate: {type: Number, required: true}, //nominal sales tax rate
    restriction_code:{type: Number, required:true},//0:no restrictions, 1:transaction lim only 2:  amount only 3: both
    transaction_limit: {type: Number, required: true},//# of transactions allowed
    current_count: {type: Number, required: false},//# of transactions during this period
    amount_limit: {type: Number, required:true},//$ limit
    current_amount: {type: Number, required:true},//actual amount amassed
    transaction_period_type: {type: String, required:false},//restart per month,year???
    current_transaction_period: {type: Date, required:false},//which is current period
    transaction_date: {type: Date, default: Date.now}
  }
);

// Virtual for clientrequestinstance's URL
CountryTaxAuthoritySchema
.virtual('url')
.get(function () {
  return '/catalog/countrytaxauthority/' + this._id;
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
