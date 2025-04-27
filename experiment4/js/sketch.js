let canvasContainer;
let canvas;
let centerHorz, centerVert;
let camera_offset;
let camera_velocity;
let tile_rows = 40; // Number of tile rows
let tile_columns = 40; // Number of tile columns
let clicks = {}; // Track clicks on tiles

function setup() {
    canvasContainer = select('#canvas-container'); // Get the container div
    canvas = createCanvas(800, 400); // Create the canvas
    canvas.parent(canvasContainer); // Attach the canvas to the container div

    camera_offset = new p5.Vector(-width / 2, height / 2);
    camera_velocity = new p5.Vector(0, 0);

    centerHorz = canvasContainer.width() / 2;
    centerVert = canvasContainer.height() / 2;
    resizeCanvas(canvasContainer.width(), canvasContainer.height());

    // Set up fullscreen functionality
    let fullscreenButton = select('#fullscreen');
    fullscreenButton.mousePressed(toggleFullscreen);

    // Initialize world state
    rebuildWorld('xyzzy');
}

function toggleFullscreen() {
    if (!fullscreen()) {
        fullscreen(true);
    } else {
        fullscreen(false);
    }
}

function resizeScreen() {
    centerHorz = canvasContainer.width() / 2;
    centerVert = canvasContainer.height() / 2;
    resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function rebuildWorld(key) {
    worldSeed = XXH.h32(key, 0);
    noiseSeed(worldSeed);
    randomSeed(worldSeed);
}

function draw() {
    background(100);

    // Controls for camera movement
    if (keyIsDown(LEFT_ARROW)) {
        camera_velocity.x -= 1;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        camera_velocity.x += 1;
    }
    if (keyIsDown(DOWN_ARROW)) {
        camera_velocity.y -= 1;
    }
    if (keyIsDown(UP_ARROW)) {
        camera_velocity.y += 1;
    }

    camera_offset.add(camera_velocity);
    camera_velocity.mult(0.95);

    if (camera_velocity.mag() < 0.01) {
        camera_velocity.setMag(0);
    }

    let overdraw = 0.1;
    let y0 = Math.floor((0 - overdraw) * tile_rows);
    let y1 = Math.floor((1 + overdraw) * tile_rows);
    let x0 = Math.floor((0 - overdraw) * tile_columns);
    let x1 = Math.floor((1 + overdraw) * tile_columns);

    // Draw tiles
    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            drawTile(x, y);
        }
    }
}

function drawTile(i, j) {
    noStroke();
    let tw = 32;  // Tile width
    let th = 16;  // Tile height
    let hash = XXH.h32("tile:" + [i, j], worldSeed);

    // Tile color
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
    pop();
}
