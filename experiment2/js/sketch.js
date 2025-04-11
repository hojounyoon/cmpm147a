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
let seed = 0;

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
  createCanvas(400, 200);
  createButton("reimagine").mousePressed(() => seed++);
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  background(135, 206, 235);

  // Ocean
  noStroke();
  fill(0, 119, 190);
  rect(0, height / 1.5, width / 1.5, height / 3);

  // Sand
  fill(237, 201, 175);
  rect(width / 1.5, height * 2 / 3, width / 2, height / 2);

  // Wet sand
  fill(169, 169, 169); // Grey color for wet sand
  let sandX = width / 1.48;
  let sandY = height * 2 / 3;
  triangle(sandX, height, sandX + 25, height, sandX, sandY);
  
  // Grey buffer rectangle between ocean and wet sand
  fill(169, 169, 169); // Same grey as wet sand
  rect(width / 1.5 - 1, height * 2 / 3, 5, height / 3); // Thin vertical line
  
  // Clouds
  for (let i = 0; i < 3; i++) {
    let x = random(width);
    let y = random(height / 3);
    let size = random(40, 70);
    drawCloud(x, y, size);
  }

  // Waves
  fill(255, 255, 255, 120); // semi-transparent white
  noStroke();
  let oceanWidth = width / 1.5;  // Ocean width to limit waveX
  let oceanHeight = height / 3;  // Ocean height for waveY oscillation
  
  for (let i = 0; i < 8; i++) {
    // Wave X moves back and forth, within ocean width
    let waveX = (i * oceanWidth / 8) + (sin(millis() / 1000 + i) * 40);
    waveX = constrain(waveX, 0, oceanWidth); // Keep wave X within the ocean boundary
    
    // Wave Y oscillates within the ocean's vertical bounds
    let waveY = height / 1.5 + sin(millis() / 1000 + i) * (oceanHeight / 2); // Adjust to ocean height range
    waveY = constrain(waveY, height / 1.5, height / 1.5 + oceanHeight); // Keep wave Y within ocean's height
    
    arc(waveX, waveY, 30, 15, PI, TWO_PI); // semi-circle wave
  }
  
  // Houses
  drawHouse(width / 1.1, height * 2 / 3 - 20, color(255)); // White square house
  drawHouse(width / 1.25, height * 2 / 3 - 20, color(139, 69, 19)); // Brown square house
}

function drawCloud(x, y, size) {
  fill(255);
  noStroke();
  ellipse(x, y, size, size * 0.6);
  ellipse(x + size * 0.4, y, size * 0.6, size * 0.5);
  ellipse(x - size * 0.4, y, size * 0.6, size * 0.5);
}

function drawHouse(x, y, col) {
  // House as a square base
  fill(col);
  rect(x, y, 20, 20); // Square house
  
  // Optional: Roof as a triangle on top
  fill(150, 75, 0); // Brown color for the roof
  triangle(x, y, x + 20, y, x + 10, y - 10); // Roof above square
  
  // Optional: Add a window
  fill(255); // White window color
  rect(x + 5, y + 5, 10, 10); // Window in the house
}
