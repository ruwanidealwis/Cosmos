let trimCanvas = require("trim-canvas");
window.onload = () => {
  console.log(trimCanvas);
  /*for (let i = 0; i < 200; i++) {
    let star = document.createElement("div");
    star.className = "star";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    document.body.appendChild(star);
  }*/
  $("#dateForm").submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: "GET",
      url: "/space/" + e.target[0].value,
      beforeSend: function () {
        $("#loadingImg").show();
      },
      complete: function () {
        $("#loadingImg").hide();
      },
      success: function (data) {
        console.log(data);
        createMyImage(data);
      },
    });
  });
};
async function createMyImage(spaceData) {
  let date = new Date(spaceData.date);
  console.log(date);
  console.log(spaceData);
  let img = document.createElement("img");

  img.setAttribute("id", "svg");
  img.setAttribute("width", "500");
  img.setAttribute("height", "200");
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "barcodeCanvas");
  canvas.setAttribute("width", 2000);
  canvas.setAttribute("height", 1200);

  canvas.style.width = "1000px";
  canvas.style.width = "400px";

  let ctx = canvas.getContext("2d");
  ctx.scale(2.5, 2.5);

  let barcodePalette = await getColors(spaceData);
  let index = drawBarcode(barcodePalette, spaceData, ctx);

  let textExplanation = `<strong>${
    spaceData.asteroids.asteroidInfo[0].missDistanceKM
  }:</strong> Miss distance of the first aesteroid to pass by earth on ${new Date(
    spaceData.date
  ).toDateString()}.<br><br>`;
  let explanation = `<strong>Bars 1-6:</strong> Dominant colour's of NASA's Astronomy Picture of the Day in ${new Date(
    spaceData.apod.date
  ).getFullYear()}.<br><br><strong>Bars 7-12:</strong> Dominant colours of the picture taken by the Hubble Telescope on this day in 2019. <br> <br> `;

  if (spaceData.solarFlare) {
    explanation =
      explanation +
      `<strong>Shades of Red:</strong> A Solar Flare occured on this day in ${new Date(
        spaceData.solarFlare.peakTime
      ).getFullYear()}.<br> <br>`;

    textExplanation =
      textExplanation +
      `<strong>${spaceData.solarFlare.location}:</strong> Area in space where the Solar Flare occured.<br> <br>`;
  }

  if (spaceData.interPlanetaryShock) {
    explanation =
      explanation +
      `<strong>Shades of Green:</strong> An interplanetary shock occured on this date in ${new Date(
        spaceData.interPlanetaryShock.time
      ).getFullYear()}.<br> <br>`;
    textExplanation =
      textExplanation +
      `<strong>${spaceData.interPlanetaryShock.location}</strong>: Area in space where the interplanetary shock occured.<br> <br>`;
  }

  if (spaceData.geomagneticStorm) {
    explanation =
      explanation +
      `<strong>Shades of Neon:</strong> on the this day in ${new Date(
        spaceData.geomagneticStorm.startTime
      ).getFullYear()} Geomagnetic Storm. The thickness of these bands depends on the disturbance caused by the storm.<br><br>`;
  }

  if (spaceData.asteroids.count < barcodePalette.length)
    explanation =
      explanation +
      `<strong>Band ${spaceData.asteroids.count}:</strong> Thicker and shorter than the rest because on this day ${spaceData.asteroids.count} asteroids were closest to earth on their path.<br>`;

  explanation = explanation + "<br>" + textExplanation;
  //console.log(trimCanvas);
  //canvas = trimCanvas(canvas);
  let barcode = document.getElementById("barcode");
  barcode.setAttribute("class", "align-middle");
  //check if canvas already exists

  let documentCanvas = document.getElementById("barcodeCanvas");
  let documentExplanation = document.getElementById("explanation");
  if (documentCanvas != null) {
    barcode.removeChild(documentCanvas);
    //if canvas present, so is text

    documentExplanation.removeChild(document.getElementById("explanationText"));
  }
  barcode.appendChild(canvas);

  document.getElementById("barcodeRendering").style.display = "block";
  documentExplanation.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "center",
    offset: { top: 300, left: 0 },
  });
  let div = document.createElement("div");
  div.setAttribute("id", "explanationText");

  $("html,body").animate(
    {
      scrollTop: $("#barcode").offset().top,
    },
    1000
  );
  div.innerHTML = explanation;

  documentExplanation.append(div);
}

