const { db, userPosts, users } = require("../../utils/db");

async function post(req, res) {
  var postID = req.body.id;

  await incrementViewCount(req, res);

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
          views: result.views
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

function incrementViewCount(req, res, next) {
  const postID = req.body.id;
  const ip = req.ip;
  const viewedPosts = req.cookies.viewedPosts || {};

  if (!viewedPosts[postID]) {
    userPosts.updateOne(
      {
        _id: postID,
      },
      {
        $inc: { views: 1 },
      },
      (err, response) => {
        viewedPosts[postID] = true;
        res.cookie("viewedPosts", viewedPosts, {
          maxAge: 900000,
          httpOnly: true,
        });
        return;
      }
    );
  } else {
    return;
  }
}

module.exports = post;
