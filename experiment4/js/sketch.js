// sketch.js - Tile-based world with camera movement
// Author: Your Name
// Date:

// Constants
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let seed = 42;
let camera_offset;
let camera_velocity;
let worldSeed = 0;
let tile_rows = 40; // Number of tile rows
let tile_columns = 40; // Number of tile columns
let clicks = {}; // Track clicks on tiles

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

function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent("container");
    canvasContainer = select('#container');

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

function rebuildWorld(key) {
    p3_worldKeyChanged(key);
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

function p3_tileClicked(i, j) {
    let key = [i, j];
    clicks[key] = 1 + (clicks[key] || 0);
    console.log("Tile clicked:", i, j, "Click count:", clicks[key]);
}

function p3_drawTile(i, j) {
    noStroke();

    let hash = XXH.h32("tile:" + [i, j], worldSeed);

    let tw = p3_tileWidth();
    let th = p3_tileHeight();

    // Base green grass color (light or dark)
    if (hash % 4 === 0) {
        fill(70, 130, 180); // Light green
    } else {
        fill(34, 139, 34); // Dark green
    }

    push();

    // Draw diamond tile
    beginShape();
    vertex(-tw / 2, 0);
    vertex(0, th / 2);
    vertex(tw / 2, 0);
    vertex(0, -th / 2);
    endShape(CLOSE);

    // Pink flowers
    if (hash % 6 === 0) {
        fill(255, 105, 180);
        ellipse(-5, 5, 4, 4);
        ellipse(5, -3, 4, 4);
    }

    // Blue flowers
    if (hash % 8 === 0) {
        fill(70, 130, 180);
        ellipse(-5, 5, 5, 5);
        ellipse(5, -3, 5, 5);
    }

    // Blue mist overlay
    if (hash % 5 === 0) {
        fill(135, 206, 250, 40);
        ellipse(0, 0, 40, 20);
    }

    // Rare soft sunlight spot
    if (hash % 30 === 0) {
        fill(255, 255, 150, 60);
        ellipse(0, 0, 20, 20);
    }

    // Tile click effects
    let n = clicks[[i, j]] || 0;
    if (n % 2 === 1) {
        fill(135, 206, 235, 100);
        ellipse(0, 0, 10, 5);
        translate(0, -10);
        fill(255, 255, 100, 100);
        ellipse(0, 0, 10, 10);
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
    rect(-tw / 2, -th / 2, tw, th);
    pop();
}

function p3_drawAfter() {
    fill(255);
    noStroke();
    text("FPS: " + Math.round(frameRate()), 20, 20);
}

function screenToWorld(screenCoords, cameraOffset) {
    let x = (screenCoords[0] - cameraOffset[0]) / p3_tileWidth();
    let y = (screenCoords[1] + cameraOffset[1]) / p3_tileHeight();
    return [x, y];
}

function cameraToWorldOffset(cameraOffset) {
    return {
        x: cameraOffset[0] / p3_tileWidth(),
        y: cameraOffset[1] / p3_tileHeight()
    };
}

function drawTile(world_coords, camera_offset) {
    let [i, j] = world_coords;
    let x = (i - j) * p3_tileWidth() / 2;
    let y = (i + j) * p3_tileHeight() / 2;

    push();
    translate(x + camera_offset[0] + width / 2 + p3_tileWidth() / 2, y - camera_offset[1] + height / 2);
    p3_drawTile(Math.floor(i), Math.floor(j));

    // Highlight clicked tiles
    let key = [Math.floor(i), Math.floor(j)];
    if (clicks[key] && clicks[key] % 2 === 1) {
        p3_drawSelectedTile(i, j, 0, 0);
    }
    pop();
}

function tileRenderingOrder(coords) {
    return coords;
}

function describeMouseTile(world_pos, camera_offset) {
    let [i, j] = [Math.floor(world_pos[0]), Math.floor(world_pos[1])];
    fill(255);
    noStroke();
    text(`Tile: (${i}, ${j})`, 20, 40);
}

function draw() {
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

    let world_pos = screenToWorld(
        [mouseX - width / 2, mouseY - height / 2],
        [camera_offset.x, camera_offset.y]
    );
    let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

    background(100);

    if (window.p3_drawBefore) {
        window.p3_drawBefore();
    }

    let overdraw = 0.1;
    let y0 = Math.floor((0 - overdraw) * tile_rows);
    let y1 = Math.floor((1 + overdraw) * tile_rows);
    let x0 = Math.floor((0 - overdraw) * tile_columns);
    let x1 = Math.floor((1 + overdraw) * tile_columns);

    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
                camera_offset.x,
                camera_offset.y
            ]);
        }
        for (let x = x0; x < x1; x++) {
            drawTile(
                tileRenderingOrder([
                    x + 0.5 + world_offset.x,
                    y + 0.5 - world_offset.y
                ]),
                [camera_offset.x, camera_offset.y]
            );
        }
    }

    describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

    if (window.p3_drawAfter) {
        window.p3_drawAfter();
    }
}
