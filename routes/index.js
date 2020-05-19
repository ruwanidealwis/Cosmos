//main controller
//control all the app handling and routes
let moonController = require("../controllers/moonInfo"); //get the spotifyController modules
let NasaController = require("../controllers/NasaAPI");
let express = require("express");

//handles all the possible routes
module.exports = app => {
  app.get("/", (req, res) => {
    //load pain page
    //should allow user to enter date and location....
    res.send("hi");
  });
  app.post("/", (req, res) => {
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
  app.get("/space/:date", (req, res) => {
    let dateArray = req.params.date.split("-"); //"YYYY-MM-DD"
    let dateToAdd = new Date(
      parseInt(dateArray[0], 10),
      parseInt(dateArray[1], 10) - 1,
      parseInt(dateArray[2], 10)
    );
    //must now call all the methods....
    req.session.moonInfo = moonController.moon(dateToAdd); //get information about the moon
    console.log(req.session.moonInfo);
    let spaceObj = {};
    NasaController.apod(dateArray[1], dateArray[2])
      .then(picture => {
        spaceObj.picture = picture;
        return spaceObj;
      })
      .then(data =>
        NasaController.asteroidInfo(req.params.date)
          .then(data => {
            spaceObj.aseteroids = data;
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
            spaceObj.cme = data;
            return spaceObj;
          })
          .then(data =>
            NasaController.solarFlare(dateArray[1], dateArray[2])
              .then(data => {
                spaceObj.solarFlare = data;
                return spaceObj;
              })
              .then(data => console.log(data))
          )
      );

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
