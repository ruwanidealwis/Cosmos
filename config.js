const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  apiKey: process.env.API_KEY,
  password: process.env.DATABASE_PASSWORD
};
