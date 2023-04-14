const { db, userPosts, users } = require("../utils/db");

async function home(req, res) {
  var posts = [];
  var vipPosts = [];

  var result = await userPosts
    .find()
    .limit(8)
    .sort({
      $natural: -1,
    })
    .toArray(function (err, results) {
      if (results) {
        results.forEach((result) => {
          posts.push({
            id: result._id,
            email: result.email,
            animal: result.animal,
            breed: result.breed,
            price: result.price,
            age: result.age,
            ageType: result.ageType,
            postType: result.postType,
            date: result.date,
            imgs: result.img_path,
            vip: result.vip,
          });
        });
      }
    });

  var vipResult = await userPosts
    .find({
      vip: true,
    })
    .limit(4)
    .sort({
      expires: -1,
    })
    .toArray(function (err, results) {
      if (results) {
        results.forEach((result) => {
          vipPosts.push({
            id: result._id,
            email: result.email,
            animal: result.animal,
            breed: result.breed,
            price: result.price,
            age: result.age,
            ageType: result.ageType,
            postType: result.postType,
            date: result.date,
            imgs: result.img_path,
            vip: result.vip,
          });
        });
      }
      res.status(200).send({
        code: 200,
        posts: posts,
        vipPosts: vipPosts,
      });
    });
}

module.exports = home;
