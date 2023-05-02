const { db, userPosts, users } = require("../../utils/db");
const fs = require("fs");

async function deletePost(req, res) {
  for (let id of req.body.id) {
    userPosts.deleteOne({
      _id: id
    });

    fs.rm(
      `/var/uploads/postImages/${id}`,
      { recursive: true },
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Folder deleted successfully");
        }
      }
    );
  }

  res.status(200).send({
    code: 200,
  });
}

module.exports = deletePost;
