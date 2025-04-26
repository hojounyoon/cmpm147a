// sketch.js - purpose and description here
// Author: Your Name
// Date:

"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

p3_preload();
p3_setup();
p3_worldKeyChanged;
p3_tileWidth;
p3_tileHeight;
p3_tileClicked;
p3_drawBefore;
p3_drawTile;
p3_drawSelectedTile;
p3_drawAfter;


function p3_preload() {}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// setup() function is called once when the program starts
function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent("container");

  camera_offset = new p5.Vector(-width / 2, height / 2);
  camera_velocity = new p5.Vector(0, 0);

  if (window.p3_setup) {
    window.p3_setup();
  }

  let label = createP();
  label.html("World key: ");
  label.parent("container");

  let input = createInput("xyzzy");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("Arrow keys scroll. Clicking changes tiles.").parent("container");

  rebuildWorld(input.value());
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  let hash = XXH.h32("tile:" + [i, j], worldSeed);

  // Base green grass color (light or dark)
  if (hash % 4 === 0) {
    fill(70, 130, 180); // Light green
  } else {
    fill(34, 139, 34); // Dark green
  }

  push();

  // Draw diamond tile
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Pink flowers (appear on 1 in 6 tiles)
  if (hash % 6 === 0) {
    fill(255, 105, 180); // Hot pink
    ellipse(-5, 5, 4, 4);
    ellipse(5, -3, 4, 4);
  }
  
  // Blue flowers (appear on 1 in 8 tiles)
  if (hash % 8 === 0) {
    fill(70, 130, 180); // Blue color for flowers
    ellipse(-5, 5, 5, 5);  // Flower on the left
    ellipse(5, -3, 5, 5);  // Flower on the right
  }
  
  if (hash % 12 === 0) {
    fill(135, 206, 250, 40); // Hot pink
    ellipse(-5, 5, 4, 4);
    ellipse(5, -3, 4, 4);
  }

  // Blue mist overlay (subtle and semi-transparent)
  if (hash % 5 === 0) {
    fill(135, 206, 250, 40); // Light blue, transparent
    ellipse(0, 0, 40, 20);
  }

  // Rare soft sunlight spot
  if (hash % 30 === 0) {
    fill(255, 255, 150, 60); // Soft yellow glow
    ellipse(0, 0, 20, 20);
  }

  // Tile click effects
  let n = clicks[[i, j]] | 0;
  if (n % 2 === 1) {
    fill(135, 206, 235, 100); // More pronounced mist on click
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 100); // Subtle highlight
    ellipse(0, 0, 10, 10);
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  // You can add any post-processing code here (e.g., frame rate display)
  text(frameRate(), 20, 20); // Display the frame rate
}
