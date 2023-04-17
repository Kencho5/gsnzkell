const cron = require("node-cron");
const { db, userPosts, users } = require("../../utils/db");

// Schedule the task to run at noon every day
cron.schedule("0 */2 * * *", function () {
  console.log("Running task to update expired documents");

  // Update the vip field of expired documents
  db.collection("userPosts").updateMany(
    { vip: true, vipExpires: { $lt: new Date() } },
    { $set: { vip: false } },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result.modifiedCount + " documents updated");
      }
    }
  );
});
