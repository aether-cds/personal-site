"use client";

import { useEffect, useRef } from "react";
import {
  drawShape,
  shapeHitRadius,
  SHAPE_KINDS,
  type ShapeKind,
} from "@/components/shapes";
import { playBowlNote, playGong } from "@/lib/singingBowl";

type PhysicsFieldProps = {
  soundOn: boolean;
  reducedMotion: boolean;
  shuffleSignal: number;
};

type Shape = {
  id: number;
  kind: ShapeKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  appear: number;
};

type Dot = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
};

type Point = { x: number; y: number };

type FieldState = {
  width: number;
  height: number;
  dpr: number;
  dots: Dot[];
  shapes: Shape[];
  selectedId: number | null;
  hoveredId: number | null;
  draggingId: number | null;
  dragOffsetX: number;
  dragOffsetY: number;
  pointer: Point | null;
  pointers: Map<number, Point>;
  pinchShapeId: number | null;
  pinchStartDistance: number;
  pinchStartSize: number;
  nextId: number;
  raf: number;
  lastFrame: number;
  running: boolean;
  bowStart: number | null;
  soundOn: boolean;
  reducedMotion: boolean;
  shuffle: (() => void) | null;
};

const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);
const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

function createState(): FieldState {
  return {
    width: 0,
    height: 0,
    dpr: 1,
    dots: [],
    shapes: [],
    selectedId: null,
    hoveredId: null,
    draggingId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    pointer: null,
    pointers: new Map(),
    pinchShapeId: null,
    pinchStartDistance: 0,
    pinchStartSize: 0,
    nextId: 1,
    raf: 0,
    lastFrame: 0,
    running: false,
    bowStart: null,
    soundOn: false,
    reducedMotion: false,
    shuffle: null,
  };
}

function orbRadius(state: FieldState): number {
  return Math.min(Math.min(state.width, state.height) * 0.23, 260);
}

function buildDots(state: FieldState) {
  const spacing = state.width < 640 ? 30 : 34;
  const cols = Math.max(1, Math.floor(state.width / spacing) + 1);
  const rows = Math.max(1, Math.floor(state.height / spacing) + 1);
  const offsetX = (state.width - (cols - 1) * spacing) / 2;
  const offsetY = (state.height - (rows - 1) * spacing) / 2;
  const dots: Dot[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      dots.push({
        x: offsetX + col * spacing,
        y: offsetY + row * spacing,
        dx: 0,
        dy: 0,
        vx: 0,
        vy: 0,
      });
    }
  }

  state.dots = dots;
}

