const dropzone1 = document.getElementById("dropzone1");

let x = 300;
let speed = 5;

let h = 100;
let verspeed = 7;
let falling = false;

document.addEventListener("click", function () {
    speed = 0;
    falling = true;
});

function animate() {
    x += speed;

    if (x >= window.innerWidth - 500 || x <= 300) {
        speed = -speed;
    }

    dropzone1.style.left = x + "px";

    if (falling) {
        h += verspeed;

        if (h >= window.innerHeight - 150) {
            verspeed = 0;
            h = window.innerHeight - 150;
        }

        dropzone1.style.top = h + "px";
    }

    requestAnimationFrame(animate);
}

animate();