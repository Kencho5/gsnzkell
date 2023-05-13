const express = require('express');
const router = express.Router();
const multer = require('multer');

const webhook = require('./webhook');
const login = require('./controllers/auth/login');
const register = require('./controllers/auth/register');
const getUser = require('./controllers/user/getUser');
const getUserPosts = require('./controllers/user/getUserPosts');
const editPost = require('./controllers/posts/editPost');
const profile = require('./controllers/user/profile');
const update = require('./controllers/user/update');
const upload = require('./controllers/posts/upload');
const uploadImages = require('./controllers/posts/uploadImages');
const post = require('./controllers/posts/post');
const similar = require('./controllers/posts/similar');
const getId = require('./controllers/user/getId');
const search = require('./controllers/posts/search');
const home = require('./controllers/home');
const deletePost = require('./controllers/posts/deletePost');
const buyVip = require('./controllers/posts/buyVip');
const renew = require('./controllers/posts/renew');
const reset = require('./controllers/auth/reset');
const code = require('./controllers/auth/code');
const confirmEmail = require('./controllers/auth/confirmEmail');
const cities = require('./utils/cities');
const payment = require('./controllers/auth/tbcPayment');
const checkPayment = require('./controllers/auth/checkPayment');
const paymentStatus = require('./controllers/auth/paymentStatus');
const rateLimit = require("express-rate-limit");

const emailLimiter = rateLimit({
  windowMs: 120 * 1000, // 2 minutes
  max: 3, // limit each IP to 3 request per windowMs
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const uploadImagesMiddleware = multer({ storage: storage }).array('images');

router.post('/api/webhook', webhook);

router.post('/api/login', login);

router.post('/api/register', register);

router.post('/api/user', getUser);

router.post('/api/userPosts', getUserPosts);

router.post('/api/editPost', editPost);

router.post('/api/profile', profile);

router.post('/api/update', update);

router.post('/api/upload', upload);

router.post('/api/uploadImages', uploadImagesMiddleware, uploadImages);

router.post('/api/post', post);

router.post('/api/similar', similar);

router.post('/api/getId', getId);

router.post('/api/search', search);

router.post('/api/home', home);

router.post('/api/delete', deletePost);

router.post('/api/buyVip', buyVip);

router.post('/api/renew', renew);

router.post('/api/reset', emailLimiter, reset);

router.post('/api/code', code);

router.post('/api/confirmEmail', emailLimiter, confirmEmail);

router.get('/api/cities', cities);

router.post('/api/tbcpayment', payment);

router.post('/api/checkpayment', checkPayment);

router.post('/api/paymentstatus', paymentStatus);

module.exports = router;

