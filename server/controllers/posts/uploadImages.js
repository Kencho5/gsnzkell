const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");

const accessKey = "006c7cc7-e193-46a4-aefa47983831-16e1-43f1";

async function uploadImages(req, res) {
  const postID = req.body.postID;
  const files = req.files;

  const promises = files.map(async (file) => {
    const fileName = file.originalname;
    const fileContent = await sharp(file.path)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer();
    const checksum = crypto
      .createHash("sha256")
      .update(fileContent)
      .digest("hex")
      .toUpperCase();

    const options = {
      method: "PUT",
      url: `https://storage.bunnycdn.com/pender/postImages/${postID}/${fileName}`,
      headers: {
        AccessKey: accessKey,
        Checksum: checksum,
      },
      data: fileContent,
    };

    return axios(options);
  });

  try {
    await Promise.all(promises);
    res.send("Files uploaded successfully");
  } catch (err) {
    console.error("File upload failed:", err);
    res.status(500).send("File upload failed");
  }
}

module.exports = uploadImages;
