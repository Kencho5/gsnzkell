const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

client.connect();
const db = client.db("pender");
const userPosts = db.collection("userPosts");
const users = db.collection("users");

module.exports = {
  db,
  userPosts,
  users,
};
