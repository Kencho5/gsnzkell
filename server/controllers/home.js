const { db, userPosts, users } = require("../utils/db");

async function home(req, res) {
  try {
    const posts = await userPosts
      .find()
      .limit(6)
      .sort({ $natural: -1 })
      .toArray();

    const vipPosts = await userPosts
      .find({ vip: true })
      .limit(3)
      .sort({ expires: -1 })
      .toArray();

    const formattedPosts = posts.map(post => ({
      _id: post._id,
      email: post.email,
      animal: post.animal,
      breed: post.breed,
      price: post.price,
      gender: post.gender.toLowerCase(),
      ageYears: post.ageYears,
      ageMonths: post.ageMonths,
      postType: post.postType,
      date: post.date,
      img_path: post.img_path,
      vip: post.vip,
    }));

    const formattedVipPosts = vipPosts.map(post => ({
      _id: post._id,
      email: post.email,
      animal: post.animal,
      breed: post.breed,
      price: post.price,
      ageYears: post.ageYears,
      ageMonths: post.ageMonths,
      postType: post.postType,
      date: post.date,
      img_path: post.img_path,
      vip: post.vip,
    }));

    res.status(200).send({
      code: 200,
      posts: formattedPosts,
      vipPosts: formattedVipPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, message: 'Internal server error' });
  }
}
module.exports = home;
