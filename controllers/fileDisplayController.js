const express                   = require('express'),
      router                    = express.Router(),
      mongoose                  = require('mongoose'),
      path                      = require('path'),
      multer                    = require('multer'),
      crypto                    = require('crypto'),
      Grid                      = require('gridfs-stream'),
      GridFsStorage             = require('multer-gridfs-storage'),

      Post                      = require('../models/post');

const conn = mongoose.connection;
const mongoURI = "mongodb://localhost:27017/my_database";

// Init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    //gfs.bucket('photos');//???
    gfs.collection('photos'); //was photos.files but doesn't work so.... (collection name)
});

//list all files
exports.images_list = function (req, res) {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('index', { files: false });
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
