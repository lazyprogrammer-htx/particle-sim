function triggerBloomEffect(bloomDuration, mousePos) {
  // const size = (MAX_BLOOM_DURATION - bloomDuration) / 10;
  const size = Math.round((bloomDuration) / 10);
  const x = mousePos.x;
  const y = mousePos.y;

  console.log(`Trigger bloom size ${size} @ ${x}, ${y}`);

  // CONTEXT.reset();
  // drawDot(x, y, size, getRandomRgba())
  const color = getRandomRgba();


  for (let i = 0; i < size; i++){
    const thisParticleXSpeed = getRandomInt(0 - size, size);
    const thisParticleYSpeed = getRandomInt(0 - size, size);
    console.log(`${thisParticleXSpeed} ${thisParticleYSpeed}`)
    addNewParticle(x + getRandomInt( 0 - size, size), y + getRandomInt( 0 - size, size), thisParticleXSpeed, thisParticleYSpeed, 5, color)
  }
}

function addNewParticle(x, y, xSpeed, ySpeed, size, color){
  console.log(`Particle(${size} / ${color}) ${x}, ${y}  @ ${xSpeed},${ySpeed}`)
  drawDot(x, y, size, getRandomRgba())
}



function drawDot(x, y, size, color){
  CONTEXT.beginPath();
  CONTEXT.arc(x, y, size, 0, 2 * Math.PI)
  CONTEXT.fillStyle = color;
  CONTEXT.fill();
}

//called every time canvas resizes - this needs to also re-gen the effekts
function resizeCanvas() {
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
}

function mouseDown(event) {
  mouseDownTime = Date.now();
}

function mouseUp(event) {
  mouseUpTime = Date.now();
  if (bloomEventActive) {
    let bloomDuration = mouseUpTime - mouseDownTime;
    bloomDuration = Math.min(MAX_BLOOM_DURATION, bloomDuration);
    bloomDuration = Math.max(MIN_BLOOM_DURATION, bloomDuration);
    // console.log("Bloom: " + bloomDuration);

    triggerBloomEffect(bloomDuration, getMousePos(event));
  }
}

function getMousePos(evt) {
  const rect = CANVAS.getBoundingClientRect();
  // console.log(`MousePOS ${evt.clientX - rect.left} ${evt.clientY - rect.top}`)
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function getCanvasSize(){
  const rect = CANVAS.getBoundingClientRect();
  return {
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
  }
}

function getRandomRgba(){
  return `rgba(${getRandomInt(0,255)}, ${getRandomInt(0,255)}, ${getRandomInt(0,255)}, ${Math.random()})`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeUserSettings(){
  acceleration = ACCELERATION_INPUT.value / 100;
  speed = SPEED_INPUT.value; // / 100;
  console.log(`\nAcc: ${acceleration}\tSpeed: ${speed}\n`)
  ACCELERATION_DISPLAY.textContent = acceleration;
  SPEED_DISPLAY.textContent = speed;
}

function init(){
  changeUserSettings();

  window.addEventListener('resize', resizeCanvas);
  // CANVAS.addEventListener("mousemove", getMousePosition);
  CANVAS.addEventListener("mousedown", mouseDown);
  CANVAS.addEventListener("mouseup", mouseUp);

  ACCELERATION_INPUT.addEventListener("change", changeUserSettings)
  SPEED_INPUT.addEventListener("change", changeUserSettings)

  // setInterval((h) => {
  //   console.log(getCanvasSize())
  // },500)
}

const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
const ACCELERATION_INPUT = document.querySelector("#acceleration100x")
const ACCELERATION_DISPLAY = document.querySelector("#acceleration100xDisplay")

const SPEED_INPUT = document.querySelector("#speed")
const SPEED_DISPLAY = document.querySelector("#speedDisplay")

const MAX_BLOOM_DURATION = 1000;
const MIN_BLOOM_DURATION = 100;

let acceleration = 1;
let speed = 1;

let mouseDownTime = -1;
let mouseX = -1;
let mouseY = -1;
let bloomEventActive = true;

let particles = [];

resizeCanvas();
init();

// let times = [];
// let fps = 0;

// function calculateFps() {
//   window.requestAnimationFrame(function() {
//     const now = performance.now();

//     // Remove old timestamps (older than 1 second)
//     while (times.length > 0 && times[0] <= now - 1000) {
//       times.shift();
//     }

//     // Add current timestamp
//     times.push(now);

//     // The number of timestamps in the array represents the FPS
//     fps = times.length;

//     // Log or display the FPS
//     console.log("FPS:", fps);

//     // Call the function again for the next frame
//     calculateFps();
//   });
// }

// // Start the FPS calculation loop
// calculateFps();