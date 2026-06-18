function createBlock() {
    const block = document.createElement("div");

    const colors = [
        "red", "blue", "green",
        "purple", "orange", "cyan", "yellow"
    ];

    block.style.position = "absolute";
    block.style.width = "150px";
    block.style.height = "150px";
    block.style.background =
        colors[Math.floor(Math.random() * colors.length)];
    block.style.border = "2px solid black";

    document.body.appendChild(block);

    return block;
}

let blocks = [];

let score = 0;
let level = 1;
let moveSpeed = 5;

let highScore =
    Number(localStorage.getItem("highScore")) || 0;

const scoreText = document.createElement("h2");
scoreText.style.position = "fixed";
scoreText.style.top = "10px";
scoreText.style.left = "10px";
document.body.appendChild(scoreText);

const levelText = document.createElement("h2");
levelText.style.position = "fixed";
levelText.style.top = "40px";
levelText.style.left = "10px";
document.body.appendChild(levelText);

const highText = document.createElement("h2");
highText.style.position = "fixed";
highText.style.top = "70px";
highText.style.left = "10px";
document.body.appendChild(highText);

function updateUI() {
    scoreText.innerText = "Score: " + score;
    levelText.innerText = "Level: " + level;
    highText.innerText = "High Score: " + highScore;
}

function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    updateUI();
}

updateUI();

let currentBlock = createBlock();

let x = (500 + (window.innerWidth - 300)) / 2;
let h = 100;

let speed = moveSpeed;
let verspeed = 8;

let falling = false;

currentBlock.style.left = x + "px";
currentBlock.style.top = h + "px";

document.addEventListener("click", function () {
    if (!falling) {
        speed = 0;
        falling = true;
    }
});

function moveCamera(amount) {

    const allBlocks = document.querySelectorAll("div");

    allBlocks.forEach(block => {
        let top = parseInt(block.style.top) || 0;
        block.style.top = (top + amount) + "px";
    });

    blocks.forEach(b => {
        b.y += amount;
    });

    h += amount;
}

function gameOver() {

    saveHighScore();

    alert(
        "GAME OVER\n\n" +
        "Score: " + score + "\n" +
        "High Score: " + highScore
    );

    location.reload();
}

function winGame() {

    saveHighScore();

    alert(
        "YOU WIN!\n\n" +
        "Score: " + score + "\n" +
        "High Score: " + highScore
    );

    location.reload();
}

function newBlock() {

    level++;
    moveSpeed += 0.5;

    currentBlock = createBlock();

    x = (500 + (window.innerWidth - 300)) / 2;
    h = 100;

    speed = moveSpeed;
    verspeed = 8;

    falling = false;

    currentBlock.style.left = x + "px";
    currentBlock.style.top = h + "px";

    updateUI();
}

function animate() {

    if (!falling) {

        x += speed;

        // Left = 500px, Right = 300px
        if (x >= window.innerWidth - 300 || x <= 500) {
            speed = -speed;
        }

        currentBlock.style.left = x + "px";
    }

    if (falling) {

        h += verspeed;
        currentBlock.style.top = h + "px";

        for (let b of blocks) {

            let overlapAmount =
                Math.min(x + 150, b.x + 150) -
                Math.max(x, b.x);

            let touchTop =
                h + 150 >= b.y &&
                h + 150 <= b.y + verspeed;

            if (touchTop) {

                // Lose if overlap too small
                if (overlapAmount < 30) {
                    gameOver();
                    return;
                }

                let finalY = b.y - 150;

                currentBlock.style.top = finalY + "px";

                score++;

                // Perfect bonus
                if (Math.abs(x - b.x) < 10) {
                    score += 5;
                }

                saveHighScore();

                blocks.push({
                    x: x,
                    y: finalY
                });

                updateUI();

                // Win at 50 score
                if (score >= 50) {
                    winGame();
                    return;
                }

                // Camera follow
                if (finalY < 300) {
                    moveCamera(150);
                }

                newBlock();

                requestAnimationFrame(animate);
                return;
            }
        }

        // Ground collision
        if (h >= window.innerHeight - 150) {

            let groundY = window.innerHeight - 150;

            currentBlock.style.top = groundY + "px";

            score++;

            saveHighScore();

            blocks.push({
                x: x,
                y: groundY
            });

            updateUI();

            newBlock();
        }
    }

    requestAnimationFrame(animate);
}

animate();