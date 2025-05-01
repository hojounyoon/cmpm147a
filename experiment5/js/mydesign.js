/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  return [
    {
      name: "Lunch atop a Skyscraper", 
      assetUrl: "img/lunch-on-a-skyscraper.jpg",
      credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932"
      shape: "rect"
    },
    {
      name: "Train Wreck", 
      assetUrl: "img/train-wreck.jpg",
      credit: "Train Wreck At Monteparnasse, Levy & fils, 1895"
      shape: "rect"
    },
    {
      name: "Migrant mother", 
      assetUrl: "img/migrant-mother.jpg",
      credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936"
      shape: "ellipse"
    },
    {
      name: "Disaster Girl", 
      assetUrl: "img/girl-with-fire.jpg",
      credit: "Four-year-old Zoë Roth, 2005"
      shape: "ellipse"
    },
    {
      name: "Santa Cruz Sunset", 
      assetUrl: "https://cdn.glitch.global/ef4f43ca-7b3d-40e1-8773-aa2c29209ecf/walton-lighthouse-sunset-1.jpg?v=1746123746475",
      credit: "Santa Cruz Lighthouse",
      shape: "rect"
    },
  ];
}

function initDesign(inspiration) {
  // set the canvas size based on the container
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  
  let design = {
    bg: 128,
    shapeCount: 100,
    maxWidth: width / 2,
    maxHeight: height / 2,
    fg: [],
  };
  
  for (let i = 0; i < design.shapeCount; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(design.maxWidth),
      h: random(design.maxHeight),
      fill: random(255)
    });
  }
  return design;
}

function renderDesign(design, inspiration) {
  image(inspiration.image, 0, 0, width, height);
  fill(design.bg, 128);
  rect(0, 0, width, height);

  noStroke();
  for (let box of design.fg) {
    fill(box.fill, 128);
    if (inspiration.shape === "ellipse") {
      ellipse(box.x, box.y, box.w, box.h);
    } else {
      rect(box.x, box.y, box.w, box.h);
    }
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width/2, rate);
    box.h = mut(box.h, 0, height/2, rate);
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}
