var SunCalc = require("suncalc"); //import sunCalc
const geoTz = require("geo-tz");

/*let sunInfo = SunCalc.getTimes(date, latitude, long);
//modules.export.sunset = sunInfo.sunset.toLocaleDateString("en-US", {
  timezone: geoTz(latitude, long)
});
//get the time when the night starts
modules.export.night = sunInfo.night.toLocaleDateString("en-US", {
  timezone: geoTz(latitude, long)
});
//darkest moment of the night
modules.export.nadir = sunInfo.nadir.toLocaleDateString("en-US", {
  timezone: geoTz(latitude, long)
});*/
//get illumination and phase of the moon
exports.moon = date => {
  let moon = SunCalc.getMoonIllumination(date);
  let moonInfo = {
    phase: moon.phase,
    illuminationFraction: moon.fraction
  };
  return moonInfo;
};