function pickKind(excluded: ShapeKind[]): ShapeKind {
  const available = SHAPE_KINDS.filter((kind) => !excluded.includes(kind));
  const pool = available.length > 0 ? available : SHAPE_KINDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function spawnShapes(state: FieldState) {
  if (state.width === 0 || state.height === 0) return;

  const mobile = state.width < 640;
  const count = mobile ? 8 : 11;
  const margin = Math.min(mobile ? 44 : 90, state.width * 0.1);
  const radius = orbRadius(state);
  const shapes: Shape[] = [];
  const used: ShapeKind[] = [];
  const shuffledKinds = [...SHAPE_KINDS].sort(() => Math.random() - 0.5);

  for (let index = 0; index < count; index += 1) {
    const kind =
      index < shuffledKinds.length
        ? shuffledKinds[index]
        : pickKind(used);
    used.push(kind);

    const size = randomBetween(mobile ? 34 : 44, mobile ? 72 : 108);
    let x = state.width / 2;
    let y = state.height / 2;

    for (let attempt = 0; attempt < 50; attempt += 1) {
      x = randomBetween(margin, Math.max(margin + 1, state.width - margin));
      y = randomBetween(margin, Math.max(margin + 1, state.height - margin));
      const distance = Math.hypot(x - state.width / 2, y - state.height / 2);
      if (distance > radius + size * 0.85 + 24) break;
    }

    shapes.push({
      id: state.nextId,
      kind,
      x,
      y,
      vx: 0,
      vy: 0,
      size,
      rot: randomBetween(-0.14, 0.14),
      appear: 0,
    });
    state.nextId += 1;
  }

  state.shapes = shapes;
  state.selectedId = null;
}

function hitTest(state: FieldState, x: number, y: number): Shape | null {
  for (let index = state.shapes.length - 1; index >= 0; index -= 1) {
    const shape = state.shapes[index];
    const radius = shapeHitRadius(shape.kind, shape.size);
    if (Math.hypot(x - shape.x, y - shape.y) <= radius) return shape;
  }
  return null;
}

function findShape(state: FieldState, id: number | null): Shape | undefined {
  if (id === null) return undefined;
  return state.shapes.find((shape) => shape.id === id);
}

function playShapeNote(state: FieldState, shape: Shape | undefined) {
  if (!shape || !state.soundOn || state.reducedMotion) return;
  playBowlNote({
    size: shape.size,
    y: shape.y,
    viewportHeight: state.height,
  });
}

function syncTouchAction(state: FieldState, canvas: HTMLCanvasElement) {
  canvas.style.touchAction = state.selectedId === null ? "pan-y" : "none";
}

export default function PhysicsField({
  soundOn,
  reducedMotion,
  shuffleSignal,
}: PhysicsFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<FieldState>(createState());
  const lastShuffleRef = useRef(0);

  // Keep live props available to the animation loop without restarting it.
  useEffect(() => {
    stateRef.current.soundOn = soundOn;
  }, [soundOn]);

  useEffect(() => {
    stateRef.current.reducedMotion = reducedMotion;
    if (reducedMotion) {
      for (const dot of stateRef.current.dots) {
        dot.dx = 0;
        dot.dy = 0;
        dot.vx = 0;
        dot.vy = 0;
      }
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (shuffleSignal === lastShuffleRef.current) return;
    lastShuffleRef.current = shuffleSignal;
    if (shuffleSignal === 0) return;
    stateRef.current.shuffle?.();
  }, [shuffleSignal]);

  // Main canvas + physics lifecycle.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const state = stateRef.current;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;

    const loop = (now: number) => {
      if (!state.running || disposed) return;
      const delta = Math.min(Math.max(now - state.lastFrame, 0) / 16.667, 2.5);
      state.lastFrame = now;

      updateDots(state, delta);
      updateShapes(state, delta);
      draw(context, state, now);

      state.raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (state.running || disposed) return;
      state.running = true;
      state.lastFrame = performance.now();
      state.raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      state.running = false;
      window.cancelAnimationFrame(state.raf);
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      state.width = width;
      state.height = height;
      state.dpr = dpr;

      buildDots(state);

      if (state.shapes.length === 0) {
        spawnShapes(state);
      } else {
        const radius = orbRadius(state);
        for (const shape of state.shapes) {
          const hit = shapeHitRadius(shape.kind, shape.size);
          shape.x = clamp(shape.x, hit, width - hit);
          shape.y = clamp(shape.y, hit, height - hit);
          const distance = Math.hypot(
            shape.x - width / 2,
            shape.y - height / 2,
          );
          if (distance < radius + hit) {
            const angle = Math.atan2(
              shape.y - height / 2,
              shape.x - width / 2,
            );
            shape.x = width / 2 + Math.cos(angle) * (radius + hit + 10);
            shape.y = height / 2 + Math.sin(angle) * (radius + hit + 10);
          }
        }
      }

      syncTouchAction(state, canvas);
      draw(context, state, performance.now());
    };

    state.shuffle = () => {
      spawnShapes(state);
      for (const dot of state.dots) {
        dot.dx = 0;
        dot.dy = 0;
        dot.vx = 0;
        dot.vy = 0;
      }
      syncTouchAction(state, canvas);
      if (!state.reducedMotion) {
        // Give the new set a soft entry even if the loop was paused.
        start();
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const onWheel = (event: WheelEvent) => {
      const shape = findShape(state, state.selectedId);
      if (!shape) return;
      event.preventDefault();
      const factor = Math.exp(-event.deltaY * 0.0015);
      shape.size = clamp(shape.size * factor, 28, 240);
      playShapeNote(state, shape);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;

      const point = {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top,
      };

      state.pointer = point;
      state.pointers.set(event.pointerId, point);
      canvas.setPointerCapture(event.pointerId);
      canvas.focus({ preventScroll: true });

      if (state.pointers.size === 2) {
        state.draggingId = null;
        const first = state.pointers.values().next().value as Point | undefined;
        const second = [...state.pointers.values()][1];
        const candidate =
          findShape(state, state.selectedId) ??
          (state.pointers.size === 2 && first && second
            ? hitTest(
                state,
                (first.x + second.x) / 2,
                (first.y + second.y) / 2,
              )
            : null) ??
          state.shapes[0];

        if (candidate) {
          state.pinchShapeId = candidate.id;
          state.selectedId = candidate.id;
          state.pinchStartDistance = Math.max(
            1,
            Math.hypot((first?.x ?? 0) - (second?.x ?? 0), (first?.y ?? 0) - (second?.y ?? 0)),
          );
          state.pinchStartSize = candidate.size;
          syncTouchAction(state, canvas);
        }
        return;
      }

      if (state.pointers.size > 2) return;

      const shape = hitTest(state, point.x, point.y);
      if (!shape) {
        state.selectedId = null;
        state.draggingId = null;
        syncTouchAction(state, canvas);
        return;
      }

      state.selectedId = shape.id;
      state.hoveredId = shape.id;
      state.draggingId = shape.id;
      state.dragOffsetX = point.x - shape.x;
      state.dragOffsetY = point.y - shape.y;
      playShapeNote(state, shape);
      syncTouchAction(state, canvas);
    };

    const onPointerMove = (event: PointerEvent) => {
      const point = {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top,
      };

      state.pointer = point;
      if (state.pointers.has(event.pointerId)) {
        state.pointers.set(event.pointerId, point);
      }

      if (state.pointers.size >= 2 && state.pinchShapeId !== null) {
        const points = [...state.pointers.values()];
        if (points.length >= 2) {
          const distance = Math.hypot(
            points[0].x - points[1].x,
            points[0].y - points[1].y,
          );
          const shape = findShape(state, state.pinchShapeId);
          if (shape) {
            shape.size = clamp(
              state.pinchStartSize * (distance / state.pinchStartDistance),
              28,
              240,
            );
          }
        }
        return;
      }

      if (state.draggingId !== null) return;

      const hovered = hitTest(state, point.x, point.y);
      state.hoveredId = hovered?.id ?? null;
      if (event.pointerType === "mouse") {
        canvas.style.cursor = hovered ? "grab" : "default";
      }
    };

    const releasePointer = (event: PointerEvent) => {
      state.pointers.delete(event.pointerId);
      if (state.draggingId !== null) {
        playShapeNote(state, findShape(state, state.draggingId));
        state.draggingId = null;
      }
      if (state.pointers.size < 2) {
        state.pinchShapeId = null;
      }
      if (state.pointers.size === 0) {
        state.pointer = null;
      }
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      if (event.pointerType === "mouse" && state.pointers.size === 0) {
        canvas.style.cursor = "default";
      }
      syncTouchAction(state, canvas);
    };

    const onPointerLeave = () => {
      if (state.pointers.size > 0) return;
      state.pointer = null;
      state.hoveredId = null;
      canvas.style.cursor = "default";
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        state.shuffle?.();
        return;
      }

      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        return;
      }

      let shape = findShape(state, state.selectedId);
      if (!shape) {
        shape = state.shapes[0];
        if (shape) state.selectedId = shape.id;
      }
      if (!shape) return;

      event.preventDefault();
      const step = event.shiftKey ? 24 : 8;
      if (event.key === "ArrowUp") shape.y -= step;
      if (event.key === "ArrowDown") shape.y += step;
      if (event.key === "ArrowLeft") shape.x -= step;
      if (event.key === "ArrowRight") shape.x += step;
      shape.vx = 0;
      shape.vy = 0;
      const hit = shapeHitRadius(shape.kind, shape.size);
      shape.x = clamp(shape.x, hit, state.width - hit);
      shape.y = clamp(shape.y, hit, state.height - hit);
      playShapeNote(state, shape);
      syncTouchAction(state, canvas);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", releasePointer);
    canvas.addEventListener("pointercancel", releasePointer);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("visibilitychange", onVisibility);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(parent);
    } else {
      window.addEventListener("resize", resize);
    }

    resize();
    canvas.style.touchAction = "pan-y";
    start();

    return () => {
      disposed = true;
      stop();
      state.shuffle = null;
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", releasePointer);
      canvas.removeEventListener("pointercancel", releasePointer);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("wheel", onWheel);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Hidden-word easter egg: type "namaste" anywhere outside form fields.
  useEffect(() => {
    let buffer = "";
    let resetTimer: number | undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.querySelector('[data-modal-open="true"]')) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key.length !== 1) return;
      buffer = `${buffer}${event.key.toLowerCase()}`.slice(-24);

      if (buffer.includes("namaste")) {
        buffer = "";
        const state = stateRef.current;
        state.bowStart = performance.now();
        if (state.soundOn && !state.reducedMotion) playGong();
        window.dispatchEvent(new CustomEvent("hero:namaste"));
      }

      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        buffer = "";
      }, 2200);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (resetTimer) window.clearTimeout(resetTimer);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="physics-canvas absolute inset-0 h-full w-full"
        role="application"
        tabIndex={0}
        aria-label="Interactive Nepal clock playground. Drag the black shapes, select one and use arrow keys to nudge it, scroll to resize a selected shape, or press Escape to reshuffle. Type namaste for a surprise."
        aria-describedby="physics-instructions"
      />
      <p id="physics-instructions" className="sr-only">
        This is a decorative physics playground. All objects are also
        available as text through the rest of the page. Drag with a mouse or
        finger. Press Escape to reshuffle. Sound is off by default and can be
        enabled with the sound button.
      </p>
    </>
  );
}

