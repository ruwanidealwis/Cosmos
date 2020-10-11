//main controller
//control all the app handling and routes
let moonController = require("../controllers/moonInfo"); //get the spotifyController modules
let NasaController = require("../controllers/NasaAPI");
let planetsController = require("../controllers/astronomy");
let moment = require("moment");
let express = require("express");
let databaseConnect = require("../Models/connect");
let spaceInfo = require("../Models/spaceInfo");
databaseConnect.connect();
var router = express.Router();
//handles all the possible routes
router.get("/", (req, res) => {
  //load pain page
  //should allow user to enter date and location....
  res.json({
    status: "success",
    message: "Welcome To What Were the Cosmos Doing",
  });
});
router.post("/", (req, res) => {
  //get information about date and year....
  req.session.date = req.body.date; //get the date from the body...

  if (req.session.date)
    res.redirect(
      url.format({
        pathName: "/space",
        query: {
          date: date,
        },
      })
    );
});
router.get("/space/:date", (req, res) => {
  let dateArray = req.params.date.split("-"); //"YYYY-MM-DD"
  const day = moment(req.params.date);
  if (!day.isValid() || !day.isSameOrBefore(moment())) {
    res.status(400).send({ error: "Bad Date" });
  } else {
    let dateToAdd = new Date(
      parseInt(dateArray[0], 10),
      parseInt(dateArray[1], 10) - 1,
      parseInt(dateArray[2], 10)
    );
    let exist = true;
    let spaceObj = {};
    //must now call all the methods....but check if database already has queried for this data to avoid unessecary calls
    spaceInfo.find({ date: dateToAdd }, (err, docs) => {
      if (err) {
        console.log(err);
      } else if (docs.length == 0) {
        req.session.moonInfo = moonController.moon(dateToAdd); //get information about the moon
        req.session.planets = planetsController.planets(dateToAdd);
        console.log(req.session.moonInfo);

        spaceObj.date = dateToAdd;
        spaceObj.moon = req.session.moonInfo;
        spaceObj.planets = req.session.planets;

        NasaController.apod(dateArray[1], dateArray[2])
          .then((apod) => {
            spaceObj.apod = apod;
            return spaceObj;
          })
          .then((data) => NasaController.asteroidInfo(req.params.date))
          .then((data) => {
            spaceObj.asteroids = data;
            return spaceObj;
          })
          .then((data) =>
            NasaController.roverImages(dateArray[1], dateArray[2])
          )
          .then((marsRover) => {
            spaceObj.marsRover = marsRover;
            return spaceObj;
          })
          .then((data) => NasaController.cme(dateArray[1], dateArray[2]))
          .then((data) => {
            console.log(data);
            spaceObj.coronalMassEjection = data;
            console.log("CORONAL MASS EJECTION");
            console.log(spaceObj.coronalMassEjection);
            return spaceObj;
          })
          .then((data) => NasaController.solarFlare(dateArray[1], dateArray[2]))
          .then((data) => {
            spaceObj.solarFlare = data;
            return spaceObj;
          })
          .then((data) =>
            NasaController.interPlanetaryShock(dateArray[1], dateArray[2])
          )
          .then((data) => {
            spaceObj.interplanetaryShock = data;
            return spaceObj;
          })
          .then((data) =>
            NasaController.geomagneticStorm(dateArray[1], dateArray[2])
          )
          .then((data) => {
            spaceObj.geomagneticStorm = data;
            console.log("FINAL DATA");
            console.log(spaceObj);
            spaceInfo.create(spaceObj).then((data) => res.send(data));
          });
      } else {
        //value exists
        console.log("already have data!");
        console.log(docs[0]);
        res.send(docs[0]);
      }
    });
  }

  /*let ips = NasaController.interPlanetaryShock(
      parseInt(dateArray[0], 10),
      parseInt(dateArray[1], 10)
    );
    let gms = NasaController.geomagneticStorm(
      parseInt(dateArray[0], 10),
      parseInt(dateArray[1], 10)
    );
    let solarFlare = NasaController.solarFlare(
      parseInt(dateArray[0], 10),
      parseInt(dateArray[1], 10)
    );

    
   
    console.log(asteroid);*/
});

module.exports = router;
