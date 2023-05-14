const axios = require("axios");
const config = require("../../utils/config");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

axios
  .post(
    "https://api.tbcbank.ge/v1/tpay/access-token",
    new URLSearchParams({
      client_Id: config.tbcClientId,
      client_secret: config.tbcClientSecret,
    }),
    {
      headers: {
        apikey: config.tbcApiKey,
      },
    }
  )
  .then(function (response) {
    console.log("Refreshed Access Token.");

    const accessToken = response.data.access_token;
    // Update the access token in the .env file
    const envConfig = dotenv.parse(fs.readFileSync(".env"));
    envConfig.TBC_ACCESS_TOKEN = accessToken;

    // Write the updated .env file
    fs.writeFileSync(".env", "");
    for (const key in envConfig) {
      fs.appendFileSync(".env", `${key}=${envConfig[key]}\n`);
    }
  })
  .catch(function (error) {
    console.error(error);
  });
