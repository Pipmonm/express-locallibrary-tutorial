var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessagesInSchema = new Schema(
  {
    license_string: {type: String, required: true, min: 10, max: 100},
    name: {type: String, required: false},
    message: {type: String, required: true, max: 300},
    reply: {type: String, required: false },
    viewed: {type: Boolean, default:false},
    responded: {type: Boolean, default: false},
    follow_up: {type: Boolean, default:false},
    action:  {type: String, default:"inactive"}
  }
);

MessagesInSchema
//virtual for 'status'
.virtual('status')
.get(function(){
  return this.license_string + ":" + this.viewed + ":" + this.responded + ":" + this.follow_up;
})

// Virtual for msg's URL
MessagesInSchema
.virtual('url')
.get(function () {
  return '/catalog/messagesIn/' + this._id;
});

//Export model
module.exports = mongoose.model('MessagesIn', MessagesInSchema);
