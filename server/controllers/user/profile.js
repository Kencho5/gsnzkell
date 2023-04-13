const { db, userPosts, users } = require("../../utils/db");
const countUserPosts = require("./countUserPosts");

async function profile(req, res) {
  var email = req.body.email;
  var start = req.body.pageIndex;
  var sortType = req.body.sort;

  var sort = {
    expires: -1,
  };
  if (sortType) {
    switch (sortType) {
      case "expiresDesc":
        sort = {
          expires: -1,
        };
        break;
      case "expiresAsc":
        sort = {
          expires: 1,
        };
        break;
      case "dateDesc":
        sort = {
          date: -1,
        };
        break;
      case "dateAsc":
        sort = {
          date: 1,
        };
        break;
    }
  }

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
    .sort(sort)
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

module.exports = profile;
