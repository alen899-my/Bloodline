import React, { useRef, useEffect, useState } from "react";

export default function InfiniteCanvas({
  gridSize = 32,
  majorGridEvery = 4,
  background = "#000000ff",
  className = ""
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const r = useRef({
    isPointerDown: false,
    lastPointer: null,
    scale: 1,
    offset: { x: 0, y: 0 },
    
  });

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Create grid pattern
  useEffect(() => {
    const offscreen = document.createElement("canvas");
    offscreen.width = offscreen.height = 2000;
    const ctx = offscreen.getContext("2d");

    // Minor grid
    ctx.strokeStyle = "rgba(224, 9, 9, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 2000; x += gridSize)
      ctx.moveTo(x, 0), ctx.lineTo(x, 2000);
    for (let y = 0; y < 2000; y += gridSize)
      ctx.moveTo(0, y), ctx.lineTo(2000, y);
    ctx.stroke();

    // Major grid
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1.5;
    const majorStep = gridSize * majorGridEvery;
    for (let x = 0; x < 2000; x += majorStep)
      ctx.moveTo(x, 0), ctx.lineTo(x, 2000);
    for (let y = 0; y < 2000; y += majorStep)
      ctx.moveTo(0, y), ctx.lineTo(2000, y);
    ctx.stroke();

    gridCanvasRef.current = offscreen;
  }, [gridSize, majorGridEvery]);

  // Canvas setup - FIXED RESIZE LOGIC
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Ensure we get the full viewport height
      canvas.width = Math.max(rect.width * dpr, window.innerWidth * dpr);
      canvas.height = Math.max(rect.height * dpr, window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      
      draw();
    };
    
    // Initial resize with timeout to ensure DOM is ready
    setTimeout(resizeCanvas, 0);
    
    window.addEventListener("resize", resizeCanvas);
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  // ... rest of your functions remain the same ...

  function screenToWorld(px, py) {
    const { scale, offset } = r.current;
    const dpr = window.devicePixelRatio;
    return {
      x: (px * dpr - offset.x) / scale,
      y: (py * dpr - offset.y) / scale,
    };
  }

  function onPointerDown(e) {
    r.current.isPointerDown = true;
    r.current.lastPointer = { x: e.clientX, y: e.clientY };
    e.target.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!r.current.isPointerDown) return;
    const dx = e.clientX - r.current.lastPointer.x;
    const dy = e.clientY - r.current.lastPointer.y;
    r.current.offset.x += dx * window.devicePixelRatio;
    r.current.offset.y += dy * window.devicePixelRatio;
    r.current.lastPointer = { x: e.clientX, y: e.clientY };
    draw();
  }

  function onPointerUp() {
    r.current.isPointerDown = false;
    r.current.lastPointer = null;
  }

  function onWheel(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const zoomIntensity = 0.0015;
    const delta = -e.deltaY;
    let newScale = r.current.scale * (1 + delta * zoomIntensity);
    newScale = Math.max(0.05, Math.min(newScale, 8));

    const worldBefore = screenToWorld(cx, cy);
    r.current.scale = newScale;
    r.current.offset.x =
      worldBefore.x * newScale - cx * window.devicePixelRatio;
    r.current.offset.y =
      worldBefore.y * newScale - cy * window.devicePixelRatio;
    draw();
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { scale, offset, nodes } = r.current;

    // Clear without filling white
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.setTransform(scale, 0, 0, scale, offset.x, offset.y);
    const pattern = ctx.createPattern(gridCanvasRef.current, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(
      -offset.x / scale,
      -offset.y / scale,
      canvas.width / scale,
      canvas.height / scale
    );

    // Nodes
    nodes.forEach((n) => {
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, n.x, n.y, n.w, n.h, 8);
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fill();
      ctx.lineWidth = 1 / scale;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.stroke();
      ctx.scale(1 / scale, 1 / scale);
      ctx.fillStyle = "#000000ff";
      ctx.font = "16px Inter, system-ui";
      ctx.fillText(n.label, (n.x + 12) * scale, (n.y + 32) * scale);
      ctx.restore();
    });

    setScale(scale);
    setOffset({ x: offset.x, y: offset.y });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-screen relative select-none ${className}`} // KEEP h-screen here
      style={{ background: "#000000ff" }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
        style={{
          cursor: r.current.isPointerDown ? "grabbing" : "grab",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}