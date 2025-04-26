"use strict";

/* global p5 */
/* exported preload, setup, draw, mouseClicked */

// --- ENGINE PART START ---

let worldSeed;
let camera_x = 0;
let camera_y = 0;
let target_camera_x = 0;
let target_camera_y = 0;
let target_camera_scale = 1;
let camera_scale = 1;
let is_dragging = false;
let dragging_start_x, dragging_start_y;
let dragging_camera_start_x, dragging_camera_start_y;
let selected_tile_i = 0;
let selected_tile_j = 0;
let selected_screen_x = 0;
let selected_screen_y = 0;

function preload() {
  p3_preload();
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  worldSeed = XXH.h32("default", 0).toNumber();
  noiseSeed(worldSeed);
  randomSeed(worldSeed);

  initializeWorld();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  let world_pos = screenToWorld(mouseX, mouseY);
  p3_tileClicked(selected_tile_i, selected_tile_j);
}

function mousePressed() {
  if (mouseButton === LEFT) {
    is_dragging = true;
    dragging_start_x = mouseX;
    dragging_start_y = mouseY;
    dragging_camera_start_x = target_camera_x;
    dragging_camera_start_y = target_camera_y;
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    is_dragging = false;
  }
}

function keyTyped() {
  p3_worldKeyChanged(key);
}

function draw() {
  // Update camera position
  camera_x = camera_x * 0.85 + target_camera_x * 0.15;
  camera_y = camera_y * 0.85 + target_camera_y * 0.15;
  camera_scale = camera_scale * 0.85 + target_camera_scale * 0.15;

  // Dragging camera
  if (is_dragging) {
    let delta_x = (dragging_start_x - mouseX) / camera_scale;
    let delta_y = (dragging_start_y - mouseY) / camera_scale;
    target_camera_x = dragging_camera_start_x + delta_x;
    target_camera_y = dragging_camera_start_y + delta_y;
  }

  background(0);

  push();
  translate(width / 2, height / 2);
  scale(camera_scale);
  translate(-camera_x, -camera_y);

  p3_drawBefore();

  let tw = p3_tileWidth();
  let th = p3_tileHeight();

  let worldTL = screenToWorld(0, 0);
  let worldBR = screenToWorld(width, height);

  let buffer = 3;

  let i0 = Math.floor((worldTL[0]) / tw) - buffer;
  let i1 = Math.floor((worldBR[0]) / tw) + buffer;
  let j0 = Math.floor((worldTL[1]) / th) - buffer;
  let j1 = Math.floor((worldBR[1]) / th) + buffer;

  let closest_dist = 9999999;

  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      let center_x = (i + 0.5) * tw;
      let center_y = (j + 0.5) * th;

      let screen_pos = worldToScreen(center_x, center_y);
      let d = dist(mouseX, mouseY, screen_pos[0], screen_pos[1]);
      if (d < closest_dist) {
        closest_dist = d;
        selected_tile_i = i;
        selected_tile_j = j;
        selected_screen_x = screen_pos[0];
        selected_screen_y = screen_pos[1];
      }

      push();
      translate(center_x, center_y);
      p3_drawTile(i, j);
      pop();
    }
  }

  p3_drawSelectedTile(selected_tile_i, selected_tile_j, selected_screen_x, selected_screen_y);

  p3_drawAfter();
  pop();
}

function worldToScreen(x, y) {
  let sx = (x - camera_x) * camera_scale + width / 2;
  let sy = (y - camera_y) * camera_scale + height / 2;
  return [sx, sy];
}

function screenToWorld(x, y) {
  let wx = (x - width / 2) / camera_scale + camera_x;
  let wy = (y - height / 2) / camera_scale + camera_y;
  return [wx, wy];
}

// --- ENGINE PART END ---


// --- YOUR MY_WORLD.JS PART START ---

function p3_preload() {
  // nothing to load
}

function p3_setup() {
  // nothing to set up
}

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

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {
  // nothing to draw before
}

function p3_drawTile(i, j) {
  noStroke();
  let tw = p3_tileWidth();
  let th = p3_tileHeight();
  let hash = XXH.h32("tile:" + [i, j], worldSeed);

  if (hash % 4 === 0) {
    fill(70, 130, 180); // Water
  } else {
    fill(34, 139, 34); // Land
  }

  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

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
  rect(-tw, -th, tw * 2, th * 2);
  pop();
}

function p3_drawAfter() {
  // nothing to draw after
}

// --- YOUR MY_WORLD.JS PART END ---
