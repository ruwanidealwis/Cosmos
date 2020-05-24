// make API calls to NASA API...
const config = require("../config.js");
let api_key = config.apiKey;
console.log(api_key);
let password = config.password;
const axios = require("axios"); //make API requests with AXOIS

let lastCompletedYear = new Date().getFullYear() - 1;
let yearArray = [lastCompletedYear - 2010];
let index = 0;
for (i = 2010; i < lastCompletedYear; i++) {
  //console.log(index);
  yearArray[index] = i;
  index++;
}
//console.log(yearArray);

console.log(lastCompletedYear);
//taken from: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//getting the astronomy picture of the day

const apod = async function(month, day) {
  let year = randomInteger(2012, lastCompletedYear); //image quality much better
  //console.log(year);
  return axios
    .get(`https://api.nasa.gov/planetary/apod?`, {
      params: {
        api_key: api_key,
        date: `${year}-${month}-${day}`
      }
    })
    .then(response => {
      let apodInfo = {
        url: response.data.url,
        explanation: response.data.explanation
      };
      return apodInfo;
    })
    .catch(error => {
      console.log(error);
    });
};

//get Mars Rover for specific date
const roverImages = async function(month, day) {
  //get years between 2015 and 2020
  //let year = randomInteger(2015, lastCompletedYear); //get a random year
  let returnVal = await axios
    .get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?`, {
      params: {
        earth_date: `2016-${month}-${day}`,
        camera: "mast",
        api_key: api_key
      }
    })
    .then(response => {
      let images = [];
      for (l = 0; l < 3; l++) {
        images[l] = { url: response.data.photos[l].img_src };
      }

      return images;
    })
    .catch(error => {
      console.log(error);
    });
  return returnVal;
};

const asteroidInfo = async function(date) {
  console.log("making request");
  let returnVal = await axios
    .get(`https://api.nasa.gov/neo/rest/v1/feed?`, {
      params: {
        start_date: date,
        end_date: date,
        api_key: api_key
      }
    })
    .then(response => {
      //console.log("here!");
      console.log(response.data);
      let asteroidArray = [];
      //console.log(asteroidArray);
      let countVal = 3;
      console.log(response.data.element_count);
      console.log(typeof response.data.element_count);
      if (response.data.element_count < countVal) {
        countVal = response.data.element_count;
        console.log("conut valuejiozdjioasd");
      }
      for (let k = 0; k < countVal; k++) {
        //console.log(k);
        //console.log(date);
        //console.log(response.data.near_earth_objects);
        let asteroid = response.data.near_earth_objects[date][k];

        // console.log(asteroid);
        let name = asteroid.name;
        let closestTime =
          asteroid.close_approach_data[0].close_approach_date_full;
        let missDistanceKM =
          asteroid.close_approach_data[0].miss_distance.kilometers;
        // console.log(asteroid.close_approach_data[0].miss_distance.kilometers);
        let luminosity = asteroid.absolute_magnitude_h;
        let maxDiameter =
          asteroid.estimated_diameter.meters.estimated_diameter_max;
        //let closestTime = asteroid.close_approach_data.close_approach_date_full; //need to get the time out of it later

        let velocityKM =
          asteroid.close_approach_data[0].relative_velocity
            .kilometers_per_second;

        let obj = {
          name: name,
          luminosity: luminosity,
          maxDiameter: maxDiameter,
          closestTime: closestTime,
          velocityKM: velocityKM,
          missDistanceKM: missDistanceKM
        };
        //console.log("jsaiodjasiodjasoidjaiosdjio");
        //console.log(obj);
        asteroidArray[k] = obj;
        // console.log(asteroidArray[0]);
      }
      //console.log(asteroidArray);

      let count = response.data.element_count;
      // console.log(count);
      let hazardCount = response.data.near_earth_objects[date].filter(
        asteroid => {
          asteroid.is_potentially_hazardous_asteroid == true;
        }
      );

      let asteroidObj = {
        count: count,
        hazardCount: hazardCount.length,
        asteroidInfo: asteroidArray
      };
      //console.log(asteroidObj);
      return asteroidObj;
    })
    .catch(error => {
      console.log("hi");
    });
  return returnVal;
};

const interPlanetaryShock = async function(month, day) {
  let promises = [];
  let returnVal = {};
  for (i = 0; i < yearArray.length; i++) {
    let response = await axios
      .get(`https://api.nasa.gov/DONKI/IPS?`, {
        params: {
          startDate: `${yearArray[i]}-${month}-${day}`,
          endDate: `${yearArray[i]}-${month}-${day}`,
          api_key: api_key
        }
      })
      .then(response => {
        if (response.data != "") {
          let events = response.data.filter(event => {
            //console.log(response.data);
            let eventDate = new Date(event.eventTime);
            let eventmonth = eventDate.getUTCMonth();
            let eventDay = eventDate.getUTCDate(); //
            return eventDay == day && eventmonth + 1 == month;
          });
          if (events.length != 0) {
            let location = events[0].location;
            let time = events[0].eventTime;
            let ipsObejct = {
              location: location,
              time: time
            };
            i = yearArray.length; //short circuit the loop
            return ipsObejct;
            //no need to keep making requests
          } else {
            console.log("empty");
            return {};
          }
        }
      })
      .catch(error => {
        console.log(error);
      });

    returnVal = response;
  }
  return returnVal;
};
//date has to be in UTC!

