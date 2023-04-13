const { db, userPosts, users } = require("../../utils/db");

async function editPost(req, res) {
  const details = req.body.details;

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
    res.status(200).send({
      code: 200,
    });
  }

}

module.exports = editPost;

