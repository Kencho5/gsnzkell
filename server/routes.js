const express = require('express');
const router = express.Router();

const webhook = require('./utils/webhook');
const login = require('./controllers/auth/login');
const register = require('./controllers/auth/register');
const getUser = require('./controllers/user/getUser');
const getUserPosts = require('./controllers/user/getUserPosts');
const editPost = require('./controllers/posts/editPost');
const profile = require('./controllers/user/profile');
const update = require('./controllers/user/update');
const upload = require('./controllers/posts/upload');
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

router.post('/api/webhook', webhook);

router.post('/api/login', login);

router.post('/api/register', register);

router.post('/api/user', getUser);

router.post('/api/userPosts', getUserPosts);

router.post('/api/editPost', editPost);

router.post('/api/profile', profile);

router.post('/api/update', update);

router.post('/api/upload', upload);

router.post('/api/post', post);

router.post('/api/similar', similar);

router.post('/api/getId', getId);

router.post('/api/search', search);

router.post('/api/home', home);

router.post('/api/delete', deletePost);

router.post('/api/buyVip', buyVip);

router.post('/api/renew', renew);

router.post('/api/reset', reset);

router.post('/api/code', code);

router.post('/api/confirmEmail', confirmEmail);

module.exports = router;
