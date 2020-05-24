const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

console.log("@@@ $ in the middleware!");
var storage = new GridFsStorage({
  url: "mongodb://localhost:27017/my_database", //for cloud need to set to mlab database
  //options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    for(item in req)console.log("### web: fetching filename req.",item);
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

var item;


 for(var item in storage)console.log("~~~ web: storage.",item);
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
