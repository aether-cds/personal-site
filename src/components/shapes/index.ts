import { SHAPE_KINDS, type ShapeKind } from "./types";

const INK = "#0A0A0A";
const CRIMSON = "#DC143C";
const BLUE = "#003893";
const BONE = "#F3EEE5";
const GREEN = "#007A33";
const YELLOW = "#F2B705";

/**
 * Official red-field geometry from the Constitution of Nepal, Schedule 1.
 * Coordinates run 0–60 horizontally and 0–80 vertically. The self-crossing
 * path is intentional: with the non-zero fill rule it resolves into the two
 * stacked pennants, exactly like the official construction.
 */
const NEPAL_FLAG_POINTS: [number, number][] = [
  [0, 37.5735931288],
  [60, 37.5735931288],
  [0, 0],
  [0, 80],
  [60, 80],
  [0, 20],
];

function pathNepalFlag(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  NEPAL_FLAG_POINTS.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

function drawPeak(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(-s * 0.5, s * 0.34);
  ctx.lineTo(-s * 0.36, s * 0.11);
  ctx.lineTo(-s * 0.27, s * 0.21);
  ctx.lineTo(-s * 0.08, -s * 0.11);
  ctx.lineTo(-s * 0.01, -s * 0.02);
  ctx.lineTo(s * 0.15, -s * 0.35);
  ctx.lineTo(s * 0.29, s * 0.02);
  ctx.lineTo(s * 0.4, s * 0.13);
  ctx.lineTo(s * 0.5, s * 0.34);
  ctx.closePath();
  ctx.fillStyle = INK;
  ctx.fill();

  // Thin crimson ridge lines keep the silhouette from feeling like a blob.
  ctx.strokeStyle = "rgba(220,20,60,0.85)";
  ctx.lineWidth = Math.max(1.2, s * 0.022);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(s * 0.15, -s * 0.35);
  ctx.lineTo(s * 0.1, -s * 0.06);
  ctx.lineTo(s * 0.17, s * 0.12);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-s * 0.08, -s * 0.11);
  ctx.lineTo(-s * 0.03, s * 0.08);
  ctx.lineTo(s * 0.02, s * 0.17);
  ctx.stroke();
}

function drawPagoda(ctx: CanvasRenderingContext2D, s: number) {
  // Base plinth
  ctx.fillStyle = INK;
  ctx.fillRect(-s * 0.34, s * 0.34, s * 0.68, s * 0.07);

  // Three tapering, gently curved roof tiers
  const tiers = [
    { y: s * 0.3, half: s * 0.46 },
    { y: s * 0.1, half: s * 0.36 },
    { y: -s * 0.1, half: s * 0.26 },
  ];

  for (const tier of tiers) {
    ctx.beginPath();
    ctx.moveTo(-tier.half, tier.y);
    ctx.quadraticCurveTo(
      -tier.half * 0.32,
      tier.y - s * 0.1,
      0,
      tier.y - s * 0.13,
    );
    ctx.quadraticCurveTo(
      tier.half * 0.32,
      tier.y - s * 0.1,
      tier.half,
      tier.y,
    );
    ctx.quadraticCurveTo(tier.half * 0.5, tier.y + s * 0.04, 0, tier.y + s * 0.05);
    ctx.quadraticCurveTo(-tier.half * 0.5, tier.y + s * 0.04, -tier.half, tier.y);
    ctx.closePath();
    ctx.fillStyle = INK;
    ctx.fill();
  }

  // Mast and finial
  ctx.fillRect(-s * 0.018, -s * 0.34, s * 0.036, s * 0.22);
  ctx.beginPath();
  ctx.arc(0, -s * 0.37, s * 0.045, 0, Math.PI * 2);
  ctx.fill();

  // A crimson doorway cut into the base
  ctx.fillStyle = CRIMSON;
  ctx.beginPath();
  ctx.moveTo(-s * 0.06, s * 0.41);
  ctx.lineTo(-s * 0.06, s * 0.33);
  ctx.quadraticCurveTo(0, s * 0.27, s * 0.06, s * 0.33);
  ctx.lineTo(s * 0.06, s * 0.41);
  ctx.closePath();
  ctx.fill();
}

function drawDhaka(ctx: CanvasRenderingContext2D, s: number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(-s * 0.5, -s * 0.5, s, s);
  ctx.clip();

  ctx.fillStyle = INK;
  ctx.fillRect(-s * 0.5, -s * 0.5, s, s);

  // Diagonal lattice, the backbone of a Dhaka topi motif.
  ctx.strokeStyle = CRIMSON;
  ctx.lineWidth = Math.max(1, s * 0.028);
  for (let offset = -s; offset <= s; offset += s * 0.25) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, offset - s * 0.5);
    ctx.lineTo(s * 0.5, offset + s * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-s * 0.5, offset + s * 0.5);
    ctx.lineTo(s * 0.5, offset - s * 0.5);
    ctx.stroke();
  }

  // Central diamond
  ctx.strokeStyle = BONE;
  ctx.lineWidth = Math.max(1, s * 0.022);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.22);
  ctx.lineTo(s * 0.22, 0);
  ctx.lineTo(0, s * 0.22);
  ctx.lineTo(-s * 0.22, 0);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = CRIMSON;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.055, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Border
  ctx.strokeStyle = INK;
  ctx.lineWidth = Math.max(1.5, s * 0.03);
  ctx.strokeRect(-s * 0.5, -s * 0.5, s, s);
}

