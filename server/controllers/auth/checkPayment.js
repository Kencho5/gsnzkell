const axios = require("axios");
const config = require("../../utils/config");
const { db, users, payments } = require("../../utils/db");

const accessToken = config.tbcAccessToken;
const apiKey = config.tbcApiKey;

async function checkPayment(req, res) {
  const apiUrl = "https://api.tbcbank.ge/v1/tpay/payments";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    apikey: apiKey,
  };

  const payId = req.body.PaymentId;

  axios
    .get(`${apiUrl}/${payId}`, { headers })
    .then(async (response) => {
      const status = response.data.httpStatusCode;
      if (status === 200) {
        await payments.insertOne({
          paymentId: response.data.payId,
          amount: response.data.amount,
          transactionId: response.data.transactionId,
          card: response.data.paymentCardNumber,
        });

        await users.updateOne(
          { email },
          { $inc: { balance: response.data.amount } },
          options
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
