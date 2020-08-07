const util = require("util");
const mongoose                  = require('mongoose'),
      path                      = require('path'),
      multer                    = require('multer'),
      crypto                    = require('crypto'),
      Grid                      = require('gridfs-stream'),
      GridFsStorage             = require('multer-gridfs-storage');

/*
      //const mongoURI = 'mongodb+srv://caman3874:qwertyuiopaman1234@@amanco-pexfz.mongodb.net/test?retryWrites=true&w=majority';
      const mongoURI = "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb?retryWrites=true&w=majority";
      const promise = mongoose.connect(mongoURI, { useNewUrlParser: true });

      const conn = mongoose.connection;
      let gfs;

      conn.once('open',() => {
        gfs = Grid(conn, mongoose.mongo);
        gfs.collection('photos');
      });
*/

console.log("@@@ $ web: about to go in the middleware!");
var storage = new GridFsStorage({
  //2020-08-07 below was 'url' modded to 'uri' for test
  uri: "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb", //for cloud need to set to mlab database
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    console.log("@@@ executing middleware function at> file: (req, file)");
    for(item in req)console.log("### web: fetching filename req.",item);
    const match = ["image/png", "image/jpeg"];
    console.log("@@@ !!! in check file mime type")
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-ALaCarte-${file.originalname}`; //alacarte was bezkoder
      console.log("@@@ !!! not image file! returning filename: ",filename);
      return filename;
    }

    console.log("@@@ !! about to return filename + date & filename: ", `${file.originalname}` )//2020-07-20 added $etc..
    return {
      bucketName: "photos",
      filename: `${Date.now()}-ALaCarte-${file.originalname}`
    };
  }
});
console.log("@@@ %% entering multer store section, storage.file is: ");

var item;


 for(item in storage)console.log("~~~ web: storage.",item);
 //2020 testing //if(undefined != storage._file){console.log("@@@ ## web: storage._file: ",storage._file);}else{ //}
 if(undefined != storage._file){console.log("@@@ ## web: storage._file: ",storage._file);}else{
  console.log("@@@ web: storage._file undefined");
 }
 if(undefined != storage.db){console.log("### @@@ web: storage.db: ",storage.db);}else{
  console.log("@@@ web: storage.db undefined!");
 }
 if(undefined != storage.connected){console.log("### @@@ web: storage.connected: ",storage.connected);}else{
  console.log("@@@ web: storage.connected undefined!");
 }


var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
