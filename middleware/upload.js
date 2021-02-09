const util = require("util");
const multer = require("multer");
//################### special test ######################
//Import the mongoose module
var mongoose = require('mongoose');
//2020-11-30 changed to environment variable below; var mongoDB = process.env.MONGODB_URI || "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb"
//mongoDB definition above to check out why environment variable set below (with heroku set config) doesn't work!
//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/my_database';//ORIGINAL DB connection
var mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1/my_database';//2018=05-19 default to local if online not available
//const options = {server: {socketOptions: {keepAlive: 1}},
const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true
};
mongoose.connect(mongoDB, options);//20-07-2020 modded to add options parameter
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
//var db = mongoose.connection;
const mongoURI = process.env.MONGODB_URI;//2020-11-30  new attempt with original code
const db = mongoose.createConnection(mongoURI, { useNewUrlParser: true });
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//^^^^^^^^^^^^^^^^^^^ end special test ^^^^^^^^^^^^^^^^^^^
const GridFsStorage = require("multer-gridfs-storage");//({db:db});//2020-05-21 added extra bracket ({db:db})

console.log("@@@ $ in the middleware!");
var storage = new GridFsStorage({
  //url: "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb", //for cloud need to set to mlab database
  url: process.env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    console.log("@@@ !!! in check file mime type")
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-ALaCarte-${file.originalname}`; //alacarte was bezkoder
      console.log("@@@ !!! not image file! returning filename: ",filename);
      return filename;
    }

    console.log("@@@ !! about to return filename + date " )
    return {
      bucketName: "photos",
      filename: `${Date.now()}-ALaCarte-${file.originalname}`
    };
  }
});
console.log("@@@ %% entering multer store section");
var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
