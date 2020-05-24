const upload = require("../middleware/upload");

const uploadFile = async (req, res) => {
  console.log("@@@ ### entering try for upload of file: ");
  console.log("## req.params.",req.params);
  try {
    for(item in req)console.log("### in controller req.",item);
    if(req.file != undefined){console.log("### @@@ in controller req.file: ",req.file);}else{
      console.log("@@@ in controller req.file undefined!");
    }

    await upload(req, res);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    console.log("@@@ ### file loaded successfully req.file: ",req.file);
    return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = {
  uploadFile: uploadFile
};
