// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let seed = 42;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {  
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0); // Set random seed based on key
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32; // Tile width
}

function p3_tileHeight() {
  return 16; // Tile height
}

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0); // Increment click count on tile
  console.log("Tile clicked:", i, j, "Click count:", clicks[key]);
}

function p3_drawTile(i, j) {
  noStroke();
  let tw = p3_tileWidth();
  let th = p3_tileHeight();
  let hash = XXH.h32("tile:" + [i, j], worldSeed);

  // Tile colors based on hash
  if (hash % 4 === 0) {
    fill(70, 130, 180); // Water
  } else {
    fill(34, 139, 34); // Land
  }

  // Draw the tile shape
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Additional features like flowers or puddles
  if (hash % 6 === 0) {
    fill(255, 105, 180); // Flowers
    ellipse(-5, 5, 4, 4);
    ellipse(5, -3, 4, 4);
  }
  
  if (hash % 8 === 0) {
    fill(70, 130, 180); // Water puddles
    ellipse(-5, 5, 5, 5);
    ellipse(5, -3, 5, 5);
  }

  pop();
}

function p3_drawSelectedTile(i, j, x, y) {
  noFill();
  stroke(255, 0, 0);
  strokeWeight(2);
  let tw = p3_tileWidth();
  let th = p3_tileHeight();
  push();
  translate(x, y);
  rect(-tw, -th, tw * 2, th * 2); // Highlight selected tile
  pop();
}

function p3_drawAfter() {
  text(frameRate(), 20, 20);
}

// --- YOUR MY_WORLD.JS PART END ---
