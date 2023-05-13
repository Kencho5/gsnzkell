const session = require("express-session");
const { db, userPosts, users } = require("../../utils/db");
const { sendEmail } = require("./email");

function confirmEmail(req, res) {
  const email = req.body.email;

  const exists = users
    .find({
      email: email,
    })
    .next()
    .then((exists) => {
      if (exists) {
        return res.status(200).send({
          code: 404,
        });
      }

      return sendEmail(email);
    })
    .then((code) => {
      req.session.code = code;
      req.session.email = email;

      res.status(200).send({
        code: 200,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    });
}

module.exports = confirmEmail;
