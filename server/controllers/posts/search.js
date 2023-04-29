const { db, userPosts, users } = require("../../utils/db");

async function search(req, res) {
  const startTime = Date.now();

  try {
    const searchText = req.body.text;
    let animal = req.body.animal;
    const pageIndex = parseInt(req.body.pageIndex) || 1;
    const filters = req.body.filters || {};

    const start = pageIndex === 1 ? 0 : (pageIndex - 1) * 10;

    var query = {};

    if (animal) {
      if (animal != "all") {
        animal = animal.charAt(0).toUpperCase() + animal.slice(1);
        query = {
          animal: animal,
        };
      }
    } else {
      query = {
        breed: {
          $regex: new RegExp(searchText, "i"),
        },
      };
    }

    for (const key in filters) {
      if (key == "ageYears" && filters[key] == 0) {
        query[key] = {
          $gte: 0,
          $lte: 0
        };
      }
      if (key == "ageMonths" && filters[key] == 0) {
        query[key] = {
          $gte: 0,
          $lte: 100
        };
      }

      if (filters[key] && filters[key] !== "none") {
        if (key.includes("Min") || key.includes("Max")) {
          const field = key.substring(0, key.indexOf("M"));
          query[`${field}${filters.ageType}`] = {
            $gte: parseInt(filters[field + "Min"]),
            $lte: parseInt(filters[field + "Max"]),
          };
        } else if (key != "ageType") {
          query[key] = filters[key];
        }
      }
    }

    const count = await countSearchResults(query);
    const response = await userPosts
      .find(query)
      .skip(start)
      .limit(10)
      .sort({
        expires: -1,
      })
      .toArray();

    const end = Date.now();
    const timeTaken = (end - startTime) / 1000;

    res.status(200).send({
      code: 200,
      data: response,
      count: count,
      time: timeTaken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 500,
    });
  }
}
async function countSearchResults(query) {
  const count = await userPosts.countDocuments(query);
  return count;
}

module.exports = search;
