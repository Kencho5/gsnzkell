const config = require("../../utils/config");
const AWS = require("aws-sdk");

// create an SES client
const ses = new AWS.SES({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region
});

async function sendWarning(ip, minutes, route) {
  const options = {
    timeZone: "Asia/Tbilisi",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const georgiaDate = new Date().toLocaleString("en-US", options);

  const htmlBody = `
  <html>
    <head>
      <style>
        .verification-code {
          font-size: 48px;
          font-weight: bold;
          color: #007bff;
        }
      </style>
    </head>
    <body>
      <p>ვიღაც მაიმუნობს ამ IP ით:</p>
      <p class="verification-code">${ip}</p>
      <p>${minutes} Minute(s) On: ${route} Route</p>
      <p>Date: ${georgiaDate}</p>
    </body>
  </html>
`;

  // send an email
  const params = {
    Source: "Pender <support@pender.ge>",
    Destination: {
      ToAddresses: ['giokenchadze@gmail.com'],
    },
    Message: {
      Subject: {
        Data: "Proach",
      },
      Body: {
        Html: {
          Data: htmlBody,
        },
      },
    },
  };

  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}

module.exports = sendWarning;