async function getColors(spaceData) {
  let barcodePalette = [];
  let palette = await Vibrant.from(
    "https://cors-anywhere.herokuapp.com/" + spaceData.apod.url
  ).getPalette();

  let paletteKeys = Object.keys(palette);
  for (const key of paletteKeys) {
    console.log("hi");
    barcodePalette.push(palette[key].hex);
  }

  let Hubblepalette = await Vibrant.from(
    "https://cors-anywhere.herokuapp.com/" + spaceData.hubble
  ).getPalette();

  let HubblepaletteKeys = Object.keys(Hubblepalette);
  for (const key of HubblepaletteKeys) {
    console.log("hi");
    barcodePalette.push(Hubblepalette[key].hex);
  }

  if (spaceData.solarFlare) {
    console.log("hi");
    barcodePalette.push("#930000", "#fe8d0e", "#fe4b01", "#d80000", "#fedca2");
  }

  if (spaceData.interPlanetaryShock) {
    console;
    let greenArray = randomColor({ hue: "green", count: 5 });

    for (const color of greenArray) {
      console.log(color);
      barcodePalette.push(color);
    }
  }
  if (spaceData.geomagneticStorm) {
    barcodePalette.push("#02d4f4", "#05e3ba", "#a46f93", "#5954d1", "#ff6ec7");
  }
  return barcodePalette;
}

function drawBuildings(spaceData, canvas, randomSkyColor) {
  for (let i = 0; i < spaceData.asteroids.count; i++) {
    height = Math.random() * (Math.random() * 500) + 200;

    if (height > canvas.height) {
      console.log(height);
      height = height - (canvas.height - height) * 10;
    }
    console.log(height);
    width = Math.random() * 80 + 22;
    left = startWidth;

    if (left < 0) {
      left = 0;
    }
    if (left > canvas.width) {
      left = canvas.width - left - (Math.random() - 9);
    }
    console.log(width);
    var rect = new fabric.Rect({
      left: left,
      top: canvas.height - height,
      fill: "#242925",
      width: width,
      height: height,
    });

    /*rect.set(
      "shadow",
      new fabric.Shadow({
        lcolor: randomColor({
          luminosity: "dark",
          hue: randomSkyColor,
        }),
        blur: 8,
        offsetX: -2,
        offsetY: -2,
      })
    );*/

    canvas.add(rect);

    startWidth = startWidth + width;
  }
  startWidth = 0;
  for (let i = 0; i < spaceData.asteroids.count; i++) {
    height = Math.random() * (Math.random() * 500) + 250;

    if (height > canvas.height) {
      console.log(height);
      height = height - (canvas.height - height) * 10;
    }
    console.log(height);
    width = Math.random() * 80 + 22;
    left = startWidth;

    if (left < 0) {
      left = 0;
    }
    if (left > canvas.width) {
      left = canvas.width - left - (Math.random() - 9);
    }
    console.log(width);
    var rect = new fabric.Rect({
      left: left,
      top: canvas.height - height,
      fill: randomColor({
        luminosity: "dark",
        hue: randomSkyColor,
      }),
      width: width,
      height: height,
    });

    /*rect.set(
      "shadow",
      new fabric.Shadow({
        lcolor: randomColor({
          luminosity: "dark",
          hue: randomSkyColor,
        }),
        blur: 8,
        offsetX: -2,
        offsetY: -2,
      })
    );*/

    canvas.add(rect);

    for (let i = 10; i < height - 10; i++) {
      console.log("hi");
      let light = new fabric.Rect({
        left: startWidth + 10,
        top: canvas.height - i,
        fill: randomColor({
          hue: "cfc847",
          luminosity: "light",
        }),
        width: width - 20,
        height: 6,
      });
      canvas.add(light);
      i = i + 20;
    }

    startWidth = startWidth + width;
  }
}

