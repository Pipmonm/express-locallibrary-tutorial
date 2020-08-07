var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProblemSchema = new Schema(
  {
    keyCode:{type: String, max: 64, unique: true, required: true},
    other:{type: String, max: 64, unique: false, required:false},
    grade:{type: String, max:32,unique:false,required:false},
    pageNumber:{type: String, max: 4, unique:false,required:false},
    problemNumber:{type: String, max: 4, unique:false,required:false},
    subSection:{type: String, max: 4, unique:false, required:false},
    answer:{type: String, max: 200, unique: false, required: false},
    hint: {type: String, max: 200, unique: false, required: false},
    example:{type: String, max: 200, unique: false, required: false},
  }
);

ProblemSchema
//virtual for 'status'
.virtual('status')
.get(function(){
  return this.keyCode + ": has hint: " + this.hint.length>0 + "  & example: " + this.example.length > 0;
})

ProblemSchema
//concatenated problem name
.virtual('problem_name')
.get(function(){
  var useName = this.grade;
  if(useName == 'other')useName = this.other;
  var pString = "Problem-" + useName + "  pg #:" + this.pageNumber + "  prob. #:" + this.problemNumber + "  part:" + this.subSection;
  console.log("@@@ ## showing problem name: ",pString);
  return pString;
});

// Virtual for msg's URL
ProblemSchema
.virtual('url')
.get(function () {
  console.log('problem URL is: ' + this._id);
  return '/catalog/specificproblem/' + this._id ;
});

//Export model
module.exports = mongoose.model('Problem', ProblemSchema);
