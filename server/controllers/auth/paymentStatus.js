const session = require("express-session");
const { db, users, payments } = require("../../utils/db");
const jwt = require("jsonwebtoken");
const { privateKEY, signOptions } = require("../../models/token");

async function paymentStatus(req, res) {
  const email = req.body.email;

  payments.findOne(
    { merchantId: req.body.merchantPaymentId },
    async (err, payment) => {
      if (err || payment == null) {
        return res.status(200).send({
          code: 404,
        });
      } else {
        await users.findOne({ email }, (err, responseDB) => {
          const payload = {
            id: responseDB._id,
            username: responseDB.username,
            email,
            phone: responseDB.phone,
            instagram: responseDB.instagram,
            facebook: responseDB.facebook,
            city: responseDB.city,
            balance: (responseDB.balance / 100).toFixed(2),
            freeUpload: responseDB.freeUpload,
            pfp: responseDB.pfp,
          };

          const balance = responseDB.balance.toFixed(2);
          const token = jwt.sign(payload, privateKEY, signOptions);

          return res.status(200).send({
            code: 200,
            token: token,
            balance: balance,
          });
        });
      }
    }
  );
}

module.exports = paymentStatus;
