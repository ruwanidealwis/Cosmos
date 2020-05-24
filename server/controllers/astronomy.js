const Astronomy = require("astronomy-engine");
const geoTz = require("geo-tz");

//get planet positions
let planetArray = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune"
];
let observer = Astronomy.MakeObserver(45.424721, -75.695, 70);
exports.planets = date => {
  let riseSetArray = [];
  planetArray.forEach(planet => {
    console.log(Astronomy.SearchRiseSet(planet, observer, 1, date, 1));
    let obj = {
      name: planet,
      riseTime: Astronomy.SearchRiseSet(planet, observer, 1, date, 1).date,
      setTime: Astronomy.SearchRiseSet(planet, observer, -1, date, 1).date
    };
    riseSetArray.push(obj);
  });

  return riseSetArray;
};

planetArray.forEach(planet => {
  console.log(planet);
  //console.log(Astronomy.Elongation(planet, new Date("2020-05-23")));
  //console.log(Astronomy.HelioVector(planet, new Date("2020-05-17")));
  console.log(
    Astronomy.SearchHourAngle(
      planet,
      observer,
      0,
      new Date("2020-05-23")
    ).time.date.toLocaleString("en-Us", "en-US", {
      timezone: geoTz(45.424721, -75.695)
    })
  );
  console.log();
  console.log(
    Astronomy.SearchHourAngle(planet, observer, 12, new Date("2020-05-23"))
  );
  //console.log(
  // Astronomy.SearchRiseSet(planet, observer, -1, new Date("2010-09-29"), 1);
  //);
});
