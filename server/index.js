const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
const rateLimit = require("express-rate-limit");
const shell = require("shelljs");
var os = require("os");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

client.connect();
const db = client.db("pender");
const userPosts = db.collection("userPosts");
const users = db.collection("users");

const privateKEY = fs.readFileSync("private.key");
const publicKEY = fs.readFileSync("public.key");

var i = "Pender corp"; // Issuer
var s = "some@user.com"; // Subject
var a = "http://pender.com"; // Audience

var signOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: "7d",
  algorithm: "RS256",
};

app.use(
  express.urlencoded({
    extended: true,
  })
);

const limiter = rateLimit({
  windowMs: 30000,
  max: 150,
  message: "Too many requests from this IP, please try again",
});
app.use(limiter);

app.use(
  bodyParser.json({
    limit: "100mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
);

app.use(express.json());

app.post("/api/git", (req, res) => {
  if (req.body.after) {
    shell.exec("./update.sh");
  }
});

app.post("/api/login", (req, res) => {
  email = req.body.email;
  password = req.body.password;

  users.findOne(
    {
      email: email,
    },
    (err, responseDB) => {
      if (responseDB) {
        bcrypt.compare(password, responseDB.password, async (error, result) => {
          if(result) {
            var payload = {
              id: responseDB._id,
              username: responseDB.username,
              email: responseDB.email,
              phone: responseDB.phone,
              instagram: responseDB.instagram,
              facebook: responseDB.facebook,
              city: responseDB.city,
              balance: responseDB.balance,
              pfp: responseDB.pfp,
            };

            var token = jwt.sign(payload, privateKEY, signOptions);

            res.status(200).send({
              status: 200,
              message: "Successfully Logged In!",
              token: token,
            });
          }
        });
      } else {
        res.status(200).send({
          status: 500,
        });
      }
    }
  );
});

app.post("/api/register", (req, res) => {
  // ip = req.ip;

  users.findOne(
    {
      email: req.body.email,
    },
    function (err, response) {
      if (response) {
        res.status(200).send({
          code: 500,
          message: "Email Already In Use.",
        });
      }
    }
  );

  bcrypt.hash(req.body.password, 10, function (errorHash, hash) {
    var data = {
      _id: uuidv4(),
      email: req.body.email,
      username: req.body.name,
      phone: req.body.phoneNumber,
      city: req.body.city,
      password: hash,
      balance: 0
    };

    users.insertOne(data, function (err, result) {
      if (result) {
        res.status(200).send({
          code: 200,
          message: "Successfully Registered!",
        });
      } else {
        res.status(200).send({
          code: 500,
          message: "Internal Server Error!",
        });
      }
    });
  });
});

app.post("/api/user", (req, res) => {
  id = req.body.id;

  users.findOne(
    {
      _id: id,
    },
    async (err, response) => {
      let counts = await getCounts(response.email);
      let posts = await getPosts(response.email, req.body.start);

      if (err) {
        res.status(200).send({
          code: 404,
        });
      }
      var payload = {
        id: response.id,
        name: response.username,
        phone: response.phone,
        instagram: response.instagram,
        facebook: response.facebook,
        counts: counts,
        city: response.city,
      };

      res.status(200).send({
        code: 200,
        data: payload,
        posts: posts,
      });
    }
  );
});

async function getCounts(email) {
  let counts = [];
  var strings = ["selling", "meeting", "adopting"];

  for (const string of strings) {
    let count = await new Promise((resolve, reject) => {
      userPosts.count(
        {
          email: email,
          postType: string,
        },
        (error, count) => {
          resolve(count);
        }
      );
    });

    counts.push(count);
  }

  return counts;
}

async function getPosts(email, start) {
  let docs = await new Promise((resolve, reject) => {
    userPosts
      .find({
        email: email,
      })
      .skip(parseInt(start))
      .limit(5)
      .sort({
        $natural: -1,
      })
      .toArray((err, docs) => {
        resolve(docs);
      });
  });
  return docs;
}

app.post("/api/editPost", async (req, res) => {
  var details = req.body.details;

  var result = await userPosts.updateOne(
    { _id: details.id },
    {
      $set: {
        breed: details.breed,
        price: details.price,
        description: details.description,
        city: details.city,
        phone: details.phone,
      }
    }
  );

  if(result['acknowledged'] == true) {
    res.status(200).send({
      code: 200,
    });
  }
});

app.post("/api/update", (req, res) => {
  id = req.body.id;
  username = req.body.data.name;
  email = req.body.data.email;
  old_email = req.body.old_email;
  phone = req.body.data.phone;
  city = req.body.data.city;
  facebook = req.body.data.facebook;
  instagram = req.body.data.instagram;
  pfpSet = req.body.pfpSet;
  pfp = req.body.pfp;

  if (pfp != undefined) {
    savePfp(pfp, email);
    pfpSet = true;
  }

  users.updateOne(
    { email: old_email },
    {
      $set: {
        email: email,
        username: username,
        phone: phone,
        city: city,
        facebook: facebook,
        instagram: instagram,
        pfp: pfpSet,
      }
    }
  );

  var payload = {
    id: id,
    username: username,
    email: email,
    phone: phone,
    facebook: facebook,
    instagram: instagram,
    city: city,
    balance: req.body.balance,
    pfp: pfpSet,
  };

  var token = jwt.sign(payload, privateKEY, signOptions);

  res.status(200).send({
    code: 200,
    token: token,
  });
});

function savePfp(pfp, email) {
  if (os.platform() == "darwin") {
    var save_path = "../src/assets/images";
  } else {
    var save_path = "/var/www/pender/assets";
  }

  var base64Data = pfp;

  // Extract the image type and base64 data from the string
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches) {
    console.error("Invalid base64 string");
    return;
  }

  const type = matches[1];
  const data = Buffer.from(matches[2], "base64");

  fs.writeFile(`${save_path}/user-pfps/${email}.jpg`, data, "base64", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File saved!");
  });
}

