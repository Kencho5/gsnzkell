const { db, userPosts, users } = require("../../utils/db");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { privateKEY, publicKEY, signOptions } = require("../../models/token");

async function deletePost(req, res) {
  const token = req.body.token;
  const { email } = jwt.verify(token, publicKEY, signOptions);

  for (let id of req.body.id) {
    const result = await userPosts.findOne({
      _id: id,
    });

    if (result.email != email) {
      return res.status(200).send({
        code: 500,
      });
    }
    userPosts.deleteOne({
      _id: id,
    });

    fs.rm(`/var/uploads/postImages/${id}`, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  return res.status(200).send({
    code: 200,
  });
}

module.exports = deletePost;
