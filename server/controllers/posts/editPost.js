const { db, userPosts, users } = require("../../utils/db");
const jwt = require("jsonwebtoken");
const { privateKEY, publicKEY, signOptions } = require("../../models/token");

async function editPost(req, res) {
  const token = req.body.token;
  const { email } = jwt.verify(token, publicKEY, signOptions);

  const details = req.body.details;

  const auth = await userPosts.findOne({
    _id: details.id,
  });

  if (auth.email != email) {
    return res.status(200).send({
      code: 500,
    });
  }

  const result = await userPosts.updateOne(
    { _id: details.id },
    {
      $set: {
        breed: details.breed,
        price: details.price,
        description: details.description,
        city: details.city,
        phone: details.phone,
      },
    }
  );

  if (result.acknowledged === true) {
    return res.status(200).send({
      code: 200,
    });
  }
}

module.exports = editPost;
