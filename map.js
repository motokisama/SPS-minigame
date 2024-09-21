// Get the map canvas and context
const mapCanvas = document.getElementById('map_layer');
const mapCtx = mapCanvas.getContext('2d');

const keysPressed = {};

// Initial map settings
let mapX = 0; // Initial x position of the map
let mapY = 0; // Initial y position of the map

const zoom = 0.5; // Initial zoom level
const maxSpeed = 1;
const acceleration = 0.02;

let currentSpeed = [0,0];
let previousSpeed = currentSpeed;

// Map dimensions (assuming the map is larger than the canvas)
const mapWidth = 246;
const mapHeight = 205;

// Map image
const mapImage = new Image();
mapImage.src = 'map.png'; // Replace with your map image path

window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});
  
// keyupイベントでキーが離されたことを記録
window.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});
  
// 任意のタイミングでキーが押し込まれているか確認する関数
function isKeyPressed(key) {
    return !!keysPressed[key];
}

// Draw the map based on the current position and zoom
function drawMap() {
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height); // Clear the canvas

    // Draw the map image scaled to the zoom level, and shifted by mapX and mapY
    mapCtx.drawImage(
        mapImage,
        mapX, mapY,
        mapWidth * zoom, mapHeight * zoom,
        0, 0,
        mapCanvas.width, mapCanvas.height
    );
}

// Handle arrow keys for panning
function moveMap() {
    let acceleratingX = 0;
    let acceleratingY = 0;
    if(!(isKeyPressed('ArrowUp') || isKeyPressed('w')) && !(isKeyPressed('ArrowDown') || isKeyPressed('s')) && !(isKeyPressed('ArrowLeft') || isKeyPressed('a')) && !(isKeyPressed('ArrowRight') || isKeyPressed('d'))){
        acceleratingX = 0;
        acceleratingY = 0;
    }
    else{
        if(isKeyPressed('ArrowUp') || isKeyPressed('w')){
            acceleratingY -= 1;
        }
        if(isKeyPressed('ArrowDown') || isKeyPressed('s')){
            acceleratingY += 1;
        }
        if(isKeyPressed('ArrowLeft') || isKeyPressed('a')){
            acceleratingX -= 1;
        }
        if(isKeyPressed('ArrowRight') || isKeyPressed('d')){
            acceleratingX += 1;
        }
    }
    console.log(`[${acceleratingX},${acceleratingY}]`)
    updateSpeed(acceleratingX, acceleratingY);
    mapX += currentSpeed[0];
    mapY += currentSpeed[1];
    drawMap();
}

function updateSpeed(isAcceleratingX, isAcceleratingY){
    if(isAcceleratingX == 1){
        currentSpeed[0] += acceleration;
        if(currentSpeed[0] > maxSpeed){
            currentSpeed[0] = maxSpeed;
        }
    }else if(isAcceleratingX == -1){
        currentSpeed[0] -= acceleration;
        if(currentSpeed[0] < -maxSpeed){
            currentSpeed[0] = -maxSpeed;
        }
    }else{
        if(currentSpeed[0] > 0){
            currentSpeed[0] -= acceleration;
            if(currentSpeed[0] < 0){
                currentSpeed[0] = 0
            }
        }else if(currentSpeed[0] < 0){
            currentSpeed[0] += acceleration;
            if(currentSpeed[0] > 0){
                currentSpeed[0] = 0
            }
        }
    }
    if(isAcceleratingY == 1){
        currentSpeed[1] += acceleration;
        if(currentSpeed[1] > maxSpeed){
            currentSpeed[1] = maxSpeed;
        }
    }else if(isAcceleratingY == -1){
        currentSpeed[1] -= acceleration;
        if(currentSpeed[1] < -maxSpeed){
            currentSpeed[1] = -maxSpeed;
        }
    }else{
        if(currentSpeed[1] > 0){
            currentSpeed[1] -= acceleration;
            if(currentSpeed[1] < 0){
                currentSpeed[1] = 0
            }
        }else if(currentSpeed[1] < 0){
            currentSpeed[1] += acceleration;
            if(currentSpeed[1] > 0){
                currentSpeed[1] = 0
            }
        }
    }
}

// Load the map image and draw the initial map
mapImage.onload = () => {
    drawMap();
};

function update(){
    moveMap();
    console.log(currentSpeed);
}

setInterval(update, 20);