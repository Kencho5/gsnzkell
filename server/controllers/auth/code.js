const session = require("express-session");
const { db, userPosts, users } = require("../../utils/db");
const bcrypt = require("bcrypt");

async function code(req, res) {
  const serverCode = req.session.code;
  const userCode = req.body.code;
  const password = req.body.password;

  if (parseInt(serverCode) === parseInt(userCode)) {
    bcrypt.hash(password, 10, (errorHash, hash) => {
      users.updateOne(
        {
          email: req.session.email,
        },
        {
          $set: {
            password: hash,
          },
        }
      );

      req.session.destroy();
      res.status(200).send({
        code: 200,
      });
    });
  } else {
    res.status(200).send({
      code: 500,
    });
  }
}

module.exports = code;
