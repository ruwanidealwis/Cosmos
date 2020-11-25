window.onload = () => {
  //console.logtrimCanvas);
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
        //console.logdata);
        createMyImage(data);
      },
    });
  });
};
async function createMyImage(spaceData) {
  let date = new Date(spaceData.date);
  //console.logdate);
  //console.logspaceData);
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
  ////console.logtrimCanvas);
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
    "https://peaceful-everglades-36723.herokuapp.com/" + spaceData.apod.url
  ).getPalette();

  let paletteKeys = Object.keys(palette);
  for (const key of paletteKeys) {
    barcodePalette.push(palette[key].hex);
  }

  let Hubblepalette = await Vibrant.from(
    "https://peaceful-everglades-36723.herokuapp.com/" + spaceData.hubble
  ).getPalette();

  let HubblepaletteKeys = Object.keys(Hubblepalette);
  for (const key of HubblepaletteKeys) {
    barcodePalette.push(Hubblepalette[key].hex);
  }

  if (spaceData.solarFlare) {
    barcodePalette.push("#930000", "#fe8d0e", "#fe4b01", "#d80000", "#fedca2");
  }

  if (spaceData.interPlanetaryShock) {
    console;
    let greenArray = randomColor({ hue: "green", count: 5 });

    for (const color of greenArray) {
      barcodePalette.push(color);
    }
  }
  if (spaceData.geomagneticStorm) {
    barcodePalette.push("#02d4f4", "#05e3ba", "#a46f93", "#5954d1", "#ff6ec7");
  }
  return barcodePalette;
}

function drawBarcode(barcodePalette, spaceData, ctx) {
  let index = 0;
  let asteroidDrawn = 0;
  let interval = 10 - Math.floor(Math.random() * 10);
  //console.loginterval);

  for (const [count, color] of barcodePalette.entries()) {
    //console.logcount);
    //console.logcolor);
    height = 380;
    if (
      count === 0 ||
      count === 1 ||
      count === barcodePalette.length - 1 ||
      count === barcodePalette.length - 2
    ) {
      //console.log"hi");
      height = 420;
    }
    if (count + 1 === spaceData.asteroids.count) {
      //console.log"");
      ctx.lineWidth = 25;
      asteroidDrawn = asteroidDrawn + 1;
      height = 360;
    } else {
      ctx.lineWidth = 10 * Math.random() + 5;
    }

    if (count == 2) {
    }

    if (spaceData.geomagneticStorm && count >= barcodePalette.length - 5) {
      //console.log"storm....");
      //console.logspaceData.geomagneticStorm.KPIndex);
      ctx.lineWidth = (spaceData.geomagneticStorm.KPIndex / 3) * 10;
      //console.logctx.lineWidth);
    }
    //console.logheight);
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
