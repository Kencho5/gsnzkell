const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function webhook(req, res) {
  const { ref } = req.body;

  if (ref === "refs/heads/master") {
    console.log("Received push event for master branch");

    try {
      const { stdout: pullOutput } = await exec("git pull origin master");
      console.log(`Pull successful: ${pullOutput}`, "Building...");

      const { stdout: buildOutput } = await exec(
        "node --max_old_space_size=8192 ../node_modules/@angular/cli/bin/ng build"
      );
      console.log(`Build successful: ${buildOutput}`);

      const { stdout: deleteOutput } = await exec(
        "rm -rf /usr/share/nginx/pender"
      );
      console.log(`Delete successful: ${deleteOutput}`);

      const { stdout: mkdirOutput } = await exec(
        "mkdir /usr/share/nginx/pender"
      );
      console.log(`Create directory successful: ${mkdirOutput}`);

      const { stdout: copyOutput } = await exec(
        "cp -r ../dist/pender /usr/share/nginx/"
      );
      console.log(`Copy successful: ${copyOutput}`);

      const { stdout: restartOutput } = await exec("pm2 restart server");
      console.log(`Restart successful: ${restartOutput}`);

      return res.sendStatus(200);
    } catch (error) {
      console.error(`Error: ${error}`);
      return res.sendStatus(500);
    }
  } else {
    console.log(`Received push event for branch ${ref}`);
    return res.sendStatus(200);
  }
}

module.exports = webhook;
