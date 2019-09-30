var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessagesInSchema = new Schema(
  {
    license_string: {type: String, required: true, min: 10, max: 100},
    name: {type: String, required: false},
    message: {type: String, required: false, max: 300},
    date: {type: Date, default: Date.now},
    viewed: {type: Boolean, default:false},
    responded: {type: Boolean, required:true, default: false},
    follow_up: {type: Boolean, default:false},
    action:  {type: String, required:false}
  }
);

// Virtual for status's URL
StatusSchema
.virtual('url')
.get(function () {
  return '/catalog/status/' + this._id;
});

//Export model
module.exports = mongoose.model('MessagesIn', MessagesInSchema);