const { db, userPosts, users } = require("../../utils/db");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const config = require("../../utils/config");
const session = require("express-session");

const accessToken = config.tbcAccessToken;
const apiKey = config.tbcApiKey;
const paymentId = uuidv4();

async function payment(req, res) {
  const amount = req.body.amount;
  const user = req.body.user;
  console.log(user.email)
  req.session.paymentEmail = user.email;

  const apiUrl = "https://api.tbcbank.ge/v1/tpay/payments";

  const paymentData = {
    amount: {
      currency: "GEL",
      total: amount,
      subTotal: 0,
      tax: 0,
      shipping: 0,
    },
    returnurl: `https://pender.ge/paymentStatus/${paymentId}`,
    expirationMinutes: "5",
    methods: [5, 7],
    callbackUrl: "https://pender.ge/api/checkpayment",
    preAuth: false,
    language: "KA",
    merchantPaymentId: paymentId,
    saveCard: false,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    apikey: apiKey,
  };

  axios
    .post(apiUrl, paymentData, { headers })
    .then((response) => {
      return res.status(200).send({
        code: 200,
        url: response.data.links[1].uri,
      });
    })
    .catch((error) => {
      return res.status(200).send({
        code: 500,
      });
    });
}

module.exports = payment;