function drawMandala(ctx: CanvasRenderingContext2D, s: number) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = Math.max(1, s * 0.018);

  for (const radius of [0.16, 0.26, 0.36, 0.46]) {
    ctx.beginPath();
    ctx.arc(0, 0, s * radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radial ticks
  for (let i = 0; i < 24; i += 1) {
    const angle = (i / 24) * Math.PI * 2;
    const inner = s * 0.38;
    const outer = s * 0.46;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }

  // Petals
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(s * 0.25, 0, s * 0.075, s * 0.035, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2);
  ctx.fill();
}

function drawPrayerFlags(ctx: CanvasRenderingContext2D, s: number) {
  const x0 = -s * 0.5;
  const x1 = s * 0.5;
  const y0 = -s * 0.16;
  const controlX = 0;
  const controlY = s * 0.28;

  const point = (t: number) => ({
    x: (1 - t) ** 2 * x0 + 2 * (1 - t) * t * controlX + t ** 2 * x1,
    y: (1 - t) ** 2 * y0 + 2 * (1 - t) * t * controlY + t ** 2 * y0,
  });
  const tangent = (t: number) => ({
    x: 2 * (1 - t) * (controlX - x0) + 2 * t * (x1 - controlX),
    y: 2 * (1 - t) * (controlY - y0) + 2 * t * (y0 - controlY),
  });

  ctx.strokeStyle = INK;
  ctx.lineWidth = Math.max(1, s * 0.014);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(controlX, controlY, x1, y0);
  ctx.stroke();

  const colors = [BLUE, BONE, CRIMSON, GREEN, YELLOW];
  const flagWidth = s * 0.13;
  const flagHeight = s * 0.12;

  colors.forEach((color, index) => {
    const t = 0.1 + index * 0.2;
    const p = point(t);
    const tan = tangent(t);
    const angle = Math.atan2(tan.y, tan.x);

    ctx.save();
    ctx.translate(p.x, p.y + flagHeight * 0.55);
    ctx.rotate(angle * 0.5);
    ctx.fillStyle = color;
    ctx.strokeStyle = INK;
    ctx.lineWidth = Math.max(0.9, s * 0.012);
    ctx.beginPath();
    ctx.rect(-flagWidth / 2, -flagHeight / 2, flagWidth, flagHeight);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function drawSunMoon(ctx: CanvasRenderingContext2D, s: number) {
  // Sun
  const sunX = -s * 0.2;
  const sunY = 0;
  const sunR = s * 0.15;
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = INK;
  ctx.lineWidth = Math.max(1, s * 0.025);
  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(
      sunX + Math.cos(angle) * sunR * 1.2,
      sunY + Math.sin(angle) * sunR * 1.2,
    );
    ctx.lineTo(
      sunX + Math.cos(angle) * sunR * 1.72,
      sunY + Math.sin(angle) * sunR * 1.72,
    );
    ctx.stroke();
  }

  // Crescent moon
  const moonX = s * 0.2;
  const moonY = 0;
  const moonR = s * 0.17;
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = CRIMSON;
  ctx.beginPath();
  ctx.arc(moonX + moonR * 0.48, moonY - moonR * 0.16, moonR * 0.88, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlag(ctx: CanvasRenderingContext2D, s: number) {
  const height = s * 1.05;
  const width = height * 0.75;

  ctx.save();
  ctx.translate(-width / 2, -height / 2);
  ctx.scale(width / 60, height / 80);

  pathNepalFlag(ctx);
  ctx.strokeStyle = BLUE;
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.fill();

  // Moon
  ctx.fillStyle = BONE;
  ctx.beginPath();
  ctx.arc(18, 14.5, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(20, 13.4, 3.7, 0, Math.PI * 2);
  ctx.fill();

  // Sun
  ctx.fillStyle = BONE;
  ctx.beginPath();
  ctx.arc(19, 57, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = BONE;
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(19 + Math.cos(angle) * 5.2, 57 + Math.sin(angle) * 5.2);
    ctx.lineTo(19 + Math.cos(angle) * 7.2, 57 + Math.sin(angle) * 7.2);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  kind: ShapeKind,
  size: number,
  rotation: number,
): void {
  ctx.save();
  ctx.rotate(rotation);

  switch (kind) {
    case "peak":
      drawPeak(ctx, size);
      break;
    case "pagoda":
      drawPagoda(ctx, size);
      break;
    case "dhaka":
      drawDhaka(ctx, size);
      break;
    case "flag":
      drawFlag(ctx, size);
      break;
    case "mandala":
      drawMandala(ctx, size);
      break;
    case "prayer":
      drawPrayerFlags(ctx, size);
      break;
    case "sunmoon":
      drawSunMoon(ctx, size);
      break;
  }

  ctx.restore();
}

export function shapeHitRadius(kind: ShapeKind, size: number): number {
  if (kind === "prayer") return size * 0.62;
  if (kind === "flag") return size * 0.58;
  return size * 0.55;
}

export { SHAPE_KINDS };
export type { ShapeKind };
