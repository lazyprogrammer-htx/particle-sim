const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// console.log(canvas.width);
// console.log(canvas.height);
// ctx.fillStyle = "green";
// ctx.fillRect(1, 1, 10, 10);
console.log(canvas.mou);

canvas.addEventListener("mousemove", getMousePosition);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);

let mouseDownTime = -1;
let mouseUpTime = -1;
let mouseX = -1;
let mouseY = -1;

let bloomEventActive = true;

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;

  //   console.log(`Mouse: ${mouseX}, ${mouseY}`);
}

function mouseDown(event) {
  mouseDownTime = Date.now();
}

function mouseUp(event) {
  mouseUpTime = Date.now();
  if (bloomEventActive) {
    let bloomDuration = mouseUpTime - mouseDownTime;
    bloomDuration = Math.min(2000, bloomDuration);
    bloomDuration = Math.max(100, bloomDuration);
    // console.log("Bloom: " + bloomDuration);

    triggerBloomEffect(bloomDuration, getMousePos(event));
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function triggerBloomEffect(bloomDuration, { mousePos }) {
  console.log(
    "Triggering bloom effect for " +
      bloomDuration +
      "ms @ " +
      mousePos.x +
      ", " +
      mousePos.y
  );
  ctx.fillStyle = "red";
  const size = bloomDuration / 10;
  ctx.fillRect(mouseX - size, mouseY - size, size * 2, size * 2);

  //   console.log(mouseX - size, mouseY - size, size * 2, size * 2);
  console.log(size);
}
