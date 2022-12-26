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
  max: 150,
  message: "Too many requests from this IP, please try again"
});
app.use(limiter);

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use(express.json());

app.post('/api/login', (req, res) => {
  email = req.body.email;
  password = req.body.password;

  users.findOne({email: email}, (err, responseDB) => {
    if(responseDB) {
      bcrypt.compare(password, responseDB.password, async (error, result) => {
        var strings = ['selling', 'meeting', 'adopting'];

        async function getCounts() {
          let counts = [];
        
          for (const string of strings) {
            let count = await new Promise((resolve, reject) => {
              userPosts.count({email: email, postType: string}, (error, count) => {
                  resolve(count);
              });
            });
        
            counts.push(count);
          }
        
          return counts;
        }
        
        let counts = await getCounts();
        
        var payload = {
          name: responseDB.username,
          email: responseDB.email,
          phone: responseDB.phone,
          instagram: responseDB.instagram,
          facebook: responseDB.facebook,
          counts: counts,
          city: responseDB.city
        };

      var token = jwt.sign(payload, privateKEY, signOptions);
      
      res.status(200).send({
        status: 200,
        message: 'Successfully Logged In!',
        token: token
      });
      })
    } else {
      res.status(200).send({
        status: 500
      });
    }
  })
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
      _id: postID,
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

app.post('/api/user', (req, res) => {
  id = req.body.id;

  var strings = ['selling', 'meeting', 'adopting'];

  async function getCounts(email) {
    let counts = [];
  
    for (const string of strings) {
      let count = await new Promise((resolve, reject) => {
        userPosts.count({email: email, postType: string}, (error, count) => {
            resolve(count);
        });
      });
  
      counts.push(count);
    }
  
    return counts;
  }

  async function getPosts(email) {
    let posts = [];

    let docs = await new Promise((resolve, reject) => {
      userPosts.find({ email: email }).sort({$natural: -1}).toArray((err, docs) => {
        resolve(docs)
      })
    }) 
    posts = docs;
  }
  
  
  users.findOne({_id: id}, async (err, response) => {
    
    let counts = await getCounts(response.email);
    let posts = await getPosts(response.email);
    console.log(posts)
    
    if(err) {
      res.status(200).send({
        code: 404
      });
    }
    var payload = {
      id: response.id,
      name: response.username,
      phone: response.phone,
      instagram: response.instagram,
      facebook: response.facebook,
      counts: counts,
      city: response.city
     };

    res.status(200).send({
      code: 200,
      data: payload
    });
  });
})

app.post('/api/update', (req, res) => {
  newDetail = req.body[0];
  detailType = req.body[1];
  email = req.body[2];

  var strings = ['selling', 'meeting', 'adopting'];

  async function getCounts(email) {
    let counts = [];
  
    for (const string of strings) {
      let count = await new Promise((resolve, reject) => {
        userPosts.count({email: email, postType: string}, (error, count) => {
            resolve(count);
        });
      });
  
      counts.push(count);
    }
  
    return counts;
  }

  users.findOneAndUpdate(
    {email: email}, 
    {$set: {[detailType]: newDetail}},
    {returnDocument: 'after'},
    async function(err, doc) {
    let counts = await getCounts(email);

      var payload = {
        name: doc.value.username,
        email: doc.value.email,
        phone: doc.value.phone,
        instagram: doc.value.instagram,
        facebook: doc.value.facebook,
        counts: counts,
        city: doc.value.city
       };

      var token = jwt.sign(payload, privateKEY, signOptions);

      res.status(200).send({
        code: 200,
        token: token
      });
    }
    )
})

function insertTest() {

  var types = ["selling", "meeting", "adopting"];
  var animals = [
    {
      animal: "Dog",
      img: "/Users/kencho/Desktop/tmp/German-Shepherd-1358309706-1024x591.jpg"
    },
    {
      animal: "Cat",
      img: "/Users/kencho/Desktop/tmp/cat/german_rex_cat_cute_l.jpg"
    },
    {
      animal: "Bird",
      img: "/Users/kencho/Desktop/tmp/bird.jpeg"
    }
  ]

  
  docs = [];
  for(var i = 100; i < 8000; i++) {
    var animal = animals[Math.floor(Math.random() * animals.length)];
    var type = types[Math.floor(Math.random() * types.length)];

    var imageAsBase64 = fs.readFileSync(animal.img, 'base64');

    var id = uuidv4();
    docs.push({
      _id: id,
      email: 'giokenchadze@gmail.com',
      name: 'giorgi',
      animal: animal.animal,
      breed: `german rex ${Math.floor(Math.random() * 1000)}`,
      price: Math.floor(Math.random() * 2000),
      age: Math.floor(Math.random() * 6),
      ageType: 'years',
      description: 'asdkmakwr janrj anejrn aermioe',
      postType: type,
      phone: '557325325',
      date: new Date(),
      img_path: [ `${i}.png`],
      city: 'gori'
    });
      var type = '.png';
      var base64Data = imageAsBase64.replace(/^data:image\/png;base64,/, "");

    require("fs").writeFile(`/Users/kencho/Desktop/pender/src/assets/postImages/${id}-${i}${type}`, base64Data, 'base64', function(err) {});
  }

  userPosts.insertMany(docs);

}
// insertTest()

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
    img_path: imgs,
    city: form['city']
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
          imgs: result.img_path,
          city: result.city
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
});

app.post('/api/profile', (req, res) => {
  email = req.body.email;
  
  userPosts.find({ email: email }).sort({$natural: -1}).toArray((err, posts) => {
    if(err) {
      res.status(200).send({
        code: 500,
      });
    }
    res.status(200).send({
      code: 200,
      data: posts
    });
  })
});

app.post('/api/search', (req, res) => {
  var searchText = req.body.text;
  var start = req.body.start;
  var count;

  userPosts.countDocuments(
    { $text: { $search: searchText } },
    { score: { $meta: "textScore" } },
    (err, response) => {
      count = response;
    }
  )

  userPosts.find(
    { $text: { $search: searchText } },
    { score: { $meta: "textScore" } }
  )
  .skip(start)
  .limit(10)
  .sort(
      { score: { $meta: "textScore" }, _id: 1 }
  ).toArray((err, response) => {
    if(err) {
      res.status(200).send({
        code: 500,
      });
    }

    var data = [];
    response.forEach(row => {
    data.push(row)
  })
  res.status(200).send({
    code: 200,
    data: data,
    count: count
  });
  })
});

app.post('/api/home', (req, res) => {
  var data = [];

  var result = userPosts.find().limit(10).sort({$natural: -1}).toArray(function(err, results) {
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
