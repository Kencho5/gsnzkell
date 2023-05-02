const { db, userPosts, users } = require("../../utils/db");
const fs = require("fs");

async function deletePost(req, res) {
  userPosts.deleteMany({
    _id: { $in: req.body.id },
  });

  fs.rmdir(`/var/uploads/postImages/${req.body.id}`, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Folder deleted successfully");
    }
  });

  res.status(200).send({
    code: 200,
  });
}

module.exports = deletePost;
