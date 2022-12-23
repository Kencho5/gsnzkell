const express = require('express');
const app = express();
const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require("mongodb");
const rateLimit = require("express-rate-limit");

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

client.connect();
const db = client.db('pender');
const userPosts = db.collection('userPosts');
const users = db.collection('users');

const pool = new Pool({
  user: 'kencho',
  host: 'localhost',
  database: 'pender',
  password: 'gio123',
  port: 5432,
});

const privateKEY = fs.readFileSync('private.key');
const publicKEY = fs.readFileSync('public.key');

var i  = 'Pender corp';          // Issuer 
var s  = 'some@user.com';        // Subject 
var a  = 'http://pender.com'; // Audience

var signOptions = {
  issuer:  i,
  subject:  s,
  audience:  a,
  expiresIn:  "7d",
  algorithm:  "RS256"
 };

app.use(
  express.urlencoded({
    extended: true
  })
)

const limiter = rateLimit({
  windowMs: 30000,
  max: 100,
  message: "Too many requests from this IP, please try again"
});
app.use(limiter);

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use(express.json());

app.post('/api/login', (req, res) => {
  email = req.body.email;
  password = req.body.password;

  pool.query(`SELECT password, name, email, phone_number, instagram, facebook FROM USERS WHERE email = '${email}'`, (errorDB, responseDB) => {
    if (responseDB.rowCount != 0) {

      bcrypt.compare(password, responseDB.rows[0].password, function(err, result) {

        if (result) {
          
          var payload = {
            name: responseDB.rows[0].name,
            email: responseDB.rows[0].email,
            phone: responseDB.rows[0].phone_number,
            instagram: responseDB.rows[0].instagram,
            facebook: responseDB.rows[0].facebook
           };

          var token = jwt.sign(payload, privateKEY, signOptions);
          
          res.status(200).send({
            status: 200,
            message: 'Successfully Logged In!',
            token: token
          });
        } else {
          res.status(200).send({
            status: 401,
          });
        }

      });
    } else {
      res.status(200).send({
        status: 500
      });
    }

  });
})

app.post('/api/register', (req, res) => {
  // ip = req.ip;

  users.findOne({email: req.body.email}, function(err, response) {
    if(response) {
      res.status(200).send({
        code: 500,
        message: 'Email Already In Use.'
      });
    }
  })

  bcrypt.hash(req.body.password, 10, function(errorHash, hash) {

    var data = {
      _id: uuidv4(),
      email: req.body.email,
      username: req.body.name,
      phone: req.body.phoneNumber,
      city: req.body.city,
      password: hash
    }

    users.insertOne(data, function(err, result) {
      if(result) {
        res.status(200).send({
          code: 200,
          message: 'Successfully Registered!'
        });
      } else {
        res.status(200).send({
          code: 500,
          message: 'Internal Server Error!'
        });
      }
    });
  });
})

app.post('/api/profile', (req, res) => {
  if(req.body.email) {
    email = req.body.email;
  } else {
    token = req.body.token;
  
    try {
      email = jwt.verify(token, publicKEY, signOptions)['email'];
    } catch(e) {
      res.status(200).send({
        code: 500,
      });
    }
  }

  pool.query(`SELECT id, name, phone_number, facebook, instagram FROM USERS WHERE email = '${email}'`, (errorDB, responseDB) => {
    if (responseDB.rowCount != 0) {
      var payload = {
        id: responseDB.rows[0].id,
        name: responseDB.rows[0].name,
        email: responseDB.rows[0].email,
        phone: responseDB.rows[0].phone_number,
        instagram: responseDB.rows[0].instagram,
        facebook: responseDB.rows[0].facebook
       };

      var newToken = jwt.sign(payload, privateKEY, signOptions);

      res.status(200).send({
        code: 200,
        token: newToken
      });
    }
  });
});

app.post('/api/user', (req, res) => {
  id = req.body.id;

  pool.query(`SELECT id, email, name, phone_number, facebook, instagram FROM USERS WHERE id = '${id}'`, (errorDB, responseDB) => {
    if (responseDB.rowCount != 0) {
      var payload = {
        id: responseDB.rows[0].id,
        name: responseDB.rows[0].name,
        email: responseDB.rows[0].email,
        phone: responseDB.rows[0].phone_number,
        instagram: responseDB.rows[0].instagram,
        facebook: responseDB.rows[0].facebook
       };

      res.status(200).send({
        code: 200,
        data: payload
      });
    }
  });
})

