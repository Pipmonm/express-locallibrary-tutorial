const express                   = require('express'),
      router                    = express.Router(),
      mongoose                  = require('mongoose'),
      path                      = require('path'),
      multer                    = require('multer'),
      crypto                    = require('crypto'),
      Grid                      = require('gridfs-stream'),
      GridFsStorage             = require('multer-gridfs-storage'),

      Post                      = require('../models/post');

//mucho problemos con multer-gridfs-storage
//tambien con gridfs-stream
//const conn = mongoose.connection;

const mongoURI = "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb";
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });
// Init gfs
let gfs;

conn.once('open', () => {
    console.log("@@@ $#@ web: fileDispContrllr conn.db is: ",conn.db);
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    //gfs.bucket('photos');//??? this is commented out in locallibrary and works, and also in MLab
    gfs.collection('photos'); //was photos.files but doesn't work in locallibray so.... (collection name)
    console.log("@@@ $#@ leaving conn.once");
});

//list all files
exports.images_list = function (req, res) {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        //res.render('indexImages', { files: false });
        res.render('images_list',{files:false});
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('images_list', { files: files });
      }
    });
  }; //end images export

//router.get('/image/:filename',
exports.image_detail = function (req, res) {
    console.log("###  @  in fileDisCntrllr req.params.filename is: ",req.params.filename);
    var fileRecName = req.params.filename;
    fileRecName = fileRecName.slice(1,fileRecName.length-1);
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    //gfs.files.findOne({filename: fileRecName}, (err, file) => {
    //gfs.files.find({}, (err, file) => {
    //gfs.files.findOne({filename:'1588465867728-ALaCarte-finca.jpg'}, (err, file) => {
    //gfs.files.findOne({filename:'1588951412166-ALaCarte-trujillo.png'}, (err, file) => {

        if(!file || file.length === 0){
            return res.status(404).json({err: 'No File Exists'});
        } else {
            console.log("### @@ file is: ",file);
            // Check if is image
            if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
                console.log("### @@@ streaming file to browser");
                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
                //readstream.on('data', (chunk) => {
                   //res.render('image_display', { image: chunk.toString('base64') });
                //})

            } else {
                console.log("@@@ ### err 404, not an image");
                res.status(404).json({err: 'Not an image'});
            }
        }
    });
};

exports.imagefile_get = function(req, res, next) {
  const path = require("path");
    //const home = (req, res) => {
  //  return res.sendFile(path.join(`${__dirname}/../views/index.html`));
//};
  res.render('image_preView',{});
//module.exports = {
  //getHome: home
//};
}//imagefile_get ends

exports.imagefile_post = function(req,res,next) { //NOT USED, goes to upload controller instead

 for(var item of req)console.log("@@@ ### web: from SUBMIT req values: ",req.item);

  const upload = require("../middleware/upload");
  console.log("@@@  !!! web: into imagefile_post");
  //const upload = require("../middleware/upload"),
  //mod form since we are not routing through uploadFile.
  //const uploadFile = async (req, res) => {
  async function storeImage(req,res) {
    //const db = conn;//2020-05-21 added db (2 places) & conn
    try {
      console.log("@@@ $$$ web: in async about to try await upload for req.file", req.file );
      await upload(req, res);

      for(var item of req)console.log("@@@ ### web: post middleware req values: ",req.item);

      if (req.file == undefined) {
        return res.send(`You must select a file.`);
      }

      return res.send(`File has been uploaded.`);
    } catch (error) {
      console.log(error);
      return res.send(`Error when trying to upload image: ${error}`);
    }
  console.log("@@@ $ will exit successfuly if no error follows");
  if (err) { return next(err); }
  }
}//end of imagefile_post
