var mongoose = require('mongoose');
var moment = require('moment'); //added  :MOD: 2018-03-08 10:01 AM

var Schema = mongoose.Schema;

var ClientSchema = new Schema( //2019-09-26 added forgotten 'new'  ??? //2019-01-30 many modifications
  {
    license_string: {type: String, max: 120, unique: true, required: true}, //2019-01-30 added
    device_id: {type: String, max : 20},
    device_type: {type: String, max : 20},
    format_code: {type: String, max : 20},
    moduleIdVrs: {type: String, max : 50}, //2019-01-30 added
    status: {type: String, max : 40, default:'pending'},
    first_name: {type: String, default: 'first', max: 50}, //defaults added
    family_name: {type: String, default:'last', max: 50},
    //country_id: { type: Schema.Types.ObjectId, ref: 'countrytaxauthority'},
    //ex: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    //2019-09-12 DON'T WORK>>  new possibility, remove quotes from 'ref' attribute, ie  ref: "CountryTaxAuthority" >> Country...
    //country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CountryTaxAuthority', required:true},
    //region_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RegionalAuthority', required:true},
    country: {type: String, max : 64,required:true,default:"Unknown"},//2019-08-16
    tax_region: {type: String, max : 64,required:true,default:"Unknown"},//2019=08-16
    city_address: {type: String, default:'# street,city', max : 100},
    postal_code: {type: String, required:true},
    email_address: {type: String, default: 'xyz@abc.mno', max: 100},
    registration_date: {type: Date, default: Date.now},
    license_key: {type: String, max: 30, default:""},
    return_msgs: {type:[String]},
    test_code: {type:String,max:100,default:"0"}

  }
);

// Virtual for client's full name
ClientSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for client's URL
ClientSchema
.virtual('url')
.get(function () {
  console.log('client URL is: ' + this._id);
  return '/catalog/client/' + this._id;//goes to client_detail
});

ClientSchema
.virtual('sysIdString')
.get(function() {
  return this.device_id + ":" + this.format_code + ":" + this.device_type + ":" + this.moduleIdVrs;
})

ClientSchema
.virtual('date_registered')
.get(function () {
  return this.validation_date ? moment(this.validation_date).format('YYYY-MM-DD') : '';
});


//Export model
module.exports = mongoose.model('Client', ClientSchema);