const solarFlare = async function(month, day) {
  let promises = [];
  let returnVal = {};
  for (j = 0; j < yearArray.length; j++) {
    let response = await axios
      .get(`https://api.nasa.gov/DONKI/FLR?`, {
        params: {
          startDate: `${yearArray[j]}-${month}-${day}`,
          endDate: `${yearArray[j]}-${month}-${day}`,
          api_key: api_key
        }
      })
      .then(response => {
        if (response.data != "") {
          //console.log("The year" + yearArray[i]);
          let events = response.data.filter(event => {
            let eventDate = new Date(event.beginTime);
            let eventmonth = eventDate.getUTCMonth();
            let eventDay = eventDate.getUTCDate(); //

            return eventDay == day && eventmonth + 1 == month;
          });

          if (events != [] && events != null) {
            //get all data

            let solareFlare = events[0];
            let peakTime = solareFlare.peakTime;
            let classType = solareFlare.classType;
            let sourceLocation = solareFlare.sourceLocation;
            let solareFlareObj = {
              peakTime: peakTime,
              class: classType,
              location: sourceLocation
            };

            j = yearArray.length; //short circuit the loop
            return solareFlareObj;

            //no need to keep making requests
          } else {
            return {};
          }
        }
      })
      .catch(error => {
        console.log(error);
        console.log("hi");
      });

    returnVal = response;
    //console.log("i is" + j);
  }
  return returnVal;
};

const cme = async function(month, day) {
  let promises = [];
  let returnVal = {};
  for (i = 0; i < yearArray.length; i++) {
    let response = await axios
      .get(`https://api.nasa.gov/DONKI/CME?`, {
        params: {
          startDate: `${yearArray[i]}-${month}-${day}`,
          endDate: `${yearArray[i]}-${month}-${day}`,
          api_key: api_key
        }
      })
      .then(response => {
        if (response.data != "") {
          let events = response.data.filter(event => {
            let eventDate = new Date(event.startTime);
            console.log(eventDate);
            let eventmonth = eventDate.getUTCMonth();
            let eventDay = eventDate.getUTCDate(); //
            return eventDay == day && eventmonth + 1 == month;
          });
          if (events != []) {
            //get all data
            let cme = events[0];
            //console.log(cme);
            let longitude = cme.cmeAnalyses[0].longitude;
            let latitude = cme.cmeAnalyses[0].latitude;
            let speed = cme.cmeAnalyses[0].speed;
            let type = cme.cmeAnalyses[0].type;
            let cmeObj = {
              longitude: longitude,
              latitude: latitude,
              speed: speed,
              type: type
            };

            i = yearArray.length; //short circuit the loop
            return cmeObj;
            //no need to keep making requests
          } else {
            return {};
          }
        }
      })
      .catch(error => {
        console.log(error);
      });

    returnVal = response;
  }
  return returnVal;
};

const geomagneticStorm = async function(month, day) {
  let promises = [];
  let returnVal = {};
  for (i = 0; i < yearArray.length; i++) {
    let response = await axios
      .get(`https://api.nasa.gov/DONKI/GST?`, {
        params: {
          startDate: `${yearArray[i]}-${month}-${day}`,
          endDate: `${yearArray[i]}-${month}-${day}`,
          api_key: api_key
        }
      })
      .then(response => {
        if (response.data != "") {
          let events = response.data.filter(event => {
            //console.log(response.data);
            let eventDate = new Date(event.startTime);
            let eventmonth = eventDate.getUTCMonth();
            let eventDay = eventDate.getUTCDate(); //
            return eventDay == day && eventmonth + 1 == month;
          });
          if (events.length != 0) {
            let startTime = events[0].startTime;
            let KPIndex = events[0].allKpIndex[0].kpIndex;
            let gmsObejct = {
              startTime: startTime,
              KPIndex: KPIndex
            };
            i = yearArray.length; //short circuit the loop
            return gmsObejct;
          } else {
            return {}; //re
          }
        }
      })
      .catch(error => {
        console.log(error);
      });

    returnVal = response;
  }
  return returnVal;
};
//https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2014-7-3&camera=mast&api_key=8pclHL9dk6AlfUwXK3RmkeLYaf0QbkjbnfM304ev

//get solar flare for a specific date

//get  coronal mass ejections

//if coronal mass ejection exists ==> get analysis

//get geomagnetic storm for a specific date

// get astronomy picture of the day
//export everything...
exports.apod = apod;
exports.roverImages = roverImages;
exports.cme = cme;
exports.solarFlare = solarFlare;
exports.asteroidInfo = asteroidInfo;
exports.interPlanetaryShock = interPlanetaryShock;
exports.geomagneticStorm = geomagneticStorm;
