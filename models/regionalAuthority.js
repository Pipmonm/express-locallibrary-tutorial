var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var RegionalAuthoritySchema = new Schema(

  {
    _id: new mongoose.Types.ObjectId(),
    region_name: {type: String, required: true},
    region_code:  { type: String, required:true},
    country: {type: String, required:true}, // { type: Schema.ObjectId, ref: 'CountryTaxAuthority', required: true }, //reference to the federal authority
    allowed: {type: Boolean, required: true },//currently allowed to sell?
    harmonized:{type: Boolean, required:true},//2019=08-13 false Xf =  'x + x*GST + x*RST'    true Xf = 'x + x*HST'
    fed_rate: {type: Number, required:true},//2019-08-13 for US  use 0.0
    fed_rate_active: {type: Boolean, required:true, default:false},//2019-08-14 to separate fed & prov thresholds
    reg_rate: {type: Number, required: true, default: 0.08},//2019-08-13 modded, there are prov/states with no sales tax, use 0.0
    restriction_code:{type: Number, required:true,default:2},//strictly Provincial: 0:no restrictions, 1:transaction lim only 2:  amount only 3: both
    transaction_limit: {type: Number, required:true},//# of transactions allowed
    current_count: {type: Number, required: true,default:0},//# of transactions during this period
    amount_limit: {type: Number, required:true,default:29500},//$ limit
    current_year_amount: {type: Number, required:true,default:0},//actual amount amassed THIS YEAR
    previous_years_amounts: {type: Array, required:true,default:[0,0,0]},//record keeping
                                                      //required for tax purposes (confirm with banking records)
    current_quarter_amount: {type: Number, required:true,default:0},//for current quarter
    last_three_quarters_array: {type: Array, required:true,default:[0,0,0]},//for tracking last four quarters (for sales taxes limit)
    current_four_quarters_amount: {type: Number, required:true,default:0},//keep tally of last four quarters
    previous_quarters_amounts: {type: Array, required: true,default:[0,0]},//keep records
    transaction_period_type: {type: String, required:true,default:"quarter"},//restart per month,year???
    for_period_index: {type: Number, required:true,default:0},//to simplify quaters cycling
    transaction_date: {type: Date, default: Date.now},
    attempted: {type:Number, required:true,default:0} //keep track of rejected requests
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
