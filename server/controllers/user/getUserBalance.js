const { db, userPosts, users } = require("../../utils/db");

async function getUserBalance(id) {
  return users.findOne({
    _id: id,
  });
}

module.exports = getUserBalance;