function updateDots(state: FieldState, delta: number) {
  const pointer = state.pointer;
  const repelRadius = 118;
  const repelRadiusSquared = repelRadius * repelRadius;

  for (const dot of state.dots) {
    if (state.reducedMotion) {
      dot.dx = 0;
      dot.dy = 0;
      dot.vx = 0;
      dot.vy = 0;
      continue;
    }

    if (pointer) {
      const x = dot.x + dot.dx;
      const y = dot.y + dot.dy;
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < repelRadiusSquared && distanceSquared > 0.01) {
        const distance = Math.sqrt(distanceSquared);
        const force = (1 - distance / repelRadius) * 0.85 * delta;
        dot.vx += (dx / distance) * force;
        dot.vy += (dy / distance) * force;
      }
    }

    dot.dx += dot.vx * delta;
    dot.dy += dot.vy * delta;
    dot.vx *= 0.9;
    dot.vy *= 0.9;
    dot.vx -= dot.dx * 0.032 * delta;
    dot.vy -= dot.dy * 0.032 * delta;

    const displacement = Math.hypot(dot.dx, dot.dy);
    if (displacement > 52) {
      const scale = 52 / displacement;
      dot.dx *= scale;
      dot.dy *= scale;
    }
  }
}

function updateShapes(state: FieldState, delta: number) {
  const width = state.width;
  const height = state.height;

  for (const shape of state.shapes) {
    shape.appear = Math.min(1, shape.appear + 0.055 * delta);

    const hit = shapeHitRadius(shape.kind, shape.size);

    if (state.draggingId === shape.id && state.pointer) {
      const targetX = state.pointer.x - state.dragOffsetX;
      const targetY = state.pointer.y - state.dragOffsetY;

      if (state.reducedMotion) {
        shape.x = targetX;
        shape.y = targetY;
        shape.vx = 0;
        shape.vy = 0;
      } else {
        shape.vx = (targetX - shape.x) * 0.42;
        shape.vy = (targetY - shape.y) * 0.42;
        shape.x += shape.vx * delta;
        shape.y += shape.vy * delta;
      }
    } else if (!state.reducedMotion) {
      shape.x += shape.vx * delta;
      shape.y += shape.vy * delta;
      shape.vx *= 0.94;
      shape.vy *= 0.94;

      if (state.pointer) {
        const dx = shape.x - state.pointer.x;
        const dy = shape.y - state.pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0.01 && distance < 150) {
          const force = (1 - distance / 150) * 0.11 * delta;
          shape.vx += (dx / distance) * force;
          shape.vy += (dy / distance) * force;
        }
      }
    }

    if (shape.x < hit) {
      shape.x = hit;
      shape.vx = Math.abs(shape.vx) * 0.45;
    } else if (shape.x > width - hit) {
      shape.x = width - hit;
      shape.vx = -Math.abs(shape.vx) * 0.45;
    }

    if (shape.y < hit) {
      shape.y = hit;
      shape.vy = Math.abs(shape.vy) * 0.45;
    } else if (shape.y > height - hit) {
      shape.y = height - hit;
      shape.vy = -Math.abs(shape.vy) * 0.45;
    }
  }
}

