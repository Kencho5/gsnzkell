const { db, userPosts, users } = require("../../utils/db");

async function countUserPosts(email) {
  return await userPosts.countDocuments({ email: email });
}

module.exports = countUserPosts;
