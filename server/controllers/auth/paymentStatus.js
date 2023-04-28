const session = require("express-session");
const { db, userPosts, users } = require("../../utils/db");

async function paymentStatus(req, res) {
  db.payments.findOne(req.body.paymentId, (response, err) => {
    console.log(response);
  });
}

module.exports = paymentStatus;
