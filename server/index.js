const express = require('express');
const app = express();
const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

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
  email = req.body.email;
  username = req.body.name;
  phoneNumber = req.body.phoneNumber;
  password = req.body.password;
  ip = req.ip;
  id = uuidv4();

  bcrypt.hash(password, 10, function(errorHash, hash) {

    pool.query(`INSERT INTO USERS(id, email, name, phone_number, password, ip_address) VALUES('${id}', '${email}', '${username}', '${phoneNumber}', '${hash}', '${ip}')`, (errorDB, responseDB) => {

      if (responseDB) {
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
  console.log(req.body)

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

    require("fs").writeFile(`/Users/kencho/Desktop/pender/src/assets/postImages/${postID}-${i}.${type}`, base64Data, 'base64', function(err) {});
    imgs.push(`${i}${type}`)
  }

  var form = req.body.form;
  pool.query(`INSERT INTO user_posts(id, email, name, title, phone, animal, breed, price, age, age_type, description, post_type, img_path, date) VALUES(
    '${postID}',
    '${email}',
    '${userName}',
    '${form['title']}', 
    '${form['phone']}', 
    '${form['animal']}', 
    '${form['breed']}',
    '${form['price']}',
    '${form['age']}',
    '${form['ageType']}',
    '${form['description']}',
    '${form['postType']}',
    '{${imgs}}',
    current_timestamp
    )`, (errorDB, responseDB) => {
    if (responseDB) {
      res.status(200).send({
        code: 200,
        id: postID
      });
    } else {
      console.log(errorDB)
      res.status(200).send({
        code: 500,
      });
    }
  });
});

app.post('/api/post', (req, res) => {
  var postID = req.body.id;
  
  pool.query(`SELECT * FROM user_posts WHERE id = '${postID}'`, (errorDB, responseDB) => {
    if (responseDB) {
      var data = {
        id: responseDB.rows[0].id,
        title: responseDB.rows[0].title,
        email: responseDB.rows[0].email,
        name: responseDB.rows[0].name,
        phone: responseDB.rows[0].phone,
        animal: responseDB.rows[0].animal,
        breed: responseDB.rows[0].breed,
        price: responseDB.rows[0].price,
        age: responseDB.rows[0].age,
        ageType: responseDB.rows[0].age_type,
        description: responseDB.rows[0].description,
        postType: responseDB.rows[0].post_type,
        imgs: responseDB.rows[0].img_path
       };
      
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

})

app.listen(8080, () => console.log(`Started server at http://localhost:8080!`));
