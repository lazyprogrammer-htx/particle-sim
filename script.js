function triggerBloomEffect(bloomDuration, mousePos) {
  // const size = (MAX_BLOOM_DURATION - bloomDuration) / 10;
  const size = Math.round(bloomDuration / 10);
  const x = mousePos.x;
  const y = mousePos.y;

  console.log(`Trigger bloom size ${size} @ ${x}, ${y}`);

  // CONTEXT.reset();
  // drawDot(x, y, size, getRandomRgba())
  const color = getRandomRgba();

  for (let i = 0; i < size * 10; i++) {
    const thisParticleXSpeed = getRandomInt(0 - size, size);
    const thisParticleYSpeed = getRandomInt(0 - size, size);
    // console.log(`${thisParticleXSpeed} ${thisParticleYSpeed}`);
    addNewParticle(
      x + getRandomInt(0 - size, size),
      y + getRandomInt(0 - size, size),
      thisParticleXSpeed,
      thisParticleYSpeed,
      getRandomInt(4, 12),
      color
    );
  }
  // calculateNewPositions();
}

function addNewParticle(x, y, xSpeed, ySpeed, size, color) {
  const newParticle = {
    x,
    y,
    xSpeed,
    ySpeed,
    size,
    color,
    // lifetime: performance.now() + getRandomInt(3000, 10000), // 2-6 seconds
    lifetime: performance.now() + 10000, //getRandomInt(3000, 10000), // 2-6 seconds
    driftX: (Math.random() - 0.5) * 0.2, // Random drift -0.1 to 0.1
    driftY: (Math.random() - 0.5) * 0.2
  };
  particles.push(newParticle);
}

function drawDot(x, y, size, color) {
  CONTEXT.beginPath();
  CONTEXT.arc(x, y, size, 0, 2 * Math.PI);
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

function getCanvasSize() {
  const rect = CANVAS.getBoundingClientRect();
  return {
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
  };
}

function getRandomRgba() {
  return `rgba(${getRandomInt(100, 255)}, ${getRandomInt(
    100,
    255
  )}, ${getRandomInt(100, 255)}, ${0.7 + Math.random() * 0.3})`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeUserSettings() {
  acceleration = ACCELERATION_INPUT.value / 1000;
  speed = SPEED_INPUT.value / 1000;
  ACCELERATION_DISPLAY.textContent = ACCELERATION_INPUT.value + " /1000" ;  
  SPEED_DISPLAY.textContent = SPEED_INPUT.value + " /1000" ;
}

function init() {
  changeUserSettings();

  window.addEventListener("resize", resizeCanvas);
  // CANVAS.addEventListener("mousemove", getMousePosition);
  CANVAS.addEventListener("mousedown", mouseDown);
  CANVAS.addEventListener("mouseup", mouseUp);

  ACCELERATION_INPUT.addEventListener("change", changeUserSettings);
  SPEED_INPUT.addEventListener("change", changeUserSettings);

  // setInterval((h) => {
  //   console.log(getCanvasSize())
  // },500)
}

function calculateNewPositions() {
  const currentTime = performance.now();
  const timeElapsedSeconds = (currentTime - lastTime) / 1000;
  const { width, height } = getCanvasSize();
  if (timeElapsedSeconds < 0.01) return;

  const timeFactor = acceleration * acceleration / (timeElapsedSeconds * timeElapsedSeconds);
  const speedFactor = speed / 1000;

  let newParticles = [];
  
  particles.forEach((particle) => {
    // Skip particles that have exceeded their lifetime
    if (currentTime > particle.lifetime) {
      return;
    }
    
    const newPositionParticle = particle;
    const xMovement = (particle.xSpeed * speedFactor) * timeFactor;
    const yMovement = (particle.ySpeed * speedFactor) * timeFactor;
    
    // Add random drift to prevent stagnation
    newPositionParticle.x += xMovement + particle.driftX;
    newPositionParticle.y += yMovement + particle.driftY;
    
    // Add slight random movement each frame
    particle.driftX += (Math.random() - 0.5) * 0.05;
    particle.driftY += (Math.random() - 0.5) * 0.05;
    
    // Limit drift to prevent particles from moving too erratically
    particle.driftX = Math.max(-1, Math.min(1, particle.driftX));
    particle.driftY = Math.max(-1, Math.min(1, particle.driftY));
    
    if (
      newPositionParticle.x >= 0 &&
      newPositionParticle.y >= 0 &&
      newPositionParticle.x < width &&
      newPositionParticle.y < height
    ) {
      newParticles.push(newPositionParticle);
    }
  });

  // console.log(particles.length - newParticles.length + " particles removed");

  CONTEXT.clearRect(0, 0, width, height);
  newParticles.forEach((p) => {
    drawDot(p.x, p.y, p.size, p.color);
  });

  particles = newParticles;
  newParticles = null;


  lastTime = performance.now();
}

function prettyPrintParticles() {
  particles.forEach((p) => {
    console.log(`P ${p.x}, ${p.y} \t${p.xSpeed}, ${p.ySpeed}`);
  });
}

const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
const ACCELERATION_INPUT = document.querySelector("#acceleration100x");
const ACCELERATION_DISPLAY = document.querySelector("#acceleration100xDisplay");

const SPEED_INPUT = document.querySelector("#speed");
const SPEED_DISPLAY = document.querySelector("#speedDisplay");
const FPS_COUNTER = document.querySelector("#fpsCounter");
const PARTICLE_COUNTER = document.querySelector("#particleCounter");

const MAX_BLOOM_DURATION = 1000;
const MIN_BLOOM_DURATION = 100;

let acceleration = 1;
let speed = 1;
let lastTime = performance.now();

let mouseDownTime = -1;
let mouseX = -1;
let mouseY = -1;
let bloomEventActive = true;

let particles = [];

// FPS calculation variables
let frameCount = 0;
let fpsLastTime = performance.now();
let currentFPS = 0;

resizeCanvas();
init();

// setInterval(() => {
//   const { width, height } = getCanvasSize();
//   triggerBloomEffect(getRandomInt(100, 1000), {
//     x: getRandomInt(0, width),
//     y: getRandomInt(0, height),
//   });
//   // prettyPrintParticles();
// }, 500);

function updateFPS() {
  frameCount++;
  const now = performance.now();
  const elapsed = now - fpsLastTime;
  
  if (elapsed >= 1000) { // Update FPS every second
    currentFPS = Math.round((frameCount * 1000) / elapsed);
    FPS_COUNTER.textContent = `FPS: ${currentFPS}`;
    frameCount = 0;
    fpsLastTime = now;

    PARTICLE_COUNTER.textContent = `P: ${particles.length}`;
  }
}

function animationLoop() {
  calculateNewPositions();
  updateFPS();
  requestAnimationFrame(animationLoop);
}

animationLoop();

// drawDot(-100, -100, 5, getRandomRgba());
// drawDot(-1, -1, 5, getRandomRgba());
// drawDot(-1, -1, 5, getRandomRgba());

// let lastTime = new Date();

// setInterval(() => {
//   const thisTime = new Date();
//   console.log(thisTime - lastTime);
//   lastTime = thisTime;
// }, 1000 / 60);

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
