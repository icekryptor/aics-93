"use client";

import { useEffect, useRef } from "react";

// Animated force-directed graph of business frameworks ("business puzzle solving") —
// ported 1:1 from the author's canvas script into a React effect.
export default function GraphCanvas({ className = "" }: { className?: string }) {
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
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = wrap!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      if (height < 80) height = Math.min(width, 480);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const nodeColour = "#AC79FD";
    const nodeFills = ["#BF98FE", "#CEB0FE", "#DDC8FE", "#EBDFFF"];
    const edgeColour = "#DAC3FE";
    const labelColour = "#7649BE";
    const frameColour = "#1A1A1A";
    const captionBgColour = "#1A1A1A";
    const captionColour = "#FFFEFB";
    const captionText = "business puzzle solving";
    const cornerCut = 14;
    const labelPool = [
      "стратегия", "PMF", "CustDev", "JTBD", "STP", "PDCA", "OKR", "MBO", "KPI",
      "MVP", "Concept", "4P", "BMI", "PRISM", "PESTEL", "BCG", "RACE", "NPS",
      "SAT", "CAC", "CPS", "ARPU", "SWOT", "AARRR", "Lean", "OST", "TAM", "LTV",
    ];
    const maxNodes = 22;
    const eventInterval = 46;
    const repulsion = 6500;
    const springLen = 105;
    const springK = 0.006;
    const damping = 0.78;
    const centerPull = 0.011;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; life: number; label: string; fill: string };
    let nodes: Node[] = [];
    let edges: { a: number; b: number }[] = [];
    let eventTimer = 20;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function addNode() {
      if (nodes.length >= maxNodes) return;
      let x = 0, y = 0;
      if (nodes.length > 0) {
        const p = nodes[Math.floor(Math.random() * nodes.length)];
        x = p.x + rand(-30, 30);
        y = p.y + rand(-30, 30);
      } else {
        x = rand(-40, 40);
        y = rand(-40, 40);
      }
      const used: Record<string, boolean> = {};
      for (let k = 0; k < nodes.length; k++) used[nodes[k].label] = true;
      const available: string[] = [];
      for (let k = 0; k < labelPool.length; k++) if (!used[labelPool[k]]) available.push(labelPool[k]);
      // ordered growth: next label in the pool (starts with «стратегия»)
      const label = available.length ? available[0] : labelPool[0];
      nodes.push({ x, y, vx: 0, vy: 0, r: rand(7, 10), life: 0, label, fill: nodeFills[Math.floor(Math.random() * nodeFills.length)] });
      if (nodes.length > 1) {
        const bi = Math.floor(Math.random() * (nodes.length - 1));
        edges.push({ a: nodes.length - 1, b: bi });
      }
    }
    function addEdge() {
      if (nodes.length < 2) return;
      for (let tries = 0; tries < 30; tries++) {
        const a = Math.floor(Math.random() * nodes.length);
        const b = Math.floor(Math.random() * nodes.length);
        if (a === b) continue;
        const exists = edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
        if (!exists) {
          edges.push({ a, b });
          return;
        }
      }
    }
    // progressive build: grow nodes one-by-one (from «стратегия»), then a few
    // extra edges; never remove — afterwards only the layout keeps shifting
    function doEvent() {
      if (nodes.length < maxNodes) addNode();
      else if (edges.length < maxNodes + 5) addEdge();
    }

    addNode(); // seed: «стратегия»

    function step() {
      const n = nodes.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d2 = dx * dx + dy * dy + 0.01;
          let f = repulsion / d2;
          if (f > 25) f = 25;
          const d = Math.sqrt(d2);
          const fx = (f * dx) / d;
          const fy = (f * dy) / d;
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }
      for (let e = 0; e < edges.length; e++) {
        const a = nodes[edges[e].a], b = nodes[edges[e].b];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const stretch = d - springLen;
        const fx = (springK * stretch * dx) / d;
        const fy = (springK * stretch * dy) / d;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }
      for (let i = 0; i < n; i++) {
        nodes[i].vx -= nodes[i].x * centerPull;
        nodes[i].vy -= nodes[i].y * centerPull;
        nodes[i].vx *= damping;
        nodes[i].vy *= damping;
        nodes[i].vx += (Math.random() - 0.5) * 0.08;
        nodes[i].vy += (Math.random() - 0.5) * 0.08;
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
        nodes[i].life += 1;
      }
    }

    function drawFrame() {
      const pad = Math.max(12, Math.min(width, height) * 0.035);
      const lw = Math.max(1, Math.min(width, height) / 600);
      const cut = Math.min(cornerCut, Math.min(width, height) / 12);
      ctx!.save();
      ctx!.strokeStyle = frameColour;
      ctx!.lineWidth = lw;
      ctx!.setLineDash([6, 5]);
      const x0 = pad, y0 = pad;
      const x1 = width - pad, y1 = height - pad;
      ctx!.beginPath();
      ctx!.moveTo(x0 + cut, y0);
      ctx!.lineTo(x1 - cut, y0);
      ctx!.lineTo(x1, y0 + cut);
      ctx!.lineTo(x1, y1 - cut);
      ctx!.lineTo(x1 - cut, y1);
      ctx!.lineTo(x0 + cut, y1);
      ctx!.lineTo(x0, y1 - cut);
      ctx!.lineTo(x0, y0 + cut);
      ctx!.closePath();
      ctx!.stroke();
      ctx!.setLineDash([]);

      const capFontPx = Math.max(10, Math.min(width, height) / 50);
      ctx!.font = capFontPx.toFixed(0) + "px ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
      const tw = ctx!.measureText(captionText).width;
      const padX = capFontPx * 0.7;
      const padY = capFontPx * 0.35;
      const boxW = tw + padX * 2;
      const boxH = capFontPx + padY * 2;
      const boxX = x1 - boxW - 6;
      const boxY = y1 - boxH - 6;
      ctx!.fillStyle = captionBgColour;
      ctx!.fillRect(boxX, boxY, boxW, boxH);
      ctx!.fillStyle = captionColour;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText(captionText, boxX + boxW / 2, boxY + boxH / 2 + capFontPx * 0.05);
      ctx!.restore();
    }

    let raf = 0;
    function draw() {
      ctx!.clearRect(0, 0, width, height);
      drawFrame();
      eventTimer--;
      if (eventTimer <= 0) {
        doEvent();
        eventTimer = eventInterval;
      }
      step();
      let s = (Math.min(width, height) - 100) / 480;
      if (s < 0.3) s = 0.3;
      const cx = width / 2;
      const cy = height / 2;
      const lw = Math.max(1, Math.min(width, height) / 600);
      ctx!.lineCap = "round";
      ctx!.strokeStyle = edgeColour;
      ctx!.lineWidth = lw;
      for (let e = 0; e < edges.length; e++) {
        const a = nodes[edges[e].a], b = nodes[edges[e].b];
        ctx!.beginPath();
        ctx!.moveTo(cx + a.x * s, cy + a.y * s);
        ctx!.lineTo(cx + b.x * s, cy + b.y * s);
        ctx!.stroke();
      }
      const nodeLW = Math.max(1, Math.min(width, height) / 500);
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const t = Math.min(1, node.life / 90);
        const grow = 1 - (1 - t) * (1 - t);
        const r = node.r * s * grow;
        ctx!.fillStyle = node.fill;
        ctx!.strokeStyle = nodeColour;
        ctx!.lineWidth = nodeLW;
        ctx!.beginPath();
        ctx!.arc(cx + node.x * s, cy + node.y * s, r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.stroke();
        if (grow > 0.15) {
          const fontPx = Math.max(8, r * 0.55);
          ctx!.font = "500 " + fontPx.toFixed(0) + "px ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
          ctx!.fillStyle = labelColour;
          ctx!.globalAlpha = grow;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "top";
          ctx!.fillText(node.label, cx + node.x * s, cy + node.y * s + r + fontPx * 0.4);
          ctx!.globalAlpha = 1;
        }
      }
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
    <div ref={wrapRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
