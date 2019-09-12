var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var CountryTaxAuthoritySchema = new Schema(

  {
    _id: new mongoose.mongo.ObjectId(),
    country_name: {type: String, required: true },
    country_code: { type: String, required: true }, //federal tax authority
    allowed: {type: Boolean, required: true },//currently allowed to sell?
    rate: {type: Number, required: true}, //nominal sales tax rate
    restriction_code:{type: Number, required:true},//0:no restrictions, 1:transaction lim only 2:  amount only 3: both
    transaction_limit: {type: Number, required: true},//# of transactions allowed
    current_count: {type: Number, required: false, default:0},//# of transactions during this period
    amount_limit: {type: Number, required:true},//$ limit
    current_year_amount: {type: Number, required:true, default:0},//actual amount amassed THIS  YEAR
    previous_years_amounts: [{type: Number, required:true, default:[0,0,0]}],//record keeping
                                                      //required for tax purposes (confirm with banking records)
    current_quarter_amount: {type: Number, required:true, default:0},//for current quarter
    last_three_quarters_array: [{type: Number, required:true, default:[0,0,0]}],//for tracking last four quarters (for sales taxes limit)
    current_four_quarters_amount: {type: Number, required:true, default:0},//keep tally of last four quarters
    previous_quarters_amounts: [{type: Number, required: true, default:[0,0]}],//keep records
    transaction_period_type: {type: String, required:true,default:"quarter"},//restart per month,year???
    for_period_index: {type: Number, required:true, default:0},//to simplify quaters cycling
    transaction_date: {type: Date, default: Date.now},
    attempted: {type:Number, required:false, default:0} //keep track of rejected requests
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