function insertTest() {
  var types = ["selling", "meeting", "adopting"];
  var animals = [
    {
      animal: "Dog",
      img: "/Users/kencho/Desktop/tmp/German-Shepherd-1358309706-1024x591.jpg",
    },
    {
      animal: "Cat",
      img: "/Users/kencho/Desktop/tmp/cat/german_rex_cat_cute_l.jpg",
    },
    {
      animal: "Bird",
      img: "/Users/kencho/Desktop/tmp/bird.jpeg",
    },
  ];

  docs = [];
  for (var i = 0; i < 1000; i++) {
    var animal = animals[Math.floor(Math.random() * animals.length)];
    var type = types[Math.floor(Math.random() * types.length)];

    var imageAsBase64 = fs.readFileSync(animal.img, "base64");

    if (type == "selling") {
      var price = Math.floor(Math.random() * 2000);
    } else {
      var price = "";
    }

    var id = uuidv4();
    docs.push({
      _id: id,
      email: "giokenchadze@gmail.com",
      name: "giorgi",
      animal: animal.animal,
      breed: `german rex ${Math.floor(Math.random() * 1000)}`,
      price: price,
      age: Math.floor(Math.random() * 6),
      ageType: "years",
      description: "asdkmakwr janrj anejrn aermioe",
      postType: type,
      phone: "557325325",
      date: new Date(),
      img_path: [`${i}.png`],
      city: "gori",
    });
    var type = ".png";
    var base64Data = imageAsBase64.replace(/^data:image\/png;base64,/, "");

    if (os.platform() == "darwin") {
      var save_path = "../src/assets";
    } else {
      var save_path = "/var/www/pender/assets";
    }

    require("fs").writeFile(
      `${save_path}/postImages/${id}-${i}${type}`,
      base64Data,
      "base64",
      function (err) {}
    );
  }

  userPosts.insertMany(docs);
}
// insertTest()

app.post("/api/upload", async (req, res) => {
  token = req.body.user;

  if (jwt.verify(token, publicKEY, signOptions)) {
    var postID = uuidv4();

    email = jwt.verify(token, publicKEY, signOptions)["email"];

    userName = jwt.verify(token, publicKEY, signOptions)["username"];
  } else {
    res.status(200).send({
      code: 500,
    });
  }

  var imgs = await saveImages(postID, req);

  var form = req.body.form;

  var data = {
    _id: postID,
    email: email,
    name: userName,
    animal: form["animal"],
    breed: form["breed"],
    price: parseInt(form["price"]),
    age: parseInt(form["age"]),
    ageType: form["ageType"],
    description: form["description"],
    postType: form["postType"],
    phone: form["phone"],
    date: new Date(),
    img_path: imgs,
    city: form["city"],
    vip: false,
    expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
  };

  userPosts.insertOne(data, function (err, result) {
    if (result) {
      res.status(200).send({
        code: 200,
        id: postID,
      });
    } else {
      res.status(200).send({
        code: 500,
      });
    }
  });
});

