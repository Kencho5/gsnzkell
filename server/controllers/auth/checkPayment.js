const axios = require("axios");
const config = require("../../utils/config");

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
    .then((response) => {
      console.log(response.data);

      const status = response.data.status;
      if (status === "Success") {
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
