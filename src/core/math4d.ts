export interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Vec2 {
  x: number;
  y: number;
}

export function vec4(x: number, y: number, z: number, w: number): Vec4 {
  return { x, y, z, w };
}

// 4D rotation in XY plane
export function rotateXY(v: Vec4, angle: number): Vec4 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
    z: v.z,
    w: v.w,
  };
}

// 4D rotation in XZ plane
export function rotateXZ(v: Vec4, angle: number): Vec4 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.z * sin,
    y: v.y,
    z: v.x * sin + v.z * cos,
    w: v.w,
  };
}

// 4D rotation in XW plane
export function rotateXW(v: Vec4, angle: number): Vec4 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.w * sin,
    y: v.y,
    z: v.z,
    w: v.x * sin + v.w * cos,
  };
}

// 4D rotation in YZ plane
export function rotateYZ(v: Vec4, angle: number): Vec4 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x,
    y: v.y * cos - v.z * sin,
    z: v.y * sin + v.z * cos,
    w: v.w,
  };
}

// 4D rotation in YW plane
export function rotateYW(v: Vec4, angle: number): Vec4 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x,
    y: v.y * cos - v.w * sin,
    z: v.z,
    w: v.y * sin + v.w * cos,
  };
}

// 4D rotation in ZW plane
export function rotateZW(v: Vec4, angle: number): Vec4 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x,
    y: v.y,
    z: v.z * cos - v.w * sin,
    w: v.z * sin + v.w * cos,
  };
}

// Project 4D to 3D using perspective projection
export function project4Dto3D(v: Vec4, distance: number = 2): Vec3 {
  const factor = distance / (distance - v.w);
  return {
    x: v.x * factor,
    y: v.y * factor,
    z: v.z * factor,
  };
}

// Project 3D to 2D using perspective projection
export function project3Dto2D(v: Vec3, distance: number = 3): Vec2 {
  const factor = distance / (distance - v.z);
  return {
    x: v.x * factor,
    y: v.y * factor,
  };
}

// Combined projection from 4D to 2D
export function project4Dto2D(
  v: Vec4,
  dist4D: number = 2,
  dist3D: number = 3
): Vec2 {
  const v3 = project4Dto3D(v, dist4D);
  return project3Dto2D(v3, dist3D);
}
