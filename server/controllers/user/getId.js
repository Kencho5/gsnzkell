const { db, userPosts, users } = require("../../utils/db");

async function getId(req, res) {
  email = req.body.email;

  users.findOne(
    {
      email: req.body.email,
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
