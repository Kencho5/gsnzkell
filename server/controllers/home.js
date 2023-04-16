const { db, userPosts, users } = require("../utils/db");

async function home(req, res) {
  try {
    const posts = await userPosts
      .find()
      .limit(8)
      .sort({ $natural: -1 })
      .toArray();

    const vipPosts = await userPosts
      .find({ vip: true })
      .limit(4)
      .sort({ expires: -1 })
      .toArray();

    const formattedPosts = posts.map(post => ({
      id: post._id,
      email: post.email,
      animal: post.animal,
      breed: post.breed,
      price: post.price,
      age: post.age,
      ageType: post.ageType,
      postType: post.postType,
      date: post.date,
      imgs: post.img_path,
      vip: post.vip,
    }));

    const formattedVipPosts = vipPosts.map(post => ({
      id: post._id,
      email: post.email,
      animal: post.animal,
      breed: post.breed,
      price: post.price,
      age: post.age,
      ageType: post.ageType,
      postType: post.postType,
      date: post.date,
      imgs: post.img_path,
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
