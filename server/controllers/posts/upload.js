const { db, userPosts, users } = require("../../utils/db");
const jwt = require("jsonwebtoken");
const { privateKEY, publicKEY, signOptions } = require("../../models/token");
const { v4: uuidv4 } = require("uuid");
var os = require("os");
const fs = require("fs");
const sharp = require("sharp");
const session = require("express-session");

async function upload(req, res) {
  const token = req.body.user;

  if (!jwt.verify(token, publicKEY, signOptions)) {
    res.status(500).send({
      code: 500,
    });
    return;
  }

  const postID = req.session.postID;
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
    if (balance - (0.15 + form.days * 1.5) >= 0) {
      var updated = await users.findOneAndUpdate(
        {
          email: email,
        },
        {
          $inc: {
            balance: -(0.15 + form.days * 1.5),
          },
        },
        {
          returnDocument: "after",
        }
      );
    } else {
      fs.rm(
        `/var/uploads/postImages/${req.session.postID}`,
        { recursive: true },
        (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Folder deleted successfully");
          }
        }
      );

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
    balance: updated.value.balance.toFixed(2),
    pfp: updated.value.pfp,
  };

  var newToken = jwt.sign(payload, privateKEY, signOptions);

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
    img_path: req.session.imgs,
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

module.exports = upload;
