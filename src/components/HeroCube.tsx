"use client";

import { useEffect, useRef } from "react";

// Real hero cube: a 3D Rubik's cube that scrambles, solves, and idles —
// ported 1:1 from the author's canvas script into a React effect.
export default function HeroCube() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0,
      height = 0;
    const fov = Math.PI / 3;
    let fovVertical = fov;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = wrap!.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      width = cssW;
      height = cssH;
      canvas!.width = Math.round(cssW * dpr);
      canvas!.height = Math.round(cssH * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      fovVertical = fov;
    }

    const worldVelocity = { x: 0, y: 0, z: 0, xrot: 0.1, yrot: 0.3, zrot: 0 };
    const worldTransform = { x: 0, y: 0, z: 6, xrot: 0, yrot: 0, zrot: 0 };
    const animationDuration = 50;
    const movePause = 90;
    const pauseDuration = 240;
    const scrambleLength = 9;

    const baseSpinX = 0.005;
    const baseSpinY = 0.01;
    let spinFactor = 1;
    const spinEase = 0.04;

    function easeInOutQuint(t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t * t * t + 2) + b;
    }

    class Point {
      x: number;
      y: number;
      z: number;
      constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
      project() {
        const s = Math.min(width, height);
        return new Point(
          width / 2 + (s * (this.x / (this.z * 2 * Math.tan(fovVertical / 2)))),
          height / 2 + (s * (this.y / (this.z * 2 * Math.tan(fovVertical / 2)))),
          this.z
        );
      }
      rotateX(theta: number) {
        return new Point(
          this.x,
          this.y * Math.cos(theta) - this.z * Math.sin(theta),
          this.y * Math.sin(theta) + this.z * Math.cos(theta)
        );
      }
      rotateY(theta: number) {
        return new Point(
          this.x * Math.cos(theta) - this.z * Math.sin(theta),
          this.y,
          this.x * Math.sin(theta) + this.z * Math.cos(theta)
        );
      }
      rotateZ(theta: number) {
        return new Point(
          this.x * Math.cos(theta) - this.y * Math.sin(theta),
          this.x * Math.sin(theta) + this.y * Math.cos(theta),
          this.z
        );
      }
      translate(x: number, y: number, z: number) {
        return new Point(this.x + x, this.y + y, this.z + z);
      }
    }

    type QueueItem = [string, number, Point, Point, Point, Point];
    let queue: QueueItem[] = [];
    function queueQuad(p0: Point, p1: Point, p2: Point, p3: Point, colour: string) {
      const averageZ = (p0.z + p1.z + p2.z + p3.z) / 4;
      const element: QueueItem = [colour, averageZ, p0.project(), p1.project(), p2.project(), p3.project()];
      if (queue.length === 0) queue[0] = element;
      else {
        queue[queue.length] = element;
        for (let x = queue.length - 2; x >= 0 && queue[x][1] < averageZ; x -= 1) {
          queue[x + 1] = queue[x];
          queue[x] = element;
        }
      }
    }
    const clearDrawQueue = () => {
      queue = [];
    };
    const lineColour = "#E3E2DF";
    function drawQueue() {
      const lw = Math.max(1, Math.min(width, height) / 320);
      ctx!.lineJoin = "round";
      ctx!.lineCap = "round";
      for (let x = 0; x < queue.length; x++) {
        ctx!.fillStyle = queue[x][0];
        ctx!.strokeStyle = lineColour;
        ctx!.lineWidth = lw;
        ctx!.beginPath();
        ctx!.moveTo(queue[x][2].x, queue[x][2].y);
        for (let y = 3; y < queue[x].length; y++) {
          const pt = queue[x][y] as Point;
          ctx!.lineTo(pt.x, pt.y);
        }
        ctx!.lineTo(queue[x][2].x, queue[x][2].y);
        ctx!.fill();
        ctx!.stroke();
      }
    }

    const faces = [[0, 1, 3, 2], [0, 4, 5, 1], [1, 5, 7, 3], [2, 3, 7, 6], [0, 2, 6, 4], [4, 6, 7, 5]];
    const faceColours = ["#9D61FD", "#BA90FE", "#CEB0FE", "#E0CCFE", "#EFE6FF", "#FFFFFF", "#F5EFFF"];

    class Cube {
      x: number; y: number; z: number;
      rotx: number; roty: number; rotz: number;
      faceMatrix: number[];
      points: Point[];
      constructor(xpos: number, ypos: number, zpos: number, rotx: number, roty: number, rotz: number) {
        this.x = xpos; this.y = ypos; this.z = zpos;
        this.rotx = rotx; this.roty = roty; this.rotz = rotz;
        this.faceMatrix = [0, 1, 2, 3, 4, 5];
        if (xpos < 1) this.faceMatrix[5] = 6;
        if (xpos >= 0) this.faceMatrix[0] = 6;
        if (ypos < 1) this.faceMatrix[3] = 6;
        if (ypos >= 0) this.faceMatrix[1] = 6;
        if (zpos < 1) this.faceMatrix[2] = 6;
        if (zpos >= 0) this.faceMatrix[4] = 6;
        this.points = [];
        for (let x = -0.5; x <= 0.5; x++)
          for (let y = -0.5; y <= 0.5; y++)
            for (let z = -0.5; z <= 0.5; z++) this.points.push(new Point(x, y, z));
      }
      queue() {
        for (let x = 0; x < 6; x++) {
          const quad: Point[] = [];
          for (let y = 0; y < 4; y++) {
            let point = this.points[faces[x][y]];
            point = point
              .translate(this.x, this.y, this.z)
              .rotateX(this.rotx).rotateY(this.roty).rotateZ(this.rotz)
              .rotateX(worldTransform.xrot).rotateY(worldTransform.yrot).rotateZ(worldTransform.zrot)
              .translate(worldTransform.x, worldTransform.y, worldTransform.z);
            quad.push(point);
          }
          queueQuad(quad[0], quad[1], quad[2], quad[3], faceColours[this.faceMatrix[x]]);
        }
      }
      rotateColours(xrot: number, yrot: number, zrot: number) {
        for (let x = 0; x < xrot; x++)
          this.faceMatrix = [this.faceMatrix[0], this.faceMatrix[2], this.faceMatrix[3], this.faceMatrix[4], this.faceMatrix[1], this.faceMatrix[5]];
        for (let x = 0; x < yrot; x++)
          this.faceMatrix = [this.faceMatrix[2], this.faceMatrix[1], this.faceMatrix[5], this.faceMatrix[3], this.faceMatrix[0], this.faceMatrix[4]];
        for (let x = 0; x < zrot; x++)
          this.faceMatrix = [this.faceMatrix[3], this.faceMatrix[0], this.faceMatrix[2], this.faceMatrix[5], this.faceMatrix[4], this.faceMatrix[1]];
      }
    }

    const slices = [
      [2, 1, 0, 5, 4, 3, 8, 7, 6],
      [11, 10, 9, 14, 13, 12, 17, 16, 15],
      [20, 19, 18, 23, 22, 21, 26, 25, 24],
      [2, 1, 0, 11, 10, 9, 20, 19, 18],
      [5, 4, 3, 14, 13, 12, 23, 22, 21],
      [8, 7, 6, 17, 16, 15, 26, 25, 24],
      [6, 3, 0, 15, 12, 9, 24, 21, 18],
      [7, 4, 1, 16, 13, 10, 25, 22, 19],
      [8, 5, 2, 17, 14, 11, 26, 23, 20],
    ];

    class Rubiks {
      cubies: Cube[];
      moves: { slice: number; amount: number }[];
      moveIndex: number;
      animationTimer: number;
      pauseTimer: number;
      moveTimer: number;
      phase: number;
      resting: boolean;
      slice = 0;
      rotationAmount = 0;
      constructor() {
        this.cubies = [];
        for (let x = -1; x <= 1; x++)
          for (let y = -1; y <= 1; y++)
            for (let z = -1; z <= 1; z++) this.cubies.push(new Cube(x, y, z, 0, 0, 0));
        this.moves = [];
        this.moveIndex = 0;
        this.animationTimer = -1;
        this.pauseTimer = 0;
        this.moveTimer = 0;
        this.phase = 0;
        this.resting = false;
        this.buildScramble();
      }
      buildScramble() {
        this.moves = [];
        let lastSlice = -1;
        for (let i = 0; i < scrambleLength; i++) {
          let s;
          do {
            s = Math.floor(Math.random() * 9);
          } while (s === lastSlice);
          lastSlice = s;
          let amount = Math.floor(Math.random() * 2) + 1;
          if (Math.random() * 2 > 1) amount *= -1;
          this.moves.push({ slice: s, amount });
        }
        this.moveIndex = 0;
      }
      buildSolve() {
        const solve = [];
        for (let i = this.moves.length - 1; i >= 0; i--)
          solve.push({ slice: this.moves[i].slice, amount: -this.moves[i].amount });
        this.moves = solve;
        this.moveIndex = 0;
      }
      queue() {
        this.resting = this.pauseTimer > 0;
        if (this.pauseTimer > 0) {
          this.pauseTimer--;
          if (this.pauseTimer === 0) {
            if (this.phase === 1) {
              this.phase = 2;
              this.buildSolve();
              this.animationTimer = -1;
            } else if (this.phase === 3) {
              this.phase = 0;
              this.buildScramble();
              this.animationTimer = -1;
            }
          }
        } else if (this.moveTimer > 0) {
          this.moveTimer--;
          if (this.moveTimer === 0) this.startAnimation();
        } else if (this.animationTimer > 0) {
          this.updateAnimation();
        } else if (this.animationTimer === 0) {
          this.endAnimation();
          this.fixColours();
          this.moveIndex++;
          if (this.moveIndex >= this.moves.length) {
            if (this.phase === 0) {
              this.phase = 1;
              this.pauseTimer = pauseDuration;
            } else if (this.phase === 2) {
              this.phase = 3;
              this.pauseTimer = pauseDuration;
            }
            this.animationTimer = -1;
          } else {
            this.animationTimer = -1;
            this.moveTimer = movePause;
          }
        } else if (this.animationTimer === -1 && this.pauseTimer === 0 && this.moveTimer === 0) {
          this.startAnimation();
        }
        for (let x = 0; x < this.cubies.length; x++) this.cubies[x].queue();
      }
      startAnimation() {
        const move = this.moves[this.moveIndex];
        this.slice = move.slice;
        this.rotationAmount = move.amount;
        this.animationTimer = animationDuration;
      }
      updateAnimation() {
        this.animationTimer--;
        const currentRotation = easeInOutQuint(
          animationDuration - this.animationTimer,
          0,
          (this.rotationAmount * Math.PI) / 2,
          animationDuration
        );
        for (let x = 0; x < 9; x++) {
          if (this.slice < 3) this.cubies[slices[this.slice][x]].rotx = currentRotation;
          else if (this.slice < 6) this.cubies[slices[this.slice][x]].roty = currentRotation;
          else this.cubies[slices[this.slice][x]].rotz = currentRotation;
        }
      }
      endAnimation() {
        const value = ((this.rotationAmount % 4) + 4) % 4;
        for (let x = 0; x < 9; x++) {
          if (this.slice < 3) this.cubies[slices[this.slice][x]].rotateColours(value, 0, 0);
          else if (this.slice < 6) this.cubies[slices[this.slice][x]].rotateColours(0, value, 0);
          else this.cubies[slices[this.slice][x]].rotateColours(0, 0, value);
          this.cubies[slices[this.slice][x]].rotx = 0;
          this.cubies[slices[this.slice][x]].roty = 0;
          this.cubies[slices[this.slice][x]].rotz = 0;
        }
      }
      fixColours() {
        const value = ((this.rotationAmount % 4) + 4) % 4;
        for (let x = 0; x < value; x++) {
          let temp = this.cubies[slices[this.slice][0]].faceMatrix.slice();
          this.cubies[slices[this.slice][0]].faceMatrix = this.cubies[slices[this.slice][6]].faceMatrix.slice();
          this.cubies[slices[this.slice][6]].faceMatrix = this.cubies[slices[this.slice][8]].faceMatrix.slice();
          this.cubies[slices[this.slice][8]].faceMatrix = this.cubies[slices[this.slice][2]].faceMatrix.slice();
          this.cubies[slices[this.slice][2]].faceMatrix = temp.slice();
          temp = this.cubies[slices[this.slice][1]].faceMatrix.slice();
          this.cubies[slices[this.slice][1]].faceMatrix = this.cubies[slices[this.slice][3]].faceMatrix.slice();
          this.cubies[slices[this.slice][3]].faceMatrix = this.cubies[slices[this.slice][7]].faceMatrix.slice();
          this.cubies[slices[this.slice][7]].faceMatrix = this.cubies[slices[this.slice][5]].faceMatrix.slice();
          this.cubies[slices[this.slice][5]].faceMatrix = temp.slice();
        }
      }
    }

    const main = new Rubiks();
    let raf = 0;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const target = main.resting || prefersReduced ? 0 : 1;
      spinFactor += (target - spinFactor) * spinEase;
      worldTransform.x += worldVelocity.x;
      worldTransform.y += worldVelocity.y;
      worldTransform.z += worldVelocity.z;
      worldTransform.xrot += (worldVelocity.xrot + baseSpinX) * spinFactor;
      worldTransform.yrot += (worldVelocity.yrot + baseSpinY) * spinFactor;
      worldTransform.zrot += worldVelocity.zrot;
      worldVelocity.xrot /= 1.03;
      worldVelocity.yrot /= 1.06;
      clearDrawQueue();
      main.queue();
      drawQueue();
      raf = requestAnimationFrame(draw);
    }

    resize();
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => resize());
      ro.observe(wrap);
    } else {
      window.addEventListener("resize", resize);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="mx-auto w-full max-w-[720px] aspect-square"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
