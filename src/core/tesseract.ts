import {
  Vec4,
  Vec2,
  vec4,
  rotateXY,
  rotateXZ,
  rotateXW,
  rotateYZ,
  rotateYW,
  rotateZW,
  project4Dto2D,
} from "./math4d.js";

export class Tesseract {
  vertices: Vec4[];
  edges: [number, number][];

  constructor(size: number = 1) {
    const s = size / 2;

    // 16 vertices of a tesseract (4D hypercube)
    // Each vertex is a combination of ±s in all 4 dimensions
    this.vertices = [];
    for (let i = 0; i < 16; i++) {
      this.vertices.push(
        vec4(
          i & 1 ? s : -s,
          i & 2 ? s : -s,
          i & 4 ? s : -s,
          i & 8 ? s : -s
        )
      );
    }

    // 32 edges: connect vertices that differ in exactly one coordinate
    this.edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        const diff = i ^ j;
        // Check if exactly one bit differs (power of 2)
        if ((diff & (diff - 1)) === 0) {
          this.edges.push([i, j]);
        }
      }
    }
  }

  getRotatedVertices(
    angleXY: number,
    angleXZ: number,
    angleXW: number,
    angleYZ: number,
    angleYW: number,
    angleZW: number
  ): Vec4[] {
    return this.vertices.map((v) => {
      let rotated = rotateXY(v, angleXY);
      rotated = rotateXZ(rotated, angleXZ);
      rotated = rotateXW(rotated, angleXW);
      rotated = rotateYZ(rotated, angleYZ);
      rotated = rotateYW(rotated, angleYW);
      rotated = rotateZW(rotated, angleZW);
      return rotated;
    });
  }

  getProjectedVertices(
    angleXY: number,
    angleXZ: number,
    angleXW: number,
    angleYZ: number,
    angleYW: number,
    angleZW: number,
    dist4D: number = 2,
    dist3D: number = 3
  ): Vec2[] {
    const rotated = this.getRotatedVertices(
      angleXY,
      angleXZ,
      angleXW,
      angleYZ,
      angleYW,
      angleZW
    );
    return rotated.map((v) => project4Dto2D(v, dist4D, dist3D));
  }
}
