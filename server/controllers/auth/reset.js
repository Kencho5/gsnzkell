const session = require("express-session");
const { db, userPosts, users } = require("../../utils/db");
const { sendEmail } = require("./email");

async function reset(req, res) {
  const email = req.body.email;
  const exists = await users
    .find({
      email: email,
    })
    .next();

  if (!exists) {
    return res.status(200).send({
      code: 404,
    });
  }

  const code = await sendEmail(email);
  req.session.code = code;
  req.session.email = email;

  res.status(200).send({
    code: 200,
  });
}

module.exports = reset;
