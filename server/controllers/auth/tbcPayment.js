const { db, userPosts, users } = require("../../utils/db");
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const config = require("../../utils/config");

async function payment(req, res) {
  const amount = req.body.amount;
  const user = req.body.user;

  const apiUrl = 'https://api.tbcbank.ge/v1/tpay/payments';
  const accessToken = config.tbcAccessToken;
  const apiKey = config.tbcApiKey;

  return res.status(200).send({
    code: 200,
  });
}

module.exports = payment;
