// sketch.js - Dungeon generation and rendering
// Author: Your Name
// Date: Updated for clarity

// Constants
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
let centerHorz, centerVert;
let grid; // Holds the generated dungeon grid

// MyClass Definition
class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // Code to run when method is called, could be used for game logic or drawing logic
    }

    // Dungeon generation
    generateDungeon(numCols, numRows) {
        let grid = [];
        for (let i = 0; i < numRows; i++) {
            let row = [];
            for (let j = 0; j < numCols; j++) {
                row.push("_"); // Initialize all tiles as walls
            }
            grid.push(row);
        }

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

            // Connect to the previous room
            if (rooms.length > 0) {
                let prev = rooms[rooms.length - 1];
                let prevCenter = [prev.x + floor(prev.w / 2), prev.y + floor(prev.h / 2)];
                let newCenter = [x + floor(roomWidth / 2), y + floor(roomHeight / 2)];

                if (random() < 0.5) {
                    this.carveHorizontalTunnel(grid, prevCenter[0], newCenter[0], prevCenter[1]);
                    this.carveVerticalTunnel(grid, prevCenter[1], newCenter[1], newCenter[0]);
                } else {
                    this.carveVerticalTunnel(grid, prevCenter[1], newCenter[1], newCenter[0]);
                    this.carveHorizontalTunnel(grid, prevCenter[0], newCenter[0], newCenter[1]);
                }
            }

            rooms.push(newRoom);
        }

        return grid;
    }

    carveHorizontalTunnel(grid, x1, x2, y) {
        for (let x = min(x1, x2); x <= max(x1, x2); x++) {
            grid[y][x] = ".";
        }
    }

    carveVerticalTunnel(grid, y1, y2, x) {
        for (let y = min(y1, y2); y <= max(y1, y2); y++) {
            grid[y][x] = ".";
        }
    }
}

// Resize the canvas when window size changes
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2;
  centerVert = canvasContainer.height() / 2;
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

// setup() function is called once when the program starts
function setup() {
  // Create the canvas
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  // Create an instance of MyClass
  myInstance = new MyClass("VALUE1", "VALUE2");

  // Initialize grid with generated dungeon
  grid = myInstance.generateDungeon(30, 20); // Change grid size as needed

  // Resize canvas when the window size changes
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly for animation
function draw() {
  background(220);
  
  // Example method call from the instance
  myInstance.myMethod();

  // Draw the dungeon grid
  drawGrid(grid);
}

// Draw the dungeon grid to the canvas
function drawGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const tile = grid[i][j];

      // Walls
      if (tile === "_") {
        fill(60);  // Dark gray for walls
        noStroke();
        rect(j * 16, i * 16, 16, 16);
      } 
      // Floor tiles
      else if (tile === ".") {
        fill(120); // Light gray for floor
        noStroke();
        rect(j * 16, i * 16, 16, 16);
      }
    }
  }
}
