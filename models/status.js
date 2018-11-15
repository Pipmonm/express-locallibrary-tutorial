var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StatusSchema = new Schema(
  {
    name: {type: String, required: true, min: 3, max: 100},
    adherents: {type: String, required: false, max: 250},
  }
);

// Virtual for book's URL
StatusSchema
.virtual('url')
.get(function () {
  return '/catalog/status/' + this._id;
});

//Export model
module.exports = mongoose.model('Status', StatusSchema);
