// Get the map canvas and context
const mapCanvas = document.getElementById('map_layer');
const mapCtx = mapCanvas.getContext('2d');

// Initial map settings
let mapX = 0; // Initial x position of the map
let mapY = 0; // Initial y position of the map
let zoom = 0.5; // Initial zoom level

// Map dimensions (assuming the map is larger than the canvas)
const mapWidth = 246;
const mapHeight = 205;

// Map image
const mapImage = new Image();
mapImage.src = 'map.png'; // Replace with your map image path

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
function moveMap(event) {
    const speed = 10 / zoom; // Adjust speed based on zoom level
    switch (event.key) {
        case 'ArrowUp':
            mapY -= speed;
            break;
        case 'ArrowDown':
            mapY += speed;
            break;
        case 'ArrowLeft':
            mapX -= speed;
            break;
        case 'ArrowRight':
            mapX += speed;
            break;
    }
    drawMap();
}

// Handle zoom with mouse wheel
function zoomMap(event) {
    const zoomFactor = 0.1; // Zoom speed
    if (event.deltaY < 0) {
        zoom = Math.min(2, zoom + zoomFactor); // Zoom in (limit max zoom level)
    } else {
        zoom = Math.max(0.5, zoom - zoomFactor); // Zoom out (limit min zoom level)
    }
    drawMap();
}

// Load the map image and draw the initial map
mapImage.onload = () => {
    drawMap();
};

// Event listeners for key inputs and mouse wheel
window.addEventListener('keydown', moveMap);
mapCanvas.addEventListener('wheel', zoomMap);
