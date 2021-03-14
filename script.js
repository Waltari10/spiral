const Color = require('color');

// https://www.youtube.com/watch?v=EK32jo7i5LQ

const targetFPS = 60
const targetFrameDuration = (1000 / targetFPS)

global.canvas = document.getElementById('canvas')
global.ctx = canvas.getContext('2d')
global.timeDelta = 1000 / targetFPS

function backingScale() {
  if ('devicePixelRatio' in window) {
    if (window.devicePixelRatio > 1) {
      return window.devicePixelRatio;
    }
  }
  return 1;
}

const scaleFactor = backingScale()

// Fix on retina display
if (scaleFactor > 1) {
  canvas.width = canvas.width * scaleFactor;
  canvas.height = canvas.height * scaleFactor;
  // update the context for the new canvas scale
  global.ctx = canvas.getContext("2d");

}


function getXOnCircle(radius, radian, x) {
  return radius * Math.cos(radian) + x;
};

function getYOnCircle(radius, radian, y) {
  return radius * Math.sin(radian) + y;
}


const dots = 2000;


const width = window.innerWidth
const height = window.innerHeight

const canvasData = ctx.getImageData(0, 0, width, height);



function wipeCanvasData() {

  for (let i = 0; i < canvasData.data.length; i++) {
    canvasData.data[i] = 0;
  }
}

// That's how you define the value of a pixel //
function drawPixel(x, y, r, g, b, a) {

  if (x < 0 || y < 0 || x > width || y > height) {
    return
  }

  var index = (x + y * width) * 4;

  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}

// That's how you update the canvas, so that your //
// modification are taken in consideration //
function updateCanvas() {
  ctx.putImageData(canvasData, 0, 0);
}


let rotation = 0;



let startColor = Color({ r: 0, g: 255, b: 0 });
const colorModifier = 1;
const modifier = 0.1; // 0.1 - 1 reasonable

function spiral(start) {



  rotation += -0.001;

  for (let i = 0; i < dots; i += modifier) {


    const oldX = Math.floor(getXOnCircle(i - modifier, i - modifier + rotation + start, width / 2));
    const oldY = Math.floor(getYOnCircle(i - modifier, i - modifier + rotation + start, height / 2));

    const newX = Math.floor(getXOnCircle(i, i + rotation + start, width / 2));
    const newY = Math.floor(getYOnCircle(i, i + rotation + start, height / 2));

    const oldIndex = (oldX + oldY * width) * 4;

    const oldR = canvasData.data[oldIndex + 0];
    const oldG = i === 0 ? 255 : canvasData.data[oldIndex + 1];
    const oldB = canvasData.data[oldIndex + 2];

    const oldColor = Color({ r: oldR, g: oldG, b: oldB });

    const rotatedColor = oldColor.rotate(colorModifier);

    const colorArr = rotatedColor.rgb().array();

    drawPixel(newX, newY, colorArr[0], colorArr[1], colorArr[2], 255);
  }


}

function loop() {

  const startTime = Date.now()
  wipeCanvasData();
  spiral(0);
  // spiral(Math.PI);
  updateCanvas();
  const renderTime = Date.now() - startTime
  timeDelta = renderTime < targetFrameDuration ? targetFrameDuration : renderTime
  this.setTimeout(() => {
    loop()
  }, targetFrameDuration - renderTime)
}

loop()
