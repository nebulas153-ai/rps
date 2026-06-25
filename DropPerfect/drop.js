const BLOCK_SIZE = Math.min(window.innerWidth * 0.18, 150);

function createBlock() {
    const block = document.createElement("div");

    const colors = [
        "red", "blue", "green",
        "purple", "orange", "cyan", "yellow"
    ];

    block.style.position = "absolute";
    block.style.width = BLOCK_SIZE + "px";
    block.style.height = BLOCK_SIZE + "px";
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
scoreText.style.margin = "0";
scoreText.style.zIndex = "999";

const levelText = document.createElement("h2");
levelText.style.position = "fixed";
levelText.style.top = "40px";
levelText.style.left = "10px";
levelText.style.margin = "0";
levelText.style.zIndex = "999";

const highText = document.createElement("h2");
highText.style.position = "fixed";
highText.style.top = "70px";
highText.style.left = "10px";
highText.style.margin = "0";
highText.style.zIndex = "999";

document.body.appendChild(scoreText);
document.body.appendChild(levelText);
document.body.appendChild(highText);

function updateUI() {
    scoreText.innerText = `Score: ${score}`;
    levelText.innerText = `Level: ${level}`;
    highText.innerText = `High Score: ${highScore}`;
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

let x = window.innerWidth / 2 - BLOCK_SIZE / 2;
let h = 100;

let speed = moveSpeed;
let verspeed = 8;

let falling = false;

currentBlock.style.left = x + "px";
currentBlock.style.top = h + "px";

function dropBlock() {
    if (!falling) {
        speed = 0;
        falling = true;
    }
}

document.addEventListener("click", dropBlock);
document.addEventListener("touchstart", dropBlock);

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
        "Level: " + level + "\n" +
        "High Score: " + highScore
    );

    location.reload();
}

function newBlock() {

    level++;
    moveSpeed += 0.5;

    currentBlock = createBlock();

    x = window.innerWidth / 2 - BLOCK_SIZE / 2;
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

        if (x >= window.innerWidth - BLOCK_SIZE || x <= 0) {
            speed = -speed;
        }

        currentBlock.style.left = x + "px";
    }

    if (falling) {

        h += verspeed;
        currentBlock.style.top = h + "px";

        for (let b of blocks) {

            let overlapAmount =
                Math.min(x + BLOCK_SIZE, b.x + BLOCK_SIZE) -
                Math.max(x, b.x);

            let touchTop =
                h + BLOCK_SIZE >= b.y &&
                h + BLOCK_SIZE <= b.y + verspeed;

            if (touchTop) {

                if (overlapAmount < BLOCK_SIZE * 0.2) {
                    gameOver();
                    return;
                }

                let finalY = b.y - BLOCK_SIZE;

                currentBlock.style.top = finalY + "px";

                score++;

                if (Math.abs(x - b.x) < 10) {
                    score += 5;
                }

                saveHighScore();

                blocks.push({
                    x: x,
                    y: finalY
                });

                updateUI();

                if (finalY < 300) {
                    moveCamera(BLOCK_SIZE);
                }

                newBlock();

                requestAnimationFrame(animate);
                return;
            }
        }

        if (h >= window.innerHeight - BLOCK_SIZE) {

            let groundY = window.innerHeight - BLOCK_SIZE;

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

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.touchAction = "manipulation";
document.body.style.userSelect = "none";

window.addEventListener("resize", () => {
    location.reload();
});

animate();