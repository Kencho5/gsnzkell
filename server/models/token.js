const fs = require("fs");

const privateKEY = fs.readFileSync("./utils/private.key");
const publicKEY = fs.readFileSync("./utils/public.key");

var i = "Pender corp"; // Issuer
var s = "some@user.com"; // Subject
var a = "http://pender.com"; // Audience

var signOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: "7d",
  algorithm: "RS256",
};

module.exports = {
  privateKEY,
  publicKEY,
  signOptions,
};
