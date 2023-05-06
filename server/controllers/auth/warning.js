const config = require("../../utils/config");
const AWS = require("aws-sdk");

// create an SES client
const ses = new AWS.SES({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region
});

async function sendWarning(ip) {

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
      <p>ვიღაც პროჭობს ამ IP ით:</p>
      <p class="verification-code">${ip}</p>
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