function drawLights(canvas) {
  console.log("added path");
  startWidth = 0;

  var path = new fabric.Path(
    "M1 273.746C6.64223 266.787 3.45718 255.399 6.11111 247.08C13.0649 225.282 37.3977 211.953 57 203.524C81.9527 192.794 104.891 188.741 129.667 201.024C153.765 212.971 177.364 227.426 203.778 233.802C206.647 234.494 212.29 235.683 215.667 235.857C218.462 236.002 219.285 232.727 221.444 231.191C227.317 227.012 241.607 219.324 246.333 216.635C267.488 204.6 288.423 192.234 309.111 179.413C322.952 170.835 333.366 164.111 343.222 151.302C360.904 128.323 376.848 102.689 408.333 98.7462C436.617 95.204 465.722 111.885 490.556 122.913C499.919 127.071 509.17 131.487 518.611 135.468C524.871 138.108 527.09 139.128 533 136.302C556.942 124.851 580.95 112.358 602.167 96.3018C612.581 88.4203 620.594 79.312 628.444 68.9684C635.347 59.8746 641.494 49.4367 650.944 42.6351C664.279 33.0381 684.395 38.0619 699.111 40.9684C713.078 43.7269 731.437 53.5806 745.778 49.8018C751.806 48.2132 762.767 42.098 767.444 39.6351C780.766 32.6208 793.934 25.5331 805.889 16.3018C811.679 11.8305 816.878 5.17039 823.111 1.30175C826.363 -0.716947 819.245 7.9256 817.667 11.4129C810.194 27.9197 816.246 46.142 817.111 63.3573C817.423 69.5704 820.094 84.0831 813.444 88.3018C787.113 105.007 751.736 104.852 721.833 104.413C703.978 104.151 684.818 101.695 667.333 106.968C653.309 111.198 642.819 121.365 632.722 131.357C627.971 136.059 618.653 146.013 613.333 150.746C604.386 158.706 595.687 160.164 583.889 161.746C573.491 163.141 552.024 165.187 541.889 165.413C522.392 165.847 504.028 162.37 484.889 159.413C454.289 154.685 416.587 147.81 388.222 164.413C373.776 172.868 365.96 186.645 357.889 200.413C354.752 205.763 352.068 211.378 348.778 216.635C340.345 230.11 331.588 233.452 316.278 238.08C301.548 242.531 265.922 251.699 252.667 254.635C228.485 259.992 201.944 267.5 178.111 256.524C159.966 248.167 174.93 249.878 154 244.302C135.459 239.362 113.197 237.728 94.1111 238.746C65.1948 240.289 41.1435 258.862 27.3333 283.913C25.6801 286.912 24.4397 296.491 18.8889 293.08C12.5861 289.205 10.7538 281.559 7.11111 275.691C5.82341 273.616 2.96181 267.746 1 267.746",
    {
      stroke: "#42de61",
      fill: "#42de61",
      angle: 20,
    }
  );

  path.set({ left: 0, top: -30 });
  canvas.add(path);

  var path2 = new fabric.Path(
    "M1 273.746C6.64223 266.787 3.45718 255.399 6.11111 247.08C13.0649 225.282 37.3977 211.953 57 203.524C81.9527 192.794 104.891 188.741 129.667 201.024C153.765 212.971 177.364 227.426 203.778 233.802C206.647 234.494 212.29 235.683 215.667 235.857C218.462 236.002 219.285 232.727 221.444 231.191C227.317 227.012 241.607 219.324 246.333 216.635C267.488 204.6 288.423 192.234 309.111 179.413C322.952 170.835 333.366 164.111 343.222 151.302C360.904 128.323 376.848 102.689 408.333 98.7462C436.617 95.204 465.722 111.885 490.556 122.913C499.919 127.071 509.17 131.487 518.611 135.468C524.871 138.108 527.09 139.128 533 136.302C556.942 124.851 580.95 112.358 602.167 96.3018C612.581 88.4203 620.594 79.312 628.444 68.9684C635.347 59.8746 641.494 49.4367 650.944 42.6351C664.279 33.0381 684.395 38.0619 699.111 40.9684C713.078 43.7269 731.437 53.5806 745.778 49.8018C751.806 48.2132 762.767 42.098 767.444 39.6351C780.766 32.6208 793.934 25.5331 805.889 16.3018C811.679 11.8305 816.878 5.17039 823.111 1.30175C826.363 -0.716947 819.245 7.9256 817.667 11.4129C810.194 27.9197 816.246 46.142 817.111 63.3573C817.423 69.5704 820.094 84.0831 813.444 88.3018C787.113 105.007 751.736 104.852 721.833 104.413C703.978 104.151 684.818 101.695 667.333 106.968C653.309 111.198 642.819 121.365 632.722 131.357C627.971 136.059 618.653 146.013 613.333 150.746C604.386 158.706 595.687 160.164 583.889 161.746C573.491 163.141 552.024 165.187 541.889 165.413C522.392 165.847 504.028 162.37 484.889 159.413C454.289 154.685 416.587 147.81 388.222 164.413C373.776 172.868 365.96 186.645 357.889 200.413C354.752 205.763 352.068 211.378 348.778 216.635C340.345 230.11 331.588 233.452 316.278 238.08C301.548 242.531 265.922 251.699 252.667 254.635C228.485 259.992 201.944 267.5 178.111 256.524C159.966 248.167 174.93 249.878 154 244.302C135.459 239.362 113.197 237.728 94.1111 238.746C65.1948 240.289 41.1435 258.862 27.3333 283.913C25.6801 286.912 24.4397 296.491 18.8889 293.08C12.5861 289.205 10.7538 281.559 7.11111 275.691C5.82341 273.616 2.96181 267.746 1 267.746",
    {
      stroke: "#42de61",
      fill: "#42de61",
    }
  );
  path2.set({ left: 200, top: -100 });
  canvas.add(path2);
}

