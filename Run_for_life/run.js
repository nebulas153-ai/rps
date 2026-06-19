const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'shadow_dog.png';
let x = 0;
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
   //ctx.fillRect(100, 50, 100, 100); 
    ctx.drawImage(playerImage, 0 , 0);
    x++;
    requestAnimationFrame(animate);
};
animate();