const { db, userPosts, users } = require("../../utils/db");

async function getUser(req, res) {
  const id = req.body.id;

  const result = await users.findOne({
    _id: id,
  });

  const payload = {
    username: result.username,
    email: result.email,
    phone: result.phone,
    facebook: result.facebook,
    instagram: result.instagram,
    city: result.city,
    pfp: result.pfp,
  };

  res.status(200).send({
    code: 200,
    data: payload,
  });
}

module.exports = getUser;
