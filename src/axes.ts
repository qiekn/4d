import {
  Vec4,
  vec4,
  rotateXY,
  rotateXZ,
  rotateXW,
  rotateYZ,
  rotateYW,
  rotateZW,
  project4Dto2D,
} from "./core/math4d.js";

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

// 4D axes: origin and endpoints
const origin = vec4(0, 0, 0, 0);
const axisLength = 1.5;

const axes = [
  { dir: vec4(axisLength, 0, 0, 0), color: "#ff6b6b", label: "X" },
  { dir: vec4(0, axisLength, 0, 0), color: "#4ecdc4", label: "Y" },
  { dir: vec4(0, 0, axisLength, 0), color: "#ffe66d", label: "Z" },
  { dir: vec4(0, 0, 0, axisLength), color: "#c44dff", label: "W" },
];

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

function rotatePoint(v: Vec4): Vec4 {
  let rotated = rotateXY(v, angleXY);
  rotated = rotateXZ(rotated, angleXZ);
  rotated = rotateXW(rotated, angleXW);
  rotated = rotateYZ(rotated, angleYZ);
  rotated = rotateYW(rotated, angleYW);
  rotated = rotateZW(rotated, angleZW);
  return rotated;
}

function render() {
  ctx.fillStyle = "#0f0f1a";
  ctx.fillRect(0, 0, width, height);

  // Project origin
  const originRotated = rotatePoint(origin);
  const origin2D = project4Dto2D(originRotated, 2, 3);
  const ox = centerX + origin2D.x * scale;
  const oy = centerY - origin2D.y * scale;

  // Draw each axis
  for (const axis of axes) {
    const endRotated = rotatePoint(axis.dir);
    const end2D = project4Dto2D(endRotated, 2, 3);
    const ex = centerX + end2D.x * scale;
    const ey = centerY - end2D.y * scale;

    // Draw axis line
    ctx.strokeStyle = axis.color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Draw arrow head
    const angle = Math.atan2(ey - oy, ex - ox);
    const arrowSize = 20;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(
      ex - arrowSize * Math.cos(angle - Math.PI / 6),
      ey - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(ex, ey);
    ctx.lineTo(
      ex - arrowSize * Math.cos(angle + Math.PI / 6),
      ey - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();

    // Draw label
    ctx.fillStyle = axis.color;
    ctx.font = "bold 28px monospace";
    const labelOffset = 30;
    ctx.fillText(
      axis.label,
      ex + labelOffset * Math.cos(angle),
      ey + labelOffset * Math.sin(angle)
    );
  }

  // Draw origin point
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ox, oy, 8, 0, Math.PI * 2);
  ctx.fill();

  // Draw info
  ctx.fillStyle = "#eee";
  ctx.font = "20px monospace";
  ctx.fillText("4D Coordinate Axes", 15, 35);
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

sliderYZ.addEventListener("input", () => {
  updateAngles();
  render();
});

sliderYW.addEventListener("input", () => {
  updateAngles();
  render();
});

sliderZW.addEventListener("input", () => {
  updateAngles();
  render();
});

// Initial render
updateAngles();
render();
