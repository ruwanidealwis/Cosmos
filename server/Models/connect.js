const mongoose = require("mongoose");
const config = require("../../config.js");
//connect to database...
let password = config.password;
console.log(password);

exports.connect = () => {
  let mongoDBUrl = `mongodb+srv://ruwani:${password}@cosmosdatabase-sqsno.mongodb.net/test?retryWrites=true&w=majority`;

  mongoose.connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  //check if connection is established
  mongoose.connection
    .once("open", () => {
      console.log("connected to database!");
    })
    .on("error", error => {
      console.log(error);
    });
};
