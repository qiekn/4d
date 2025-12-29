import { Tesseract } from "./core/tesseract.js";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const scale = 150;

const tesseract = new Tesseract(1);

// Rotation angles (in radians)
let angleXY = 0;
let angleXZ = 0;
let angleXW = 0;
let angleYW = 0;

// Get slider elements
const sliderXY = document.getElementById("rot-xy") as HTMLInputElement;
const sliderXZ = document.getElementById("rot-xz") as HTMLInputElement;
const sliderXW = document.getElementById("rot-xw") as HTMLInputElement;
const sliderYW = document.getElementById("rot-yw") as HTMLInputElement;

const valXY = document.getElementById("xy-val")!;
const valXZ = document.getElementById("xz-val")!;
const valXW = document.getElementById("xw-val")!;
const valYW = document.getElementById("yw-val")!;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function updateAngles() {
  angleXY = degToRad(parseFloat(sliderXY.value));
  angleXZ = degToRad(parseFloat(sliderXZ.value));
  angleXW = degToRad(parseFloat(sliderXW.value));
  angleYW = degToRad(parseFloat(sliderYW.value));

  valXY.textContent = `${sliderXY.value}°`;
  valXZ.textContent = `${sliderXZ.value}°`;
  valXW.textContent = `${sliderXW.value}°`;
  valYW.textContent = `${sliderYW.value}°`;
}

function render() {
  ctx.fillStyle = "#0f0f1a";
  ctx.fillRect(0, 0, width, height);

  const projected = tesseract.getProjectedVertices(
    angleXY,
    angleXZ,
    angleXW,
    angleYW,
    2,
    3
  );

  // Draw edges
  ctx.strokeStyle = "#4cc9f0";
  ctx.lineWidth = 1.5;

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
    ctx.arc(centerX + p.x * scale, centerY - p.y * scale, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw info
  ctx.fillStyle = "#eee";
  ctx.font = "14px monospace";
  ctx.fillText("Tesseract (4D Hypercube)", 10, 25);
  ctx.fillText("16 vertices, 32 edges", 10, 45);
}

// Event listeners for sliders
sliderXY.addEventListener("input", () => {
  updateAngles();
  render();
});

sliderXZ.addEventListener("input", () => {
  updateAngles();
  render();
});

sliderXW.addEventListener("input", () => {
  updateAngles();
  render();
});

sliderYW.addEventListener("input", () => {
  updateAngles();
  render();
});

// Initial render
updateAngles();
render();
