const canvas = document.getElementById("main_map");
const ctx = canvas.getContext("2d");
const characterImage = document.getElementById("character_image");

const characterSpeed = 20;

let posX = 10;
let posY = 10;

window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    ctx.drawImage(characterImage, posX, posY);
});

canvas.addEventListener("keydown", (e) => {
    console.log(`Key "${e.key}" repeating [event: keydown]`);
    const direction = getDirection(e.key);
    console.log(direction);
    posX += direction[0];
    posY += direction[1];
    console.log(`posX: ${posX}, posY: ${posY}`);
    updateCharacter();
});

canvas.focus();

function getDirection(key) {
    switch(key){
        case "w": return ([0,-characterSpeed]);
        case "a": return ([-characterSpeed,0]);
        case "s": return ([0,characterSpeed]);
        case "d": return ([characterSpeed,0]);
        case "ArrowUp": return ([0,-characterSpeed]);
        case "ArrowLeft": return ([-characterSpeed,0]);
        case "ArrowRight": return ([0,characterSpeed]);
        case "ArrowDown": return ([characterSpeed,0]);
    }
}

function updateCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(characterImage, posX, posY); // Draw the image at the new position
}

canvas.addEventListener("click", () => {
    canvas.focus();
});