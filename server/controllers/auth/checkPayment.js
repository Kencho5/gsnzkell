const axios = require("axios");
const config = require("../../utils/config");

const accessToken = config.tbcAccessToken;
const apiKey = config.tbcApiKey;

async function checkPayment() {
  const apiUrl = "https://api.tbcbank.ge/v1/tpay/payments";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    apikey: apiKey,
  };

  // replace {payId} with the actual payId value
  const payId = paymentId;

  axios
    .get(`${apiUrl}/${payId}`, { headers })
    .then((response) => {
      const status = response.data.status;
      if (status === "Success") {
        console.log(response.data);

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
