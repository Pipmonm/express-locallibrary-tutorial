var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var RegionalAuthoritySchema = new Schema(

  {
    region_name: {type: String, required: true},
    region_code:  { type: String, required:true},
    country: {type: String, required:true}, // { type: Schema.ObjectId, ref: 'CountryTaxAuthority', required: true }, //reference to the federal authority
    allowed: {type: Boolean, required: true },//currently allowed to sell?
    rate: {type: Number, required: true},
    restriction_code:{type: Number, required:true},//0:no restrictions, 1:transaction lim only 2:  amount only 3: both
    transaction_limit: {type: Number, required:false},//# of transactions allowed
    current_count: {type: Number, required: false},//# of transactions during this period
    amount_limit: {type: Number, required:false},//$ limit
    current_amount: {type: Number, required:false},//actual amount amassed
    transaction_period_type: {type: String, required:true},//restart per month,year???
    current_transaction_period: {type: String, required:true},//which is current period
    transaction_date: {type: Date, default: Date.now},
    attempted: {type:Number, required:true} //keep track of rejected requests
  }
);

// Virtual for clientrequestinstance's URL
RegionalAuthoritySchema
.virtual('url')
.get(function () {
  return '/catalog/regionalauthority/' + this._id;
});

RegionalAuthoritySchema
.virtual('last_transaction_date_formatted')
.get(function () {
  return moment(this.transaction_date).format();
});

RegionalAuthoritySchema
.virtual('can_sell')
.get(function(){
  return this.allowed;
})

//Export model
module.exports = mongoose.model('RegionalAuthority', RegionalAuthoritySchema);
