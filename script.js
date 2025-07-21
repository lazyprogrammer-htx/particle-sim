const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener("mousemove", getMousePosition);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);

let mouseDownTime = -1;
let mouseX = -1;
let mouseY = -1;
let bloomEventActive = true;

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;

    // console.log(`Mouse: ${mouseX}, ${mouseY}`);
}

function mouseDown(event) {
  mouseDownTime = Date.now();
}

function mouseUp(event) {
  mouseUpTime = Date.now();
  if (bloomEventActive) {
    let bloomDuration = mouseUpTime - mouseDownTime;
    bloomDuration = Math.min(1000, bloomDuration);
    bloomDuration = Math.max(10, bloomDuration);
    // console.log("Bloom: " + bloomDuration);

    triggerBloomEffect(bloomDuration, getMousePos(event));
  }
}

function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function triggerBloomEffect(bloomDuration, mousePos) {
  const size = bloomDuration / 10;
  const centerX = mousePos.x;
  const centerY = mousePos.y;

  console.log(
    "Triggering bloom effect for " +
      bloomDuration +
      "ms @ " +
      centerX +
      ", " +
      centerY
  );

  // ctx.reset();
  ctx.beginPath();
  ctx.arc(centerX, centerY, size, 0, 2 * Math.PI)
  ctx.fillStyle = getRandomRgba();
  ctx.fill();
}

function getRandomRgba(){
  return `rgba(${getRandomInt(0,255)}, ${getRandomInt(0,255)}, ${getRandomInt(0,255)}, ${Math.random()})`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
