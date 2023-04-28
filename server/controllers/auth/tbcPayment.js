const { db, userPosts, users } = require("../../utils/db");

async function payment(req, res) {
  const amount = req.body.amount;
  const user = req.body.user;


  return res.status(200).send({
    code: 200,
  });
}

module.exports = payment;