function drawBarcode(barcodePalette, spaceData, ctx) {
  let index = 0;
  let asteroidDrawn = 0;
  let interval = 10 - Math.floor(Math.random() * 10);
  console.log(interval);

  for (const [count, color] of barcodePalette.entries()) {
    console.log(count);
    console.log(color);
    height = 380;
    if (
      count === 0 ||
      count === 1 ||
      count === barcodePalette.length - 1 ||
      count === barcodePalette.length - 2
    ) {
      console.log("hi");
      height = 420;
    }
    if (count + 1 === spaceData.asteroids.count) {
      console.log("");
      ctx.lineWidth = 25;
      asteroidDrawn = asteroidDrawn + 1;
      height = 360;
    } else {
      ctx.lineWidth = 10 * Math.random() + 5;
    }

    if (count == 2) {
    }

    if (spaceData.geomagneticStorm && count >= barcodePalette.length - 5) {
      console.log("storm....");
      console.log(spaceData.geomagneticStorm.KPIndex);
      ctx.lineWidth = (spaceData.geomagneticStorm.KPIndex / 3) * 10;
      console.log(ctx.lineWidth);
    }
    console.log(height);
    ctx.beginPath();
    ctx.moveTo(5 + index, 0);
    ctx.lineTo(5 + index, height);
    ctx.strokeStyle = color;
    ctx.stroke();
    index = index + 30;
  }

  writeText(ctx, spaceData, index);
  return index; //returns where the last bar is
}

function writeText(ctx, spaceData, index) {
  ctx.fillStyle = "white";
  ctx.font = "25px Arial";
  let text = spaceData.asteroids.asteroidInfo[0].missDistanceKM;
  let center = (index - 25) / 2; //center is whereever the last line is -30 -5
  if (spaceData.solarFlare) {
    text = text + "  " + spaceData.solarFlare.location; //bracode text is solarflare location
  }
  if (spaceData.interPlanetaryShock) {
    text = text + "  " + spaceData.interPlanetaryShock.location; //bracode text is planetary schok location
  }

  ctx.textAlign = "center";
  ctx.fillText(text, center, 430);
}
