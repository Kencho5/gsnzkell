require('dotenv').config()

module.exports = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-central-1",
  tbcAccessToken: process.env.TBC_ACCESS_TOKEN,
  tbcApiKey: process.env.TBC_API_KEY
};
