var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var RegionalAuthoritySchema = new Schema(

  {
    region_name: {type: String, required: true},
    region_code:  { type: String, required:true},
    country: {type: String, required:true}, // { type: Schema.ObjectId, ref: 'CountryTaxAuthority', required: true }, //reference to the federal authority
    allowed: {type: Boolean, required: true },//currently allowed to sell?
    harmonized:{type: Boolean, required:true},//2019=08-13 false Xf =  'x + x*GST + x*RST'    true Xf = 'x + x*HST'
    fed_rate: {type: Number, required:true},//2019-08-13 for US  use 0.0
    fed_rate_active: {type: Boolean, required:false},//2019-08-14 to separate fed & prov thresholds
    reg_rate: {type: Number, required: true},//2019-08-13 modded, there are prov/states with no sales tax, use 0.0
    restriction_code:{type: Number, required:true},//strictly Provincial: 0:no restrictions, 1:transaction lim only 2:  amount only 3: both
    transaction_limit: {type: Number, required:false},//# of transactions allowed
    current_count: {type: Number, required: false},//# of transactions during this period
    amount_limit: {type: Number, required:false},//$ limit
    current_year_amount: {type: Number, required:false},//actual amount amassed THIS YEAR
    previous_years_amounts: {type: Array, required:false},//record keeping
                                                      //required for tax purposes (confirm with banking records)
    current_quarter_amount: {type: Number, required:false},//for current quarter
    last_three_quarters_array: {type: Array, required:false},//for tracking last four quarters (for sales taxes limit)
    current_four_quarters_amount: {type: Number, required:false},//keep tally of last four quarters
    previous_quarters_amounts: {type: Array, required: false},//keep records
    transaction_period_type: {type: String, required:false},//restart per month,year???
    for_period_index: {type: Number, required:false},//to simplify quaters cycling
    transaction_date: {type: Date, default: Date.now},
    attempted: {type:Number, required:false} //keep track of rejected requests
  }//2019-08-14  IMPORTANT changes here must be replicated in reg.AuthorityController (starts line 146)
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
