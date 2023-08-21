const db = require("../../config/mongoose");
const User = require("../user");
const bcrypt = require("bcryptjs");

db.once("open", () => {
  console.log("start user seeder!");

  const inputPassword = "12345678";
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(inputPassword, salt))
    .then((hash) =>
      User.create({
        name: "doctor1",
        email: "doctor1@example.com",
        password: hash,
      })
    )
    .then(() => {
      console.log("user seeder done");
      db.close();
    })
    .catch(console.error)
    .finally(() => process.exit());
});
