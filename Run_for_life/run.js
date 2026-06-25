const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = Math.min(window.innerHeight, 500);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);


const playerImage = new Image();
playerImage.src = 'shadow_dog.png';


let score = 0;
let gameOver = false;
let backgroundX = 0;
let gameSpeed = 6;


const player = {
    x: 100,
    y: 250,
    width: 100,
    height: 100,
    velocityY: 0,
    gravity: 0.8,
    jumpForce: -18,
    grounded: true
};


const enemies = [];

function createEnemy() {
    const type = Math.floor(Math.random() * 3);

    if (type === 0) {
        
        enemies.push({
            x: canvas.width,
            y: 300,
            width: 30,
            height: 50,
            color: 'black'
        });
    }

    if (type === 1) {
    
        enemies.push({
            x: canvas.width,
            y: 280,
            width: 60,
            height: 70,
            color: 'brown'
        });
    }

    if (type === 2) {
        
        enemies.push({
            x: canvas.width,
            y: 180,
            width: 50,
            height: 30,
            color: 'purple'
        });
    }
}

setInterval(() => {
    if (!gameOver) {
        createEnemy();
    }
}, 1500);

// ==================== INPUT ====================

window.addEventListener('keydown', e => {
    if (e.code === 'Space' && player.grounded && !gameOver) {
        player.velocityY = player.jumpForce;
        player.grounded = false;
    }
});


function handleJump() {

    if (gameOver) {
        restartGame();
        return;
    }

    if (player.grounded) {
        player.velocityY = player.jumpForce;
        player.grounded = false;
    }
}

document.addEventListener('click', handleJump);

document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleJump();
}, { passive: false });

// ==================== COLLISION ====================

function collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


function restartGame() {

    score = 0;
    gameOver = false;
    enemies.length = 0;

    player.x = 100;
    player.y = 250;
    player.velocityY = 0;
    player.grounded = true;

    animate();
}

function animate() {

    if (gameOver) {

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '60px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('GAME OVER', 180, 150);

        ctx.font = '30px Arial';
        ctx.fillText('Score: ' + score, 330, 210);

        ctx.fillText('Click / Tap To Restart', 220, 270);
       

        return;
    }

    requestAnimationFrame(animate);

    
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    backgroundX -= 2;

    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }

    ctx.fillStyle = '#7CB342';

    ctx.beginPath();
    ctx.arc(backgroundX + 200, 350, 120, Math.PI, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(backgroundX + 600, 350, 150, Math.PI, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(backgroundX + canvas.width + 200, 350, 120, Math.PI, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(backgroundX + canvas.width + 600, 350, 150, Math.PI, 0);
    ctx.fill();

    
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 350, canvas.width, 50);

    
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y >= 250) {
        player.y = 250;
        player.velocityY = 0;
        player.grounded = true;
    }


    ctx.drawImage(
        playerImage,
        0,
        0,
        575,
        530,
        player.x,
        player.y,
        player.width,
        player.height
    );

    
    enemies.forEach((enemy, index) => {

        enemy.x -= gameSpeed;

        ctx.fillStyle = enemy.color;
        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );

        if (collision(player, enemy)) {
            gameOver = true;
        }

        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
            score++;
        }
    });

    
    gameSpeed = 6 + Math.floor(score / 5);


    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, 20, 40);
}


playerImage.onload = () => {
    animate();
};