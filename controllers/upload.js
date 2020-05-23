const upload = require("../middleware/upload");

const uploadFile = async (req, res) => {
  console.log("@@@ ### entering try for upload of file: ");
  for(var item in req)console.log("## req.",item);
  try {
    await upload(req, res);

    console.log("@@@ ### file name requested: ",req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    console.log("@@@ ### file loaded successfully");
    return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = {
  uploadFile: uploadFile
};
