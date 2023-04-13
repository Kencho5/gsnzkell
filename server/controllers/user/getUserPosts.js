const { db, userPosts, users } = require("../../utils/db");
const countUserPosts = require('./countUserPosts');

async function getUserPosts(req, res) {
  const email = req.body.email;
  let start = req.body.pageIndex;

  if (start == 1) {
    start = 0;
  } else {
    start = start * 5 - 5;
  }

  var count = await countUserPosts(email);
  userPosts
    .find({
      email: email,
    })
    .skip(parseInt(start))
    .limit(5)
    .sort({ expires: -1 })
    .toArray((err, response) => {
      if (err) {
        res.status(200).send({
          code: 500,
        });
      }

      res.status(200).send({
        code: 200,
        data: response,
        count: count,
      });
    });
}

module.exports = getUserPosts;
