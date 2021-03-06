

const util = require("util");
const multer = require("multer");
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI || "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb"

//Bind connection to error event (to get notification of connection errors)
//^^^^^^^^^^^^^^^^^^^ end special test ^^^^^^^^^^^^^^^^^^^
//const GridFsStorage = require("multer-gridfs-storage");//({db:db});//2020-05-21 added extra bracket ({db:db})
var uploadFilesMiddleware = util.promisify((req, res)=>{
console.log("@@@ $ in the middleware! & req.params is: ",req.params);
//for(var item in req)console.log("** req.",item);
//const storage = new GridFsStorage({
//################ from somewhere #####################

//const mongoURI = "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb";
//const db = mongoose.createConnection(mongoURI, { useNewUrlParser: true });
//##########################end entry #############################

var storage = require("multer-gridfs-storage")({
  url: "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb", //for cloud need to set to mlab database
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    for(item in req)console.log("### web: fetching filename req.",item);
    const match = ["image/png", "image/jpeg"];
    console.log("@@@ !!! in check file mime type for file: ",file);
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-ALaCarte-${file.originalname}`; //alacarte was bezkoder
      console.log("@@@ !!! not image file! returning filename: ",filename);
      return filename;
    }

    console.log("@@@ !! about to return filename: ",file.originalname);
    return {
      bucketName: "photos",
      filename: `${Date.now()}-ALaCarte-${file.originalname}`
    };
  }
});//end storeImage
console.log("@@@ %% web: entering multer store with req items:");
var item;
//for(item in req)console.log("### web: req.",item);
for(var item in storage)console.log("~~~ web: storage.",item);
if(storage._file != undefined){console.log("@@@ ## web: storage._file: ",storage._file);}else{
  console.log("@@@  web: storage._file undefined");
}
if(storage.db != undefined){console.log("### @@@ web storage.db: ",storage.db);}else{
  console.log("@@@ web: storage.db undefined!");
}
if(storage.connected != undefined){console.log("### @@@ web: storage.connected: ",storage.connected);}else{
  console.log("@@@ web: storage.connected undefined!");
}

var uploadFile = multer({ storage: storage }).single("file");
//var testRun = util.promisify(uploadFile)
uploadFile(); //last mod  attempt to execute upload
// promisify is on the exported function only:::   util.promisify(uploadFile());
});//teminate the mess
//var uploadFilesMiddleware = util.promisify(uploadFile);
//var uploadFilesMiddleware = ()=>console.log("@@@ $%# so long sucker!, typeof storage is: ",typeof storage);
module.exports = uploadFilesMiddleware;
