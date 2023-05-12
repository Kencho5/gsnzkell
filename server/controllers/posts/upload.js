const { db, userPosts, users } = require("../../utils/db");
const jwt = require("jsonwebtoken");
const { privateKEY, publicKEY, signOptions } = require("../../models/token");
const { v4: uuidv4 } = require("uuid");
var os = require("os");
const fs = require("fs");
const sharp = require("sharp");

async function upload(req, res) {
  const token = req.body.user;

  if (!jwt.verify(token, publicKEY, signOptions)) {
    res.status(500).send({
      code: 500,
    });
    return;
  }

  const postID = uuidv4();
  const { email, username } = jwt.verify(token, publicKEY, signOptions);
  const form = req.body.form;

  if (!form.days) {
    form.days = 0;
  }

  const vip = form.days > 0;
  const vipExpires = vip
    ? new Date(Date.now() + form.days * 24 * 60 * 60 * 1000)
    : null;

  const user = await users
    .find({
      email: email,
    })
    .next();
  const freeUpload = user["freeUpload"];
  const balance = user["balance"];

  if (freeUpload) {
    var updated = await users.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          freeUpload: false,
        },
      },
      {
        returnDocument: "after",
      }
    );
  } else {
    if (balance - (15 + form.days * 150) >= 0) {
      var updated = await users.findOneAndUpdate(
        {
          email: email,
        },
        {
          $inc: {
            balance: -(15 + form.days * 150),
          },
        },
        {
          returnDocument: "after",
        }
      );
    } else {
      return res.status(200).send({
        code: 402,
      });
    }
  }
  var payload = {
    id: updated.value._id,
    username: updated.value.username,
    email: updated.value.email,
    phone: updated.value.phone,
    instagram: updated.value.instagram,
    facebook: updated.value.facebook,
    city: updated.value.city,
    balance: (updated.value.balance / 100).toFixed(2),
    pfp: updated.value.pfp,
  };

  var newToken = jwt.sign(payload, privateKEY, signOptions);

  const imgs = await saveImages(postID, req);

  const data = {
    _id: postID,
    email,
    name: username,
    animal: form.animal,
    breed: form.breed,
    price: parseInt(form.price),
    ageYears: parseInt(form.ageYears),
    ageMonths: parseInt(form.ageMonths),
    description: form.description,
    postType: form.postType,
    phone: form.phone,
    date: new Date(),
    img_path: imgs,
    city: form.city,
    vip: vip,
    expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    views: 0,
  };

  if (vipExpires) {
    data.vipExpires = vipExpires;
  }

  userPosts.insertOne(data, function (err, result) {
    if (result) {
      res.status(200).send({
        code: 200,
        id: postID,
        token: newToken,
      });
    } else {
      res.status(500).send({
        code: 500,
      });
    }
  });
}

async function saveImages(postID, req) {
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

      // Compress and resize the image using sharp
      const compressedBuffer = await sharp(buffer)
        // .resize({ width: 800 })
        .jpeg({ quality: 85 })
        .toBuffer();

      await fs.promises.writeFile(
        `${savePath}/postImages/${postID}/${i}.${type.split("/")[1]}`,
        compressedBuffer
      );
      return `${i}.${type.split("/")[1]}`;
    })
  );

  return imgs.filter((img) => img !== null);
}
module.exports = upload;
