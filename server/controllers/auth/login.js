const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db, userPosts, users } = require("../../utils/db");
const { privateKEY, publicKEY, signOptions } = require("../../models/token");

async function login(req, res) {
  const { email, password } = req.body;

  users.findOne({ email }, async (err, responseDB) => {
    if (responseDB) {
      const result = await bcrypt.compare(password, responseDB.password);
      if (result) {
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
        const token = jwt.sign(payload, privateKEY, signOptions);

        res.status(200).send({
          status: 200,
          message: "Successfully Logged In!",
          token,
        });
      } else {
        res.status(200).send({
          status: 500,
        });
      }
    } else {
      res.status(200).send({
        status: 500,
      });
    }
  });
}

module.exports = login;
