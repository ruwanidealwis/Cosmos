let express = require("express");

var router = express.Router();
router.get("/", (req, res, next) => {
  res.send("API working properly");
});
module.exports = router;
