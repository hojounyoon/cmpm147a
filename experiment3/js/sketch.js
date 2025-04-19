// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Constants - User-servicable parts
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
let centerHorz, centerVert;
let grid; // Add a global variable for the grid

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
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  
  // Create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  // Generate the dungeon grid
  grid = generateGrid(40, 30); // Size of the dungeon grid

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_"); // Initialize the grid with walls
    }
    grid.push(row);
  }
  
  // Step 2: Randomly generate dungeon rooms
  const numRooms = 10;
  const rooms = [];

  for (let n = 0; n < numRooms; n++) {
    let roomWidth = floor(random(4, 8));
    let roomHeight = floor(random(4, 8));
    let x = floor(random(1, numCols - roomWidth - 1));
    let y = floor(random(1, numRows - roomHeight - 1));

    let newRoom = { x, y, w: roomWidth, h: roomHeight };

    // Place room floor tiles (".")
    for (let i = y; i < y + roomHeight; i++) {
      for (let j = x; j < x + roomWidth; j++) {
        grid[i][j] = ".";
      }
    }

    // Connect this room to the previous room
    if (rooms.length > 0) {
      let prev = rooms[rooms.length - 1];
      let prevCenter = [prev.x + floor(prev.w / 2), prev.y + floor(prev.h / 2)];
      let newCenter = [x + floor(roomWidth / 2), y + floor(roomHeight / 2)];

      // Draw corridor between previous and new room centers
      if (random() < 0.5) {
        carveHorizontalTunnel(grid, prevCenter[0], newCenter[0], prevCenter[1]);
        carveVerticalTunnel(grid, prevCenter[1], newCenter[1], newCenter[0]);
      } else {
        carveVerticalTunnel(grid, prevCenter[1], newCenter[1], newCenter[0]);
        carveHorizontalTunnel(grid, prevCenter[0], newCenter[0], newCenter[1]);
      }
    }

    rooms.push(newRoom);
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

function drawGrid(grid) {
  background(20);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const tile = grid[i][j];

      if (tile === "_") {
        fill(60);          // Dungeon wall = dark gray
        noStroke();
        rect(j * 16, i * 16, 16, 16);
      } else if (tile === ".") {
        fill(120);         // Dungeon floor = lighter gray
        noStroke();
        rect(j * 16, i * 16, 16, 16);
      }
    }
  }
}

function gridCheck(grid, i, j, target) {
  if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) {
    return false;
  }
  return grid[i][j] === target;
}

function gridCode(grid, i, j, target) {
  let north = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let south = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let east  = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let west  = gridCheck(grid, i, j - 1, target) ? 1 : 0;

  return (north << 0) + (south << 1) + (east << 2) + (west << 3);
}

const lookup = [
  [0, 0], // 0000 (all walls)
  [1, 0], // 0001 (north only)
  [2, 0], // 0010 (south only)
  [3, 0], // 0011 (north + south)
  [0, 1], // 0100 (east only)
  [1, 1], // 0101 (north + east)
  [2, 1], // 0110 (south + east)
  [3, 1], // 0111 (north + south + east)
  [0, 2], // 1000 (west only)
  [1, 2], // 1001 (north + west)
  [2, 2], // 1010 (south + west)
  [3, 2], // 1011 (north + south + west)
  [0, 3], // 1100 (east + west)
  [1, 3], // 1101 (north + east + west)
  [2, 3], // 1110 (south + east + west)
  [3, 3]  // 1111 (all directions)
];

