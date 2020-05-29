const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env" });
if (dotenv.error) {
  throw dotenv.error;
} else {
  console.log("hi");
  console.log(__dirname);
}

module.exports = {
  apiKey: process.env.API_KEY,
  password: process.env.DATABASE_PASSWORD
};
