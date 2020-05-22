const util = require("util");
const multer = require("multer");

//Bind connection to error event (to get notification of connection errors)
//^^^^^^^^^^^^^^^^^^^ end special test ^^^^^^^^^^^^^^^^^^^
const GridFsStorage = require("multer-gridfs-storage");//({db:db});//2020-05-21 added extra bracket ({db:db})

console.log("@@@ $ in the middleware!");
var storage = new GridFsStorage({
//var storage = require("multer-gridfs-storage")({
  url: "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb", //for cloud need to set to mlab database
  //options: { useNewUrlParser: true, useUnifiedTopology: true },
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
console.log("@@@ %% entering multer store section & storage items are:");
for(var item in storage)console.log("###list storage.",item);
var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
