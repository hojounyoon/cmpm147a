// sketch.js - Overworld and Dungeon Generator
// Author: Your Name
// Date:

// Globals
let canvasContainer;
let centerHorz, centerVert;
let dungeonGrid;
let overworldGrid;
const TILE_SIZE = 16;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  // Create both grids
  dungeonGrid = generateDungeonGrid(30, 30);
  overworldGrid = generateOverworldGrid(30, 30);

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

function draw() {
  background(20);

  // Draw overworld on the left
  drawGrid(overworldGrid, 0, 0);

  // Draw dungeon on the right
  drawGrid(dungeonGrid, width / 2, 0);
}

// ========== GRID DRAWING ==========

function drawGrid(grid, offsetX, offsetY) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const tile = grid[i][j];
      const x = j * TILE_SIZE + offsetX;
      const y = i * TILE_SIZE + offsetY;

      if (tile === "_") {
        fill(60); // wall
      } else if (tile === ".") {
        fill(120); // floor
      } else if (tile === "G") {
        fill(34, 139, 34); // grass
      } else if (tile === "W") {
        fill(0, 100, 255); // water
      }

      noStroke();
      rect(x, y, TILE_SIZE, TILE_SIZE);
    }
  }
}

// ========== DUNGEON GENERATION ==========

function generateDungeonGrid(cols, rows) {
  let grid = Array(rows).fill().map(() => Array(cols).fill("_"));

  const numRooms = 10;
  const rooms = [];

  for (let n = 0; n < numRooms; n++) {
    let w = floor(random(4, 8));
    let h = floor(random(4, 8));
    let x = floor(random(1, cols - w - 1));
    let y = floor(random(1, rows - h - 1));

    let room = { x, y, w, h };

    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        grid[i][j] = ".";
      }
    }

    if (rooms.length > 0) {
      let prev = rooms[rooms.length - 1];
      let [px, py] = [prev.x + floor(prev.w / 2), prev.y + floor(prev.h / 2)];
      let [cx, cy] = [x + floor(w / 2), y + floor(h / 2)];

      if (random() < 0.5) {
        carveHorizontalTunnel(grid, px, cx, py);
        carveVerticalTunnel(grid, py, cy, cx);
      } else {
        carveVerticalTunnel(grid, py, cy, px);
        carveHorizontalTunnel(grid, px, cx, cy);
      }
    }

    rooms.push(room);
  }

  return grid;
}

function carveHorizontalTunnel(grid, x1, x2, y) {
  for (let x = min(x1, x2); x <= max(x1, x2); x++) {
    grid[y][x] = ".";
  }
}

function carveVerticalTunnel(grid, y1, y2, x) {
  for (let y = min(y1, y2); y <= max(y1, y2); y++) {
    grid[y][x] = ".";
  }
}

// ========== OVERWORLD GENERATION ==========

function generateOverworldGrid(cols, rows) {
  let grid = Array(rows).fill().map(() => Array(cols).fill("G")); // default: grass

  // Randomly add some water
  for (let n = 0; n < 5; n++) {
    let w = floor(random(4, 10));
    let h = floor(random(3, 8));
    let x = floor(random(cols - w));
    let y = floor(random(rows - h));

    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        grid[i][j] = "W";
      }
    }
  }

  return grid;
}
