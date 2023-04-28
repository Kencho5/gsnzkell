const axios = require("axios");
const config = require("../../utils/config");
const session = require("express-session");
const { db, userPosts, users } = require("../../utils/db");

const accessToken = config.tbcAccessToken;
const apiKey = config.tbcApiKey;

async function checkPayment(req, res) {
  console.log(req.body)
  const apiUrl = "https://api.tbcbank.ge/v1/tpay/payments";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    apikey: apiKey,
  };

  const payId = req.body.PaymentId;

  axios
    .get(`${apiUrl}/${payId}`, { headers })
    .then((response) => {
      const status = response.data.status;
      if (status === "Success") {
        req.session.paymentStatus = true;

        db.payments.insertOne({
          paymentId: response.data.payId,
          amount: response.data.amount,
          transactionId: response.data.transactionId,
          card: response.data.paymentCardNumber
        })

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
