const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const { spawn } = require('child_process');

const routes = require("./routes");

app.use(
  express.urlencoded({
    extended: true,
  })
);

const limiter = rateLimit({
  windowMs: 180000,
  max: 200,
  message:
    "You have exceeded the maximum number of API requests. Please try again later.",
});
app.use(limiter);

app.use(
  session({
    secret: "gsnzkell",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));

app.use(express.json());

app.use(routes);

app.listen(3000, () => {
  console.log(`Started server at http://localhost:3000!`);

  // Spawn a new process to run the updateExpired.js file
  const updateProcess = spawn('node', ['./controllers/posts/updateExpiredVips.js']);

  // Log any output from the child process
  updateProcess.stdout.on('data', (data) => {
    console.log(`updateExpired.js: ${data}`);
  });

  updateProcess.stderr.on('data', (data) => {
    console.error(`updateExpired.js error: ${data}`);
  });

  // Handle any errors or exit events from the child process
  updateProcess.on('error', (err) => {
    console.error(`updateExpired.js error: ${err}`);
  });

  updateProcess.on('exit', (code) => {
    console.log(`updateExpired.js exited with code ${code}`);
  });
});
