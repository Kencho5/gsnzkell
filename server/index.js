const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var bodyParser = require("body-parser");
const {
	v4: uuidv4
} = require("uuid");
const {
	MongoClient
} = require("mongodb");
const rateLimit = require("express-rate-limit");
const shell = require("shelljs");
var os = require("os");
const axios = require('axios');

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

app.post('/api/webhook', (req, res) => {
  const { ref } = req.body;

  if (ref === 'refs/heads/master') {
    console.log('Received push event for master branch');

    exec('git pull origin master', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${err}`);
        return res.sendStatus(500);
      }

      console.log(`Pull successful: ${stdout}`);

      exec('node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build', (err, stdout, stderr) => {
        if (err) {
          console.error(`Error: ${err}`);
          return res.sendStatus(500);
        }

        console.log(`Build successful: ${stdout}`);

        exec('cp -r ./dist/pender/* /usr/share/nginx/pender/', (err, stdout, stderr) => {
          if (err) {
            console.error(`Error: ${err}`);
            return res.sendStatus(500);
          }

          console.log(`Copy successful: ${stdout}`);

          exec('pm2 restart index', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error: ${err}`);
              return res.sendStatus(500);
            }

            console.log(`Restart successful: ${stdout}`);

            return res.sendStatus(200);
          });
        });
      });
    });
  } else {
    console.log(`Received push event for branch ${ref}`);
    return res.sendStatus(200);
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  
  users.findOne({ email }, async (err, responseDB) => {
    if (responseDB) {
      const result = await bcrypt.compare(password, responseDB.password);
      if (result) {
        const payload = {
          id: responseDB._id,
          username: responseDB.username,
          email,
          phone: responseDB.phone,
          instagram: responseDB.instagram,
          facebook: responseDB.facebook,
          city: responseDB.city,
          balance: responseDB.balance,
          pfp: responseDB.pfp,
        };
        const token = jwt.sign(payload, privateKEY, signOptions);
        
        res.status(200).send({
          status: 200,
          message: "Successfully Logged In!",
          token,
        });
      }
    } else {
      res.status(200).send({
        status: 500
      });
    }
  });
});

