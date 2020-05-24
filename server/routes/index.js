//main controller
//control all the app handling and routes
let moonController = require("../controllers/moonInfo"); //get the spotifyController modules
let NasaController = require("../controllers/NasaAPI");
let planetsController = require("../controllers/astronomy");
let express = require("express");
let databaseConnect = require("../Models/connect");
let spaceInfo = require("../Models/spaceInfo");
databaseConnect.connect();
var router = express.Router();
//handles all the possible routes

router.get("/", (req, res) => {
  //load pain page
  //should allow user to enter date and location....
  res.send("hi");
});
router.post("/", (req, res) => {
  //get information about date and year....
  req.session.date = req.body.date; //get the date from the body...
  res.redirect(
    url.format({
      pathName: "/space",
      query: {
        date: date
      }
    })
  );
});
router.get("/space/:date", (req, res) => {
  let dateArray = req.params.date.split("-"); //"YYYY-MM-DD"
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
        .then(apod => {
          spaceObj.apod = apod;
          return spaceObj;
        })
        .then(data => NasaController.asteroidInfo(req.params.date))
        .then(data => {
          spaceObj.asteroids = data;
          return spaceObj;
        })
        .then(data => NasaController.roverImages(dateArray[1], dateArray[2]))
        .then(marsRover => {
          spaceObj.marsRover = marsRover;
          return spaceObj;
        })
        .then(data => NasaController.cme(dateArray[1], dateArray[2]))
        .then(data => {
          console.log(data);
          spaceObj.coronalMassEjection = data;
          return spaceObj;
        })
        .then(data => NasaController.solarFlare(dateArray[1], dateArray[2]))
        .then(data => {
          spaceObj.solarFlare = data;
          return spaceObj;
        })
        .then(data =>
          NasaController.interPlanetaryShock(dateArray[1], dateArray[2])
        )
        .then(data => {
          spaceObj.interplanetaryShock = data;
          console.log(spaceObj);
        })
        .then(data =>
          NasaController.geomagneticStorm(dateArray[1], dateArray[2])
        )
        .then(data => {
          spaceObj.geomagneticStorm = data;
          console.log(spaceObj);
          spaceInfo.create(spaceObj).then(data => res.send(data));
        });
    } else {
      //value exists
      console.log("already have data!");
      res.send(docs);
    }
  });

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
