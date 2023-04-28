const session = require("express-session");
const { db, payments } = require("../../utils/db");

async function paymentStatus(req, res) {
  payments.findOne({ paymentId: req.body.paymentId }, (err, payment) => {
    if (err || payment == null) {
      return res.status(200).send({
        code: 404,
      });
    } else {
      return res.status(200).send({
        code: 200,
      });
    }
  });
}

module.exports = paymentStatus;
