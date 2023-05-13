const { db, userPosts, users } = require("../../utils/db");
const jwt = require("jsonwebtoken");
const { privateKEY, publicKEY, signOptions } = require('../../models/token');
const fs = require("fs");

async function update(req, res) {
  const {
    id,
    data: { name: username, email, phone, city, facebook, instagram },
    old_email,
    pfp,
    balance,
  } = req.body;

  const user = jwt.verify(req.body.token, publicKEY, signOptions);

  const auth = await users.findOne({
    _id: id,
  });

  if (auth.email != user.email) {
    return res.status(200).send({
      code: 500,
    });
  }

  var pfpSet = req.body.pfpSet;

  if (pfp) {
    savePfp(pfp, id);
    pfpSet = true;
  }

  users.updateOne(
    { email: old_email },
    {
      $set: {
        email,
        username,
        phone,
        city,
        facebook,
        instagram,
        pfp: pfpSet,
      },
    }
  );

  const payload = {
    id,
    username,
    email,
    phone,
    facebook,
    instagram,
    city,
    balance,
    pfp: pfpSet,
  };

  const token = jwt.sign(payload, privateKEY, signOptions);

  res.status(200).send({
    code: 200,
    token: token,
  });
}

function savePfp(pfp, id) {
  const savePath = '/var/uploads';

  const base64Data = pfp;

  // Extract the image type and base64 data from the string
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches) {
    console.error("Invalid base64 string");
    return;
  }

  const type = matches[1];
  const data = Buffer.from(matches[2], "base64");

  fs.writeFile(`${savePath}/user-pfps/${id}.jpg`, data, "base64", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

module.exports = update;
