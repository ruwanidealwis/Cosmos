const mongoose = require("mongoose");
const config = require("../config.js");
//connect to database...
let password = config.password;
console.log(password);
let mongoDBUrl = `mongodb+srv://ruwani:${password}@cosmosdatabase-sqsno.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(mongoDBUrl);

//check if connection is established
mongoose.connection
  .once("open", () => {
    console.log("conneced to database!");
  })
  .on("error", error => {
    console.log(error);
  });
