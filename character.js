// Get the character canvas and context
const characterCanvas = document.getElementById('character_layer');
const characterCtx = characterCanvas.getContext('2d');

// Character image
const characterImage = new Image();
characterImage.src = 'character.png'; // Replace with your character image path

// Character position and dimensions
const characterWidth = 50; // Adjust based on character image size
const characterHeight = 50; // Adjust based on character image size
const characterX = characterCanvas.width / 2; // Center of the canvas
const characterY = characterCanvas.height / 2; // Center of the canvas

// Track mouse position
let mouseX = 0;
let mouseY = 0;

// Function to draw the character with rotation
function drawCharacter() {
    characterCtx.clearRect(0, 0, characterCanvas.width, characterCanvas.height); // Clear the canvas
    
    // Calculate the angle between the character center and the mouse position
    const angle = Math.atan2(mouseY - characterY, mouseX - characterX) + Math.PI / 2;

    // Save the current canvas state
    characterCtx.save();
    
    // Translate to the character's center
    characterCtx.translate(characterX, characterY);
    
    // Rotate the canvas to the calculated angle
    characterCtx.rotate(angle);
    
    // Draw the character centered at the translated position
    characterCtx.drawImage(
        characterImage,
        -characterWidth / 2, // Offset to center the image
        -characterHeight / 2, // Offset to center the image
        characterWidth,
        characterHeight
    );

    // Restore the canvas state
    characterCtx.restore();
}

// Event listener to update mouse position
characterCanvas.addEventListener('mousemove', (event) => {
    // Get the mouse position relative to the canvas
    const rect = characterCanvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    
    // Redraw the character with the new rotation
    drawCharacter();
});

// Load the character image and draw it initially
characterImage.onload = () => {
    drawCharacter();
};
