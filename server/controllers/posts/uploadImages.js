var os = require("os");
const fs = require("fs");
const sharp = require("sharp");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

async function uploadImages(req, res) {
  const postID = uuidv4();
  req.session.postID = postID;

  const savePath = "/var/uploads";
  await fs.promises.mkdir(`${savePath}/postImages/${postID}`);

  const imgs = await Promise.all(
    req.body.urls.map(async (base64Data, i) => {
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (!matches) {
        return null;
      }

      const [, type, data] = matches;
      const buffer = Buffer.from(data, "base64");

      // Compress the image using sharp
      const compressedBuffer = await sharp(buffer)
        .jpeg({ quality: 60 })
        .toBuffer();

      await fs.promises.writeFile(
        `${savePath}/postImages/${postID}/${i}.${type.split("/")[1]}`,
        compressedBuffer
      );
      return `${i}.${type.split("/")[1]}`;
    })
  );

  req.session.imgs = imgs.filter((img) => img !== null);
  return res.status(200).send({
    code: 200,
  });
}

module.exports = uploadImages;