app.post("/api/register", (req, res) => {
  users.findOne({ email: req.body.email }, (err, response) => {
    if (response) {
      res.status(200).send({
        code: 500,
        message: "Email Already In Use.",
      });
    } else {
      bcrypt.hash(req.body.password, 10, (errorHash, hash) => {
        const data = {
          _id: uuidv4(),
          email: req.body.email,
          username: req.body.name,
          phone: req.body.phoneNumber,
          city: req.body.city,
          password: hash,
          balance: 0
        };
        users.insertOne(data, (err, result) => {
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
    }
  });
});

app.post("/api/user", async (req, res) => {
  const id = req.body.id;

  const result = await users.findOne({
    _id: id
  });

  const payload = {
    username: result.username,
    email: result.email,
    phone: result.phone,
    facebook: result.facebook,
    instagram: result.instagram,
    city: result.city,
    pfp: result.pfp,
  };

  res.status(200).send({
    code: 200,
    data: payload
  });

});

app.post("/api/userPosts", async (req, res) => {
  const email = req.body.email;
  let start = req.body.pageIndex;

	if (start == 1) {
		start = 0;
	} else {
		start = (start * 5) - 5;
	}

	var count = await countUserPosts(email);
	userPosts
		.find({
			email: email
		})
		.skip(parseInt(start))
		.limit(5)
    .sort({expires: -1})
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


app.post("/api/editPost", async (req, res) => {
  const details = req.body.details;

  const result = await userPosts.updateOne(
    { _id: details.id },
    {
      $set: {
        breed: details.breed,
        price: details.price,
        description: details.description,
        city: details.city,
        phone: details.phone,
      },
    }
  );

  if (result.acknowledged === true) {
    res.status(200).send({
      code: 200,
    });
  }
});

app.post("/api/update", (req, res) => {
  const {
    id,
    data: { name: username, email, phone, city, facebook, instagram },
    old_email,
    pfp,
    balance,
  } = req.body;

  var pfpSet = req.body.pfpSet;

  if (pfp) {
    savePfp(pfp, id);
    pfpSet = true;
  }

  users.updateOne(
    { email: old_email },
    {
      $set: {
        email,
        username,
        phone,
        city,
        facebook,
        instagram,
        pfp: pfpSet,
      },
    }
  );

  const payload = {
    id,
    username,
    email,
    phone,
    facebook,
    instagram,
    city,
    balance,
    pfp: pfpSet,
  };

  const token = jwt.sign(payload, privateKEY, signOptions);

  res.status(200).send({
    code: 200,
    token: token,
  });
});

function savePfp(pfp, id) {
  const savePath = os.platform() === "darwin"
    ? "../src/assets/images"
    : "/usr/share/nginx/pender/assets/images";

  const base64Data = pfp;

  // Extract the image type and base64 data from the string
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches) {
    console.error("Invalid base64 string");
    return;
  }

  const type = matches[1];
  const data = Buffer.from(matches[2], "base64");

  fs.writeFile(
    `${savePath}/user-pfps/${id}.jpg`,
    data,
    "base64",
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File saved!");
    }
  );
}

function insertTest() {
	var types = ["selling", "meeting", "adopting"];
	var animals = [{
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
			function(err) {}
		);
	}

	userPosts.insertMany(docs);
}
// insertTest()

app.post("/api/upload", async (req, res) => {
  const token = req.body.user;
  if (!jwt.verify(token, publicKEY, signOptions)) {
    res.status(500).send({
      code: 500,
    });
    return;
  }

  const postID = uuidv4();
  const { email, username } = jwt.verify(token, publicKEY, signOptions);
  const imgs = await saveImages(postID, req);
  const form = req.body.form;

  const data = {
    _id: postID,
    email,
    name: username,
    animal: form.animal,
    breed: form.breed,
    price: parseInt(form.price),
    age: parseInt(form.age),
    ageType: form.ageType,
    description: form.description,
    postType: form.postType,
    phone: form.phone,
    date: new Date(),
    img_path: imgs,
    city: form.city,
    vip: false,
    expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
  };

  userPosts.insertOne(data, function (err, result) {
    if (result) {
      res.status(200).send({
        code: 200,
        id: postID,
      });
    } else {
      res.status(500).send({
        code: 500,
      });
    }
  });
});

async function saveImages(postID, req) {
  const savePath = os.platform() === "darwin"
    ? "../src/assets/"
    : "/usr/share/nginx/pender/assets/";
  await fs.promises.mkdir(`${savePath}/postImages/${postID}`);

  const imgs = [];
  for (let i = 0; i < req.body.urls.length; i++) {
    const base64Data = req.body.urls[i];
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches) {
      continue;
    }

    const [, type, data] = matches;
    await fs.promises.writeFile(
      `${savePath}/postImages/${postID}/${i}.${type.split("/")[1]}`,
      Buffer.from(data, "base64"),
      "base64"
    );
    imgs.push(`${i}.${type.split("/")[1]}`);
  }
  return imgs;
}

app.post("/api/post", (req, res) => {
	var postID = req.body.id;

	userPosts.findOne({
			_id: postID,
		},
		function(err, result) {
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
  id = req.body.id;
	breed = req.body.breed;
	city = req.body.city;
	postType = req.body.postType;

	userPosts
		.find({
			$text: {
				$search: breed,
			},
			city: city,
      postType: postType,
      _id: { $ne: id }
		})
		.limit(3)
		.toArray((err, response) => {
			if (response) {
				res.status(200).send({
					code: 200,
					data: response,
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
		userPosts.countDocuments({
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

	users.findOne({
			email: req.body.email,
		},
		function(err, response) {
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

	var sort = {
		expires: -1
	};
	if (sortType) {
		switch (sortType) {
			case "expiresDesc":
				sort = {
					expires: -1
				};
				break;
			case "expiresAsc":
				sort = {
					expires: 1
				};
				break;
			case "dateDesc":
				sort = {
					date: -1
				};
				break;
			case "dateAsc":
				sort = {
					date: 1
				};
				break;
		}
	}

	if (start == 1) {
		start = 0;
	} else {
		start = (start * 5) - 5;
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

	if (start == 1) {
		start = 0;
	} else {
		start = (start * 10) - 10;
	}

	var filters = req.body.filters;

	let query = {};

	(query.$text = {
		$search: searchText
	}), {
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
		.toArray(function(err, results) {
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
		.toArray(function(err, results) {
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
	userPosts.deleteOne({
		_id: req.body.id
	});

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

	if (user) {
		if (days > 0 && days <= 7) {
			user = await getUserBalance(user['id']);
			if (user.balance - days * 2 >= 0) {
				var updated = await users.findOneAndUpdate({
					_id: user._id
				}, {
					$inc: {
						balance: -2
					}
				}, {
					returnDocument: "after"
				})

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
				}, {
					$set: {
						vip: true,
						expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
					}
				})

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

	var {
		balance
	} = await getUserBalance(user['id']);

	if (balance - 0.25 >= 0) {

		var updated = await users.findOneAndUpdate({
			_id: user.id
		}, {
			$inc: {
				balance: -0.25
			}
		}, {
			returnDocument: "after"
		})

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
		}, {
			$set: {
				expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
			}
		})

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

app.post("/api/reset", async (req, res) => {
  const accessToken = '';
  const fromEmail = 'support@pender.ge';
  const toEmail = req.body.email;
  const subject = 'Reset Password';
  const content = '<h1>Hello from Zoho Mail API!</h1><p>This is a test email sent using the Zoho Mail API in Node.js.</p>';

  sendEmail(accessToken, fromEmail, toEmail, subject, content);

  res.status(200).send({
    code: 200,
  });

});

const sendEmail = async (accessToken, from, to, subject, content) => {
  const apiUrl = 'https://mail.zoho.com/api/accounts/1000.KDTLXAFEOBAN3DBLHNMY9JRLCYPLEO/messages'; // Replace {account_id} with your Zoho Mail account ID
  const headers = {
    'Authorization': `Zoho-oauthtoken ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const data = {
    'from': { 'email': from },
    'to': [{ 'email': to }],
    'subject': subject,
    'content': content,
    'contentType': 'html',
  };

  try {
    const response = await axios.post(apiUrl, data, { headers: headers });
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', error.response.data);
  }
};

app.listen(3000, () => console.log(`Started server at http://localhost:3000!`));
