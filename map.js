// Get the map canvas and context
const mapCanvas = document.getElementById('map_layer');
const mapCtx = mapCanvas.getContext('2d');

const keysPressed = {};

// Initial map settings
let mapX = 0; // Initial x position of the map
let mapY = 0; // Initial y position of the map

const zoom = 0.5; // Initial zoom level
const maxSpeed = 3;
const acceleration = 0.05;

let currentSpeed = [0, 0];

// Map image
const mapImage = new Image();
mapImage.src = 'Sample-jpg-image-500kb.jpg'; // Replace with your map image path

obstacles = [
    { x: 0, y: 0, width: 200, height: 200 },
    { x: 0, y: -50, width: 4350, height: 45},
    { x: -50, y: 0, width: 60, height: 3585},
    { x: 0, y: 3585, width: 4350, height: 45},
    { x: 3585, y : 0, width: 50, height: 3585}
];

const mapWidth = 1792;
const mapHeight = 1792;

function addObstacle(x, y, width, height) {
    obstacles.push({ x: x, y: y, width: width, height: height });
}

window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});

// keyup event to record when key is released
window.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});

// Check if a key is pressed
function isKeyPressed(key) {
    return !!keysPressed[key];
}

// Draw the map based on the current position and zoom
function drawMap() {
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height); // Clear the canvas

    // Draw the map image scaled to the zoom level, and shifted by mapX and mapY
    mapCtx.drawImage(
        mapImage,
        -mapX * zoom, // Adjust mapX based on zoom
        -mapY * zoom, // Adjust mapY based on zoom
        mapWidth * zoom,
        mapHeight * zoom,
        0,
        0,
        mapCanvas.width,
        mapCanvas.height
    );
    drawObstacles();
}

function drawObstacles() {
    mapCtx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red color with transparency for obstacles
    obstacles.forEach(obstacle => {
        // Calculate the position of the obstacle relative to the canvas
        const canvasX = (mapX + obstacle.x) / (mapWidth / mapCanvas.width);
        const canvasY = (mapY + obstacle.y) / (mapHeight / mapCanvas.height);
        const width = obstacle.width * zoom;
        const height = obstacle.height * zoom;

        // Draw the obstacle on the canvas
        mapCtx.fillRect(canvasX, canvasY, width, height);
    });
}

// Handle arrow keys for panning
function moveMap() {
    let acceleratingX = 0;
    let acceleratingY = 0;

    if (isKeyPressed('ArrowUp') || isKeyPressed('w')) {
        acceleratingY += 1;
    }
    if (isKeyPressed('ArrowDown') || isKeyPressed('s')) {
        acceleratingY -= 1;
    }
    if (isKeyPressed('ArrowLeft') || isKeyPressed('a')) {
        acceleratingX += 1;
    }
    if (isKeyPressed('ArrowRight') || isKeyPressed('d')) {
        acceleratingX -= 1;
    }

    updateSpeed(acceleratingX, acceleratingY);

    obstacles.forEach((obstacle) => {
        switch(checkCircleObstacleCollision((mapCanvas.width / 2), (mapCanvas.height / 2), 25, obstacle)){
            case 'top': currentSpeed[1] < 0 ? currentSpeed[1] = 0 : currentSpeed[1] = currentSpeed[1]; break;
            case 'bottom': currentSpeed[1] > 0 ? currentSpeed[1] = 0 : currentSpeed[1] = currentSpeed[1]; break;
            case 'right': currentSpeed[0] > 0 ? currentSpeed[0] = 0 : currentSpeed[0] = currentSpeed[0]; break;
            case 'left': currentSpeed[0] < 0 ? currentSpeed[0] = 0 : currentSpeed[0] = currentSpeed[0]; break;
        }
    });

    mapX += currentSpeed[0];
    mapY += currentSpeed[1];

    drawMap();
}

function updateSpeed(isAcceleratingX, isAcceleratingY) {
    // Update X speed
    if (isAcceleratingX !== 0) {
        currentSpeed[0] += isAcceleratingX * acceleration;
        currentSpeed[0] = Math.min(Math.max(currentSpeed[0], -maxSpeed), maxSpeed);
    } else {
        // Apply friction
        currentSpeed[0] *= 0.9; // Friction coefficient
    }

    // Update Y speed
    if (isAcceleratingY !== 0) {
        currentSpeed[1] += isAcceleratingY * acceleration;
        currentSpeed[1] = Math.min(Math.max(currentSpeed[1], -maxSpeed), maxSpeed);
    } else {
        // Apply friction
        currentSpeed[1] *= 0.9; // Friction coefficient
    }
}

function checkCircleObstacleCollision(circleX, circleY, r, obstacle) {
    const canvasX = (mapX + obstacle.x) / (mapWidth / mapCanvas.width);
    const canvasY = (mapY + obstacle.y) / (mapHeight / mapCanvas.height);
    const closestX = Math.max(canvasX, Math.min(circleX, canvasX + obstacle.width * zoom));
    const closestY = Math.max(canvasY, Math.min(circleY, canvasY + obstacle.height * zoom));

    //console.log(`canvasX: ${canvasX}, circleX: ${circleX}, canvasY: ${canvasY}, circleY: ${circleY}, closestX: ${closestX}, closestY: ${closestY}`);
    
    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;

    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    //console.log(`distaceX: ${distanceX}, distanceY: ${distanceY}, totalDistance: ${Math.sqrt(distanceSquared)}`);
    if (distanceSquared <= (r * r)) {
        // Collision detected, determine the direction
        const offsetX = Math.abs(distanceX);
        const offsetY = Math.abs(distanceY);

        if (offsetX > offsetY) {
            // More horizontal collision
            if (distanceX > 0) {
                //console.log('Collision from the right');
                return 'right';
            } else {
                //console.log('Collision from the left');
                return 'left';
            }
        } else {
            // More vertical collision
            if (distanceY > 0) {
                //console.log('Collision from the bottom');
                return 'bottom';
            } else {
                //console.log('Collision from the top');
                return 'top';
            }
        }
    }

    return false; // No collision
}

// Load the map image and draw the initial map
mapImage.onload = () => {
    drawMap();
};

function resizeCanvas() {
    mapCanvas.width = window.innerWidth;
    mapCanvas.height = window.innerHeight;
    drawMap(); // Redraw the map after resizing
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

function update() {
    //console.log(checkCircleObstacleCollision((mapCanvas.width / 2), (mapCanvas.height / 2), 25, obstacles[0]));
    //checkCircleObstacleCollision(mapCanvas.width / 2, mapCanvas.height / 2, 25, obstacles[0]);
    moveMap();
}

setInterval(update, 20);
