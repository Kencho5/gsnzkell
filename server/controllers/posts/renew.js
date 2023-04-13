const jwt = require("jsonwebtoken");
const { db, userPosts, users } = require("../../utils/db");
const { privateKEY, publicKEY, signOptions } = require("../../models/token");
const getUserBalance = require('../user/getUserBalance');

async function renew(req, res) {
  var id = req.body.id;
  var authToken = req.body.authToken;
  var user = jwt.verify(authToken, publicKEY, signOptions);

  var { balance } = await getUserBalance(user["id"]);

  if (balance - 0.25 >= 0) {
    var updated = await users.findOneAndUpdate(
      {
        _id: user.id,
      },
      {
        $inc: {
          balance: -0.25,
        },
      },
      {
        returnDocument: "after",
      }
    );

    var payload = {
      id: updated.value._id,
      username: updated.value.username,
      email: updated.value.email,
      phone: updated.value.phone,
      instagram: updated.value.instagram,
      facebook: updated.value.facebook,
      city: updated.value.city,
      balance: updated.value.balance,
      pfp: updated.value.pfp,
    };

    var token = jwt.sign(payload, privateKEY, signOptions);

    await userPosts.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        },
      }
    );

    res.status(200).send({
      code: 200,
      token: token,
    });
  } else {
    res.status(200).send({
      code: 500,
      message: "Not Enought Balance",
    });
  }
}

module.exports = renew;
