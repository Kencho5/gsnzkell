const { db, userPosts, users } = require("../../utils/db");

async function getId(req, res) {
  const postID = req.body.id;
  
  const { email } = await userPosts.findOne({
    _id: postID
  })

  users.findOne(
    {
      email: email,
    },
    function (err, response) {
      if (response) {
        res.status(200).send({
          code: 200,
          id: response._id,
          pfp: response.pfp,
        });
      } else {
        res.status(200).send({
          code: 500,
        });
      }
    }
  );
}

module.exports = getId;
