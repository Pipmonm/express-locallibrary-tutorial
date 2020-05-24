const upload = require("../middleware/upload");

const uploadFile = async (req, res) => {
  console.log("@@@ ### web: upload cntroller entering try for upload of file: ");
  console.log("## web: upload controller req.params.",req.params);
  try {
    for(item in req)console.log("### in web: upload controller req.",item);
    if(req.file != undefined){console.log("### @@@ web: in upload controller req.file: ",req.file);}else{
      console.log("@@@ in web: upload controller req.file undefined!");
    }

    await upload(req, res);

    console.log("@@ ## web: upload controller req.file: ",req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    console.log("@@@ ### web: upload controller, file loaded successfully req.file: ",req.file);
    return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = {
  uploadFile: uploadFile
};
