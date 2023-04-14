const { exec } = require("child_process");

function webhook(req, res) {
  const { ref } = req.body;

  if (ref === "refs/heads/master") {
    console.log("Received push event for master branch");

    exec("git pull origin master", (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${err}`);
        return res.sendStatus(500);
      }

      console.log(`Pull successful: ${stdout}`, "building...");

      exec(
        "node --max_old_space_size=8192 ../node_modules/@angular/cli/bin/ng build",
        (err, stdout, stderr) => {
          if (err) {
            console.error(`Error: ${err}`);
            return res.sendStatus(500);
          }

          console.log(`Build successful: ${stdout}`);

          exec(
            "find /usr/share/nginx/pender ! -name 'assets' -type f -delete",
            (err, stdout, stderr) => {
              if (err) {
                console.error(`Error: ${err}`);
                return res.sendStatus(500);
              }

              console.log(`Delete successful: ${stdout}`);
            }
          );

          exec(
            "cp -r ../dist/pender/* /usr/share/nginx/pender/",
            (err, stdout, stderr) => {
              if (err) {
                console.error(`Error: ${err}`);
                return res.sendStatus(500);
              }

              console.log(`Copy successful: ${stdout}`);

              exec("pm2 restart server", (err, stdout, stderr) => {
                if (err) {
                  console.error(`Error: ${err}`);
                  return res.sendStatus(500);
                }

                console.log(`Restart successful: ${stdout}`);

                return res.sendStatus(200);
              });
            }
          );
        }
      );
    });
  } else {
    console.log(`Received push event for branch ${ref}`);
    return res.sendStatus(200);
  }
}

module.exports = webhook;
