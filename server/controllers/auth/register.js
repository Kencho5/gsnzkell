const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { db, userPosts, users } = require("../../utils/db");

function register(req, res) {
  if (req.body.code != req.session.code) {
    return res.status(200).send({
      code: 400,
      message: "Incorret Code",
    });
  }

  users.findOne({ email: req.body.email }, (err, response) => {
    if (response) {
      res.status(200).send({
        code: 500,
        message: "Email Already In Use.",
      });
    } else {
      bcrypt.hash(req.body.password, 10, (errorHash, hash) => {
        const data = {
          _id: uuidv4(),
          email: req.body.email,
          username: req.body.name,
          phone: req.body.phoneNumber,
          city: req.body.city,
          password: hash,
          balance: 0,
          freeUpload: true,
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
