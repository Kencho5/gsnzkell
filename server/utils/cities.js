const fs = require('fs');

async function cities(req, res) {
  // Read the JSON file from disk
  fs.readFile('../src/assets/i18n/cities.json', (err, data) => {
    if (err) {
      // Handle the error
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Parse the JSON data and send it as a response
      const cities = JSON.parse(data);
      res.json(cities);
    }
  });
}

module.exports = cities;