async function saveImages(postID, req) {
  if (os.platform() == "darwin") {
    var save_path = "../src/assets/";
  } else {
    var save_path = "/var/www/pender/assets/";
  }

  await fs.promises.mkdir(`${save_path}/postImages/${postID}`);

  const imgs = [];
  for (let i = 0; i < req.body.urls.length; i++) {
    const base64Data = req.body.urls[i];
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches) {
      continue;
    }

    const type = matches[1];
    const data = Buffer.from(matches[2], "base64");

    await fs.promises.writeFile(
      `${save_path}/postImages/${postID}/${i}.${type.split("/")[1]}`,
      data,
      "base64"
    );
    imgs.push(`${i}.${type.split("/")[1]}`);
  }
  return imgs;
}

app.post("/api/post", (req, res) => {
  var postID = req.body.id;

  userPosts.findOne(
    {
      _id: postID,
    },
    function (err, result) {
      if (result) {
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
          vip: result.vip,
          city: result.city,
        };

        res.status(200).send({
          code: 200,
          data: data,
        });
      } else {
        res.status(200).send({
          code: 500,
        });
      }
    }
  );
});

app.post("/api/similar", (req, res) => {
  breed = req.body.breed;
  city = req.body.city;
  postType = req.body.postType;

  userPosts
    .find({
      $text: {
        $search: breed,
      },
      city: city,
    })
    .limit(3)
    .toArray((err, response) => {
      if (response) {
        res.status(200).send({
          code: 200,
          data: response.shift(),
        });
      } else {
        res.status(200).send({
          code: 404,
        });
      }
    });
});

async function countUserPosts(email) {
  var count;

  let res = await new Promise((resolve, reject) => {
    userPosts.countDocuments(
      {
        email: email,
      },
      (err, response) => {
        resolve(response);
      }
    );
  });
  count = res;

  return count;
}

app.post("/api/getid", async (req, res) => {
  email = req.body.email;

  users.findOne(
    {
      email: req.body.email,
    },
    function (err, response) {
      if (response) {
        res.status(200).send({
          code: 200,
          data: response._id,
        });
      } else {
        res.status(200).send({
          code: 500,
        });
      }
    }
  );
});

app.post("/api/profile", async (req, res) => {
  var email = req.body.email;
  var start = req.body.pageIndex;
  var sortType = req.body.sort;

  var sort = { expires: -1 };
  if(sortType) {
    switch(sortType) {
      case "expiresDesc":
        sort = { expires: -1 };
        break;
      case "expiresAsc":
        sort = { expires: 1 };
        break;
      case "dateDesc":
        sort = { date: -1 };
        break;
      case "dateAsc":
        sort = { date: 1 };
        break;
    }
  }

  if(start == 1) {
    start = 0;
  } else {
    start = (start * 4) - 4; 
  }

  var count = await countUserPosts(email);

  userPosts
    .find({
      email: email
    })
    .skip(parseInt(start))
    .limit(5)
    .sort(sort)
    .toArray((err, response) => {
      if (err) {
        res.status(200).send({
          code: 500,
        });
      }

      res.status(200).send({
        code: 200,
        data: response,
        count: count,
      });
    });
});

app.post("/api/search", async (req, res) => {
  const startTime = Date.now();

  var searchText = req.body.text;
  var start = req.body.pageIndex;

  if(start == 1) {
    start = 0;
  } else {
    start = (start * 10) - 10;
  }

  var filters = req.body.filters;

  let query = {};

  (query.$text = { $search: searchText }),
    {
      score: {
        $meta: "textScore",
      },
    };

  if (filters) {
    for (const key in filters) {
      if (filters[key] != "" && filters[key] != 'none') {
        if (key.includes("Min") || key.includes("Max")) {
          query[key.substring(0, key.indexOf("M"))] = {
            $gte: parseInt(filters[key.substring(0, key.indexOf("M")) + "Min"]),
            $lte: parseInt(filters[key.substring(0, key.indexOf("M")) + "Max"]),
          };
        } else {
          query[key] = filters[key];
        }
      }
    }
  }

  var count = await countSearchResults(query);

  userPosts
    .find(query)
    .skip(parseInt(start))
    .limit(10)
    .sort({
      score: {
        $meta: "textScore",
      },
      _id: 1,
    })
    .toArray((err, response) => {
      if (err) {
        res.status(200).send({
          code: 500,
        });
      }

      const end = Date.now();
      const timeTaken = (end - startTime) / 1000;
      
      res.status(200).send({
        code: 200,
        data: response,
        count: count,
        time: timeTaken,
      });
    });
});

