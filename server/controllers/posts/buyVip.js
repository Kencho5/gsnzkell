const jwt = require("jsonwebtoken");
const { db, userPosts, users } = require("../../utils/db");
const { privateKEY, publicKEY, signOptions } = require("../../models/token");
const getUserBalance = require('../user/getUserBalance');

async function buyVip(req, res) {
var postID = req.body.id;
  var days = parseInt(req.body.days);
  var authToken = req.body.authToken;

  var user = jwt.verify(authToken, publicKEY, signOptions);

  if (user) {
    if (days > 0 && days <= 7) {
      user = await getUserBalance(user["id"]);
      if (user.balance - days * 2 >= 0) {
        var updated = await users.findOneAndUpdate(
          {
            _id: user._id,
          },
          {
            $inc: {
              balance: -2,
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
          balance: updated.value.balance.toFixed(2),
          pfp: updated.value.pfp,
        };

        var token = jwt.sign(payload, privateKEY, signOptions);

        await userPosts.updateOne(
          {
            _id: postID,
          },
          {
            $set: {
              vip: true,
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
          message: "Not Enough Balance",
        });
      }
    }
  }
}

module.exports = buyVip;
