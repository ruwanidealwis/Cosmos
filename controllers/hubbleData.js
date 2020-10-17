//This data was taken from: https://imagine.gsfc.nasa.gov/hst_bday/data.csv
var Papa = require("papaparse"); //import sunCalc
var moment = require("moment"); //import sunCalc
var path = require("path");
var fs = require("fs"); //import sunCalc
//function from: https://stackoverflow.com/questions/31375531/how-to-use-promises-with-papaparse
exports.getHubbleImage = async (date) => {
  const myFile = fs.createReadStream(
    path.join(__dirname, ".", "data", "data.csv")
  );
  console.log(date);
  console.log(myFile);
  let url = await papaPromise(myFile, date);
  return url;
};

const papaPromise = (importFile, date) =>
  new Promise((resolve, reject) => {
    Papa.parse(importFile, {
      dynamicTyping: true,
      quotes: true,
      delimiter: ",",
      header: true,
      complete: (results) => {
        console.log("hi");
        let hubbleImageRow = results.data.filter((day) => day.Date == date);
        console.log(hubbleImageRow);
        let url =
          "https://imagine.gsfc.nasa.gov/hst_bday/images/" +
          hubbleImageRow[0].Image;
        console.log(url);
        resolve(url);
      },
      err: (err) => {
        reject(err);
      },
    });
  });

/*Papa.parsePromise = function (file) {
  return new Promise(function (complete, error) {
    Papa.parse(file, { complete, error });
  });
};

Papa.parsePromise(myFile, {
  dynamicTyping: true,
  quotes: true,
  delimiter: ",",
  header: true,
}).then(function (results) {
  console.log(results.data);
});*/
//getHubbleImage("September 10 2019");
