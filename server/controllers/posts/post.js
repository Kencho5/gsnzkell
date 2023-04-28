const { db, userPosts, users } = require("../../utils/db");

async function post(req, res) {
    var postID = req.body.id;

  userPosts.findOne(
    {
      _id: postID,
    },
    function (err, result) {
      if (result) {
        var data = {
          id: result._id,
          email: result.email,
          name: result.name,
          phone: result.phone,
          animal: result.animal,
          breed: result.breed,
          price: result.price,
          ageYears: result.ageYears,
          ageMonths: result.ageMonths,
          description: result.description,
          postType: result.postType,
          date: result.date,
          imgs: result.img_path,
          vip: result.vip,
          city: result.city,
        };

        res.status(200).send({
          code: 200,
          data: data,
        });
      } else {
        res.status(200).send({
          code: 500,
        });
      }
    }
  );
}

module.exports = post;
