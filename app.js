//require all modules
let express = require("express");
let cors = require("cors");
let index = require("./server/routes/index");
let apiTest = require("./server/routes/testConnection");
let session = require("express-session"); //allowing user sessions

//require created modules
let app = express();

//set view engine
app.set("view engine", "pug");
//app.use(cookieParser());
app.use(
  session({
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true
  })
);
//require node module for the spotify api
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/", index);
app.use("/testAPI", apiTest);
app.use(express.static("./public"));
//set up listening on local host
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => console.log(`app listening on port ${port}`)); //app is now listening on port

module.exports = app;
