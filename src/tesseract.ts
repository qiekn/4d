import { Tesseract } from "./core/tesseract.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Handle high DPI displays
const dpr = window.devicePixelRatio || 1;
const displayWidth = 800;
const displayHeight = 800;
canvas.width = displayWidth * dpr;
canvas.height = displayHeight * dpr;
canvas.style.width = `${displayWidth}px`;
canvas.style.height = `${displayHeight}px`;
ctx.scale(dpr, dpr);

const width = displayWidth;
const height = displayHeight;
const centerX = width / 2;
const centerY = height / 2;
const scale = 250;

const tesseract = new Tesseract(1);

// Rotation angles (in radians)
let angleXY = 0;
let angleXZ = 0;
let angleXW = 0;
let angleYZ = 0;
let angleYW = 0;
let angleZW = 0;

// Get slider elements
const sliderXY = document.getElementById("rot-xy") as HTMLInputElement;
const sliderXZ = document.getElementById("rot-xz") as HTMLInputElement;
const sliderXW = document.getElementById("rot-xw") as HTMLInputElement;
const sliderYZ = document.getElementById("rot-yz") as HTMLInputElement;
const sliderYW = document.getElementById("rot-yw") as HTMLInputElement;
const sliderZW = document.getElementById("rot-zw") as HTMLInputElement;

const valXY = document.getElementById("xy-val")!;
const valXZ = document.getElementById("xz-val")!;
const valXW = document.getElementById("xw-val")!;
const valYZ = document.getElementById("yz-val")!;
const valYW = document.getElementById("yw-val")!;
const valZW = document.getElementById("zw-val")!;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function updateAngles() {
  angleXY = degToRad(parseFloat(sliderXY.value));
  angleXZ = degToRad(parseFloat(sliderXZ.value));
  angleXW = degToRad(parseFloat(sliderXW.value));
  angleYZ = degToRad(parseFloat(sliderYZ.value));
  angleYW = degToRad(parseFloat(sliderYW.value));
  angleZW = degToRad(parseFloat(sliderZW.value));

  valXY.textContent = `${sliderXY.value}°`;
  valXZ.textContent = `${sliderXZ.value}°`;
  valXW.textContent = `${sliderXW.value}°`;
  valYZ.textContent = `${sliderYZ.value}°`;
  valYW.textContent = `${sliderYW.value}°`;
  valZW.textContent = `${sliderZW.value}°`;
}

function render() {
  ctx.fillStyle = "#0f0f1a";
  ctx.fillRect(0, 0, width, height);

  const projected = tesseract.getProjectedVertices(
    angleXY,
    angleXZ,
    angleXW,
    angleYZ,
    angleYW,
    angleZW,
    2,
    3
  );

  // Draw edges
  ctx.strokeStyle = "#4cc9f0";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  for (const [i, j] of tesseract.edges) {
    const p1 = projected[i];
    const p2 = projected[j];

    ctx.beginPath();
    ctx.moveTo(centerX + p1.x * scale, centerY - p1.y * scale);
    ctx.lineTo(centerX + p2.x * scale, centerY - p2.y * scale);
    ctx.stroke();
  }

  // Draw vertices
  ctx.fillStyle = "#f72585";
  for (const p of projected) {
    ctx.beginPath();
    ctx.arc(centerX + p.x * scale, centerY - p.y * scale, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw info
  ctx.fillStyle = "#eee";
  ctx.font = "20px monospace";
  ctx.fillText("Tesseract (4D Hypercube)", 15, 35);
  ctx.fillText("16 vertices, 32 edges", 15, 60);
}

// Event listeners for sliders
const sliders = [sliderXY, sliderXZ, sliderXW, sliderYZ, sliderYW, sliderZW];
for (const slider of sliders) {
  slider.addEventListener("input", () => {
    updateAngles();
    render();
  });
}

// Initial render
updateAngles();
render();
