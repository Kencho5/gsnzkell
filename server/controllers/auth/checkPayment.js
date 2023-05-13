const axios = require("axios");
const config = require("../../utils/config");
const { db, users, payments } = require("../../utils/db");
const session = require("express-session");

const accessToken = config.tbcAccessToken;
const apiKey = config.tbcApiKey;

async function checkPayment(req, res) {
  const options = {
    timeZone: "Asia/Tbilisi",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const georgiaDate = new Date().toLocaleString("en-US", options);

  const apiUrl = "https://api.tbcbank.ge/v1/tpay/payments";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    apikey: apiKey,
  };

  const payId = req.body.PaymentId;
  const email = req.query.email;

  axios
    .get(`${apiUrl}/${payId}`, { headers })
    .then(async (response) => {
      const status = response.data.status;

      if (status != "Failed") {
        await payments.insertOne({
          email: email,
          merchantId: response.data.merchantPaymentId,
          paymentId: response.data.payId,
          amount: response.data.amount,
          transactionId: response.data.transactionId,
          card: response.data.paymentCardNumber,
          date: georgiaDate,
        });

        await users.updateOne(
          { email: email },
          { $inc: { balance: response.data.amount * 100 } }
        );

        return res.status(200).send({
          code: 200,
        });
      } else {
        return res.status(200).send({
          code: 404,
        });
      }
    })
    .catch((error) => {
      return res.status(200).send({
        code: 404,
      });
    });
}

module.exports = checkPayment;
