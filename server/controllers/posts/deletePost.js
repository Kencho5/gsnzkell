const { db, userPosts, users } = require("../../utils/db");

async function deletePost(req, res) {
  userPosts.deleteMany({
    _id: { $in: req.body.id },
  });

  res.status(200).send({
    code: 200,
  });
}

module.exports = deletePost;
