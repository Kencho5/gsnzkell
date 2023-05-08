const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const { spawn } = require("child_process");
const cookieParser = require("cookie-parser");
const ipfilter = require("express-ipfilter").IpFilter;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const routes = require("./routes");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 600000,
  max: 200,
  message:
    "You have exceeded the maximum number of API requests. Please try again later.",
  onLimitReached: (req, res) => {
    const sendWarning = require("./controllers/auth/warning");
    const clientIP = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    sendWarning(clientIP);
  },
});

app.use(limiter);

app.use(
  session({
    secret: "gsnzkell",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", parameterLimit: 50000 }));

// Define the list of banned IPs
const bannedIPs = [];

// Set up the IP filter middleware
app.use(ipfilter(bannedIPs, { mode: "deny", log: false }));

app.use((req, res, next) => {
  if (req.ipFilterError) {
    // The request was blocked due to IP filtering
    res.status(403).send("Access denied");
  } else {
    next();
  }
});

app.use(express.json());

app.use(routes);

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
        const savePath = "/var/uploads";
  await fs.promises.mkdir(`${savePath}/postImages/${req.params.postID}`);

    const postID = req.params.postID;
    const destination = path.join('/var/uploads/postImages', postID);
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/api/upload/:postID', upload.fields([{ name: 'image' }]), async (req, res) => {

  // req.files contains the uploaded files
  // req.body contains the other form data (if any)
  console.log(req.files);
  console.log(req.body);
  console.log(req.params.postID);
  res.send('File uploaded successfully!');
});

app.listen(3000, () => {
  console.log(`Started server at http://localhost:3000!`);

  // Spawn a new process to run the updateExpired.js file
  const updateProcess = spawn("node", [
    "./controllers/posts/updateExpiredVips.js",
  ]);

  // Log any output from the child process
  updateProcess.stdout.on("data", (data) => {
    console.log(`updateExpired.js: ${data}`);
  });

  updateProcess.stderr.on("data", (data) => {
    console.error(`updateExpired.js error: ${data}`);
  });

  // Handle any errors or exit events from the child process
  updateProcess.on("error", (err) => {
    console.error(`updateExpired.js error: ${err}`);
  });

  updateProcess.on("exit", (code) => {
    console.log(`updateExpired.js exited with code ${code}`);
  });
});