app.post('/api/update', (req, res) => {
  newDetail = req.body[0];
  detailType = req.body[1];
  email = req.body[2];

  pool.query(`UPDATE users SET ${detailType} = '${newDetail}' WHERE email = '${email}' RETURNING name, email, phone_number, instagram, facebook`, (errorDB, responseDB) => {
    if (responseDB) {

      var payload = {
        name: responseDB.rows[0].name,
        email: responseDB.rows[0].email,
        phone: responseDB.rows[0].phone_number,
        instagram: responseDB.rows[0].instagram,
        facebook: responseDB.rows[0].facebook
       };

       var token = jwt.sign(payload, privateKEY, signOptions);

      res.status(200).send({
        code: 200,
        token: token
      });
    }
  });
})

app.post('/api/upload', (req, res) => {
  token = req.body.user;
  
  if(jwt.verify(token, publicKEY, signOptions)) {
    var postID = uuidv4();

    email = jwt.verify(token, publicKEY, signOptions)['email'];

    userName = jwt.verify(token, publicKEY, signOptions)['name'];

  } else {
    res.status(200).send({
      code: 500
    });
  }

  var imgs = [];
  for(var i = 0; i < req.body.urls.length; i++) {
    if(req.body.urls[i].includes('jpeg')) {
      var type = '.jpg';
      var base64Data = req.body.urls[i].replace(/^data:image\/jpeg;base64,/, "");
    } else {
      var type = '.png';
      var base64Data = req.body.urls[i].replace(/^data:image\/png;base64,/, "");
    }

    require("fs").writeFile(`/Users/kencho/Desktop/pender/src/assets/postImages/${postID}-${i}${type}`, base64Data, 'base64', function(err) {});
    imgs.push(`${i}${type}`);
  }

  var form = req.body.form;

  var data = {
    _id: postID,
    email: email,
    name: userName,
    animal: form['animal'],
    breed: form['breed'],
    price: form['price'],
    age: form['age'],
    ageType: form['ageType'],
    description: form['description'],
    postType: form['postType'],
    phone: form['phone'],
    date: new Date(),
    img_path: imgs
  }

  userPosts.insertOne(data, function(err, result) {
    if(result) {
      res.status(200).send({
        code: 200,
        id: postID
      });
    } else {
      res.status(200).send({
        code: 500
      });
    }
  })
});

app.post('/api/post', (req, res) => {
  var postID = req.body.id;

  userPosts.findOne({"_id": postID}, function(err, result) {
      if(result) {
        var data = {
          id: result._id,
          email: result.email,
          name: result.name,
          phone: result.phone,
          animal: result.animal,
          breed: result.breed,
          price: result.price,
          age: result.age,
          ageType: result.ageType,
          description: result.description,
          postType: result.postType,
          date: result.date,
          imgs: result.img_path
        }

        res.status(200).send({
          code: 200,
          data: data
        });

      } else {
        res.status(200).send({
          code: 500
        });
      }
  });
})

app.post('/api/search', (req, res) => {
  var text = req.body.text;
  var type = req.body.type;
  
  pool.query(`SELECT * FROM user_posts WHERE ${type} LIKE '%${text}%'`, (errorDB, responseDB) => {
    if (responseDB) {
      var data = []
      responseDB.rows.forEach(row => {
        data.push({
          id: row.id,
          title: row.title,
          email: row.email,
          name: row.name,
          phone: row.phone,
          animal: row.animal,
          breed: row.breed,
          price: row.price,
          age: row.age,
          ageType: row.age_type,
          description: row.description,
          postType: row.post_type,
          date: row.date,
          imgs: row.img_path
         });
      })
      
      res.status(200).send({
        code: 200,
        data: data
      });
      
    } else {
      res.status(200).send({
        code: 500,
      });
    }
  });

});

app.post('/api/home', (req, res) => {
  var data = [];
  var result = userPosts.find().skip(userPosts.countDocuments() - 10).toArray(function(err, results) {
    if(results) {
      results.forEach(result => {
        data.push({
          id: result._id,
          email: result.email,
          animal: result.animal,
          breed: result.breed,
          price: result.price,
          age: result.age,
          ageType: result.ageType,
          postType: result.postType.toUpperCase(),
          date: result.date,
          imgs: result.img_path
      });
      })
      
      res.status(200).send({
        code: 200,
        data: data
      });

    } else {
      res.status(200).send({
        code: 500
      });
    }
  });
});

app.listen(8080, () => console.log(`Started server at http://localhost:8080!`));
