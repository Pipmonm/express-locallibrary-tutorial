var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProblemSchema = new Schema(
  {
    keyCode:{type: String, max: 20, unique: true, required: true},
    answer:{type: String, max: 200, unique: true, required: true},
    hint: {type: String, max: 200, unique: true, required: false},
    example:{type: String, max: 200, unique: true, required: false},
  }
);

ProblemSchema
//virtual for 'status'
.virtual('status')
.get(function(){
  return this.keyCode + ": has hint: " + this.hint.length>0 + "  & example: " + this.example.length > 0;
})

// Virtual for msg's URL
ProblemSchema
.virtual('url')
.get(function () {
  console.log('problem URL is: ' + this._id);
  return '/catalog/Problem/' + this._id ;
});

//Export model
module.exports = mongoose.model('Problem', ProblemSchema);
