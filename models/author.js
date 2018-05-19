var mongoose = require('mongoose');
var moment = require('moment'); //added  :MOD: 2018-03-08 10:01 AM

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

AuthorSchema
.virtual('date_of_death_formatted')
.get(function () {
  return this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
});

AuthorSchema
.virtual('date_of_birth_formatted')
.get(function () {
  return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
});

AuthorSchema
.virtual('lifespan')
.get(function() {
  if(this.date_of_death_formatted === ""){
    return this.date_of_birth_formatted + "\xa0\xa0 - \xa0\xa0  ....";     // :MOD: 2018-03-08 10:19 AM
  }else{
    return this.date_of_birth_formatted + '\xa0\xa0 - \xa0\xa0' + this.date_of_death_formatted; // :MOD: 2018-03-08 10:19 AM
  }
});
//Export model
module.exports = mongoose.model('Author', AuthorSchema);
