//main controller
//control all the app handling and routes
let moonController = require("../controllers/moonInfo"); //get the spotifyController modules
let NasaController = require("../controllers/NasaAPI");
let HubbleData = require("../controllers/hubbleData.js");
let express = require("express");
let databaseConnect = require("../Models/connect");
let spaceInfo = require("../Models/spaceInfo.js");
databaseConnect.connect();
//handles all the possible routes
module.exports = (app) => {
  app.get("/", (req, res) => {
    //load pain page
    //should allow user to enter date and location....
    res.render("main.pug");
  });
  app.post("/", (req, res) => {
    //get information about date and year....
    req.session.date = req.body.date; //get the date from the body...
    res.redirect(
      url.format({
        pathName: "/space",
        query: {
          date: date,
        },
      })
    );
  });
  app.post("/help", (req, res) => {
    console.log("req...");
    console.log(req.body);
  });
  app.get("/space/:date", (req, res) => {
    let dateArray = req.params.date.split("-"); //"YYYY-MM-DD"
    let dateToAdd = new Date(
      parseInt(dateArray[0], 10),
      parseInt(dateArray[1], 10) - 1,
      parseInt(dateArray[2], 10)
    );

    req.session.date = dateToAdd;
    let exist = true;
    let spaceObj = {};

    //must now call all the methods....but check if database already has queried for this data to avoid unessecary calls
    spaceInfo.find({ date: req.session.date }, (err, docs) => {
      if (err) {
        console.log(err);
      } else if (docs.length == 0) {
        req.session.moonInfo = moonController.moon(req.session.dateToAdd); //get information about the moon
        console.log(req.session.moonInfo);

        spaceObj.date = req.session.date;
        spaceObj.moon = req.session.moonInfo;

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
          .then((data) => NasaController.solarFlare(dateArray[1], dateArray[2]))
          .then((data) => {
            spaceObj.solarFlare = data;
            return spaceObj;
          })
          .then((data) =>
            NasaController.geomagneticStorm(dateArray[1], dateArray[2])
          )
          .then((data) => {
            spaceObj.geomagneticStorm = data;
          })
          .then((data) =>
            NasaController.interPlanetaryShock(dateArray[1], dateArray[2])
          )
          .then((data) => {
            spaceObj.interPlanetaryShock = data;
            return spaceObj;
          })
          .then((data) => {
            return HubbleData.getHubbleImage(
              req.session.date.toLocaleString("default", {
                month: "long",
              }) +
                " " +
                req.session.date.getDate() +
                " 2019"
            );
          })
          .then((data) => {
            spaceObj.hubble = data;
            spaceInfo.create(spaceObj).then((data) => res.send(data));
            console.log(spaceObj);
          });
      } else {
        //value exists
        spaceInfo.deleteMany();
        console.log("already have data!");
        res.send(docs[0]);
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
  app.get("*", (req, res) => {
    res.status(404).send("Wrong Page");
  });
};
