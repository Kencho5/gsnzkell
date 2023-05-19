const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { db, userPosts, users } = require("../../utils/db");

function register(req, res) {
  if (req.body.code != req.session.code) {
    return res.status(200).send({
      code: 400,
      message: "Incorret Code",
    });
  }

  users.findOne({ email: req.body.data.email }, (err, response) => {
    if (response) {
      res.status(200).send({
        code: 500,
        message: "Email Already In Use.",
      });
    } else {
      bcrypt.hash(req.body.data.password, 10, (errorHash, hash) => {
        const data = {
          _id: uuidv4(),
          email: req.body.data.email,
          username: req.body.data.name,
          phone: req.body.data.phoneNumber,
          city: req.body.data.city,
          password: hash,
          balance: 0,
          freeUpload: true,
          pfp: 'assets/images/default_pfp.png'
        };

        users.insertOne(data, (err, result) => {
          if (result) {
            res.status(200).send({
              code: 200,
              message: "Successfully Registered!",
            });
          } else {
            res.status(200).send({
              code: 500,
              message: "Internal Server Error!",
            });
          }
        });
      });
    }
  });
}

module.exports = register;
