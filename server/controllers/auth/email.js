const AWS = require("aws-sdk");

// create an SES client
const ses = new AWS.SES({
  accessKeyId: "AKIAVFT6KDRIBYGAWR7F",
  secretAccessKey: "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",
  region: "eu-north-1",
});

async function sendEmail(email) {
  const code = Math.floor(Math.random() * 90000) + 10000;

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
      <p>To complete your task, please use the following verification code:</p>
      <p class="verification-code">${code}</p>
      <p>Thank you,</p>
      <p>Pender</p>
    </body>
  </html>
`;

  // send an email
  const params = {
    Source: "Pender <support@pender.ge>",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Verification Code",
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

  return code;
}

module.exports = {
  sendEmail,
};
