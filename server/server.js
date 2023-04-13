const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const session = require("express-session");

const routes = require('./routes');

app.use(
  express.urlencoded({
    extended: true,
  })
);

const limiter = rateLimit({
  windowMs: 30000,
  max: 150,
  message: 'Too many requests from this IP, please try again',
});
app.use(limiter);

app.use(
  session({
    secret: 'gsnzkell',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  bodyParser.json({
    limit: '100mb',
  })
);
app.use(
  bodyParser.urlencoded({
    limit: '100mb',
    extended: true,
  })
);

app.use(express.json());

app.use(routes);

app.listen(3000, () => console.log(`Started server at http://localhost:3000!`));

