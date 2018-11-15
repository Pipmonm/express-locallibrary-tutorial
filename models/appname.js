var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppnameSchema = new Schema(
  {
    name: {type: String, required: true, min: 2, max: 100},
    adherents: {type: String, required: false, max: 250},
  }
);

// Virtual for Modul's URL
AppnameSchema
.virtual('url')
.get(function () {
  return '/catalog/appname/' + this._id;
});

//Export model
module.exports = mongoose.model('Appname', AppnameSchema);