async function countSearchResults(query) {
  const count = await userPosts.countDocuments(query);
  return count;
}

app.post("/api/home", async (req, res) => {
  var posts = [];
  var vipPosts = [];

  var result = await userPosts
    .find()
    .limit(8)
    .sort({
      $natural: -1,
    })
    .toArray(function (err, results) {
      if (results) {
        results.forEach((result) => {
          posts.push({
            id: result._id,
            email: result.email,
            animal: result.animal,
            breed: result.breed,
            price: result.price,
            age: result.age,
            ageType: result.ageType,
            postType: result.postType.toUpperCase(),
            date: result.date,
            imgs: result.img_path,
            vip: result.vip
          });
        });
      }
    });

        var vipResult = await userPosts
      .find({
        vip: true
      })
      .limit(4)
      .sort({
        expires: -1,
      })
      .toArray(function (err, results) {
        if (results) {
          results.forEach((result) => {
            vipPosts.push({
              id: result._id,
              email: result.email,
              animal: result.animal,
              breed: result.breed,
              price: result.price,
              age: result.age,
              ageType: result.ageType,
              postType: result.postType.toUpperCase(),
              date: result.date,
              imgs: result.img_path,
              vip: result.vip
            });
          });
        }
                res.status(200).send({
          code: 200,
          posts: posts,
          vipPosts: vipPosts
        });

    });

});

app.post("/api/delete", (req, res) => {
  userPosts.deleteOne({ _id: req.body.id });

  res.status(200).send({
    code: 200,
  });
});

app.post("/api/payment", (req, res) => {

  res.status(200).send({
    code: 200,
  });
});

app.post("/api/buyVip", async (req, res) => {
  var postID = req.body.id;
  var days = parseInt(req.body.days);
  var authToken = req.body.authToken;

  var user = jwt.verify(authToken, publicKEY, signOptions);

  if(user) {
    if(days > 0 && days <= 7) {
      user = await getUserBalance(user['id']);
      if(user.balance - days * 2 >= 0) {
        var updated = await users.findOneAndUpdate({
          _id: user._id
        }, 
          {
            $inc: { balance: -2 }
          },
          {
            returnDocument: "after"
          }
        )

        var payload = {
          id: updated.value._id,
          username: updated.value.username,
          email: updated.value.email,
          phone: updated.value.phone,
          instagram: updated.value.instagram,
          facebook: updated.value.facebook,
          city: updated.value.city,
          balance: updated.value.balance,
          pfp: updated.value.pfp,
        };


        var token = jwt.sign(payload, privateKEY, signOptions);

        await userPosts.updateOne({
          _id: postID
        }, 
          {
            $set: {
              vip: true,
              expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            }
          }
        )

        res.status(200).send({
            code: 200,
            token: token
        });
      } else {
        res.status(200).send({
            code: 500,
            message: 'Not Enough Balance'
        });
      }
    }
  }
});

function getUserBalance(id) {
  return users.findOne({
    _id: id
  })
} 

app.post("/api/renew", async (req, res) => {
  var id = req.body.id;
  var authToken = req.body.authToken;
  var user = jwt.verify(authToken, publicKEY, signOptions);

  var { balance } = await getUserBalance(user['id']);
  
  if(balance - 0.25 >= 0) {
    
    var updated = await users.findOneAndUpdate({
        _id: user.id
      }, 
      {
        $inc: { balance: -0.25 }
      },
      {
        returnDocument: "after"
      }
    )
    
    var payload = {
      id: updated.value._id,
      username: updated.value.username,
      email: updated.value.email,
      phone: updated.value.phone,
      instagram: updated.value.instagram,
      facebook: updated.value.facebook,
      city: updated.value.city,
      balance: updated.value.balance,
      pfp: updated.value.pfp,
    };

    var token = jwt.sign(payload, privateKEY, signOptions);

    await userPosts.updateOne({
      _id: id
    },
      {
        $set: { expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) }
      }
    )

    res.status(200).send({
      code: 200,
      token: token
    });
  } else {
    res.status(200).send({
      code: 500,
      message: "Not Enought Balance",
    });
  }
});


app.listen(3000, () => console.log(`Started server at http://localhost:3000!`));