function draw(
  context: CanvasRenderingContext2D,
  state: FieldState,
  now: number,
) {
  const { width, height, dpr, dots, shapes } = state;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  // Dot grid. One path, one fill — cheap even on phones.
  context.fillStyle = "rgba(10, 10, 10, 0.48)";
  context.beginPath();
  for (const dot of dots) {
    const x = dot.x + dot.dx;
    const y = dot.y + dot.dy;
    const radius = 1.15;
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, TAU);
  }
  context.fill();

  const bowT = state.bowStart === null ? 1 : (now - state.bowStart) / 1500;
  const bow = bowT < 1 ? Math.sin(Math.min(1, bowT) * Math.PI) : 0;
  const centerX = width / 2;
  const centerY = height / 2;

  for (const shape of shapes) {
    const hit = shapeHitRadius(shape.kind, shape.size);
    const appearScale = 0.62 + 0.38 * easeOutCubic(shape.appear);
    const scale = appearScale * (1 - bow * 0.56);
    const direction = shape.id % 2 === 0 ? 1 : -1;

    context.save();
    context.globalAlpha = shape.appear;
    context.translate(
      shape.x + (centerX - shape.x) * bow * 0.16,
      shape.y + (centerY - shape.y) * bow * 0.16,
    );
    context.scale(scale, scale);
    drawShape(
      context,
      shape.kind,
      shape.size,
      shape.rot + bow * 0.16 * direction,
    );
    context.restore();

    if (state.selectedId === shape.id) {
      context.save();
      context.translate(shape.x, shape.y);
      context.rotate(shape.rot);
      context.strokeStyle = "rgba(0, 56, 147, 0.9)";
      context.lineWidth = 1.5;
      context.setLineDash([5, 5]);
      context.beginPath();
      context.arc(0, 0, hit * 1.22, 0, TAU);
      context.stroke();
      context.restore();
    }
  }

  if (state.hoveredId !== null && state.hoveredId !== state.selectedId) {
    const shape = findShape(state, state.hoveredId);
    if (shape) {
      const hit = shapeHitRadius(shape.kind, shape.size);
      context.save();
      context.translate(shape.x, shape.y);
      context.strokeStyle = "rgba(10, 10, 10, 0.28)";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(0, 0, hit * 1.16, 0, TAU);
      context.stroke();
      context.restore();
    }
  }
}
