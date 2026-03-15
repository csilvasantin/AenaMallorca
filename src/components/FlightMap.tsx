import { useRef, useEffect } from 'react';

interface RoutePoint {
  x: number;
  y: number;
  label?: string;
}

interface FlightRoute {
  points: RoutePoint[];
  ocean: string;
}

const ROUTES: Record<string, FlightRoute> = {
  japan: {
    ocean: 'PACIFIC OCEAN',
    points: [
      { x: 0.88, y: 0.35, label: 'TOKYO' },
      { x: 0.82, y: 0.32 },
      { x: 0.72, y: 0.30 },
      { x: 0.60, y: 0.32 },
      { x: 0.50, y: 0.35 },
      { x: 0.40, y: 0.38 },
      { x: 0.32, y: 0.42, label: 'MADRID' },
    ],
  },
  dubai: {
    ocean: 'ARABIAN SEA',
    points: [
      { x: 0.62, y: 0.50, label: 'DUBAI' },
      { x: 0.55, y: 0.47 },
      { x: 0.48, y: 0.43 },
      { x: 0.40, y: 0.40 },
      { x: 0.32, y: 0.42, label: 'MADRID' },
    ],
  },
  london: {
    ocean: 'ENGLISH CHANNEL',
    points: [
      { x: 0.38, y: 0.25, label: 'LONDON' },
      { x: 0.37, y: 0.30 },
      { x: 0.35, y: 0.35 },
      { x: 0.32, y: 0.42, label: 'MADRID' },
    ],
  },
};

// Colors matching Indiana Jones: Fate of Atlantis map
const COL = {
  ocean: '#6666cc',
  oceanGrid: '#5858b8',
  land: '#996633',
  landDark: '#7a5528',
  landLight: '#aa7744',
  coast: '#44cccc',
  coastDark: '#339999',
  river: '#777777',
  border: '#666666',
};

// Detailed continent outlines (normalized 0-1 coordinates)
// Europe
const EUROPE_MAIN = [
  // Iberian Peninsula
  [0.28, 0.45], [0.27, 0.48], [0.28, 0.50], [0.30, 0.50],
  [0.32, 0.48], [0.33, 0.46], [0.34, 0.44],
  // France
  [0.35, 0.42], [0.33, 0.40], [0.34, 0.38], [0.35, 0.36],
  // Netherlands/Germany
  [0.36, 0.33], [0.37, 0.30], [0.38, 0.28],
  // Denmark/Scandinavia
  [0.38, 0.26], [0.39, 0.23], [0.40, 0.20], [0.42, 0.18],
  [0.44, 0.15], [0.46, 0.12], [0.48, 0.10],
  // Finland
  [0.50, 0.08], [0.52, 0.10], [0.54, 0.12],
  // Russia west
  [0.56, 0.14], [0.58, 0.16], [0.60, 0.18],
  [0.62, 0.20], [0.64, 0.22], [0.66, 0.24],
  // Russia south / Ukraine
  [0.64, 0.28], [0.60, 0.30], [0.56, 0.32],
  // Turkey / Black Sea
  [0.52, 0.34], [0.50, 0.36], [0.48, 0.38],
  // Greece / Italy
  [0.44, 0.40], [0.42, 0.42], [0.40, 0.44],
  [0.38, 0.46], [0.36, 0.48],
  // Back to Iberia
  [0.34, 0.48], [0.32, 0.48], [0.30, 0.50],
];

const BRITAIN = [
  [0.33, 0.24], [0.34, 0.22], [0.35, 0.20], [0.36, 0.18],
  [0.37, 0.20], [0.38, 0.22], [0.37, 0.24], [0.36, 0.26],
  [0.35, 0.28], [0.34, 0.27], [0.33, 0.26],
];

const IRELAND = [
  [0.30, 0.24], [0.31, 0.22], [0.32, 0.23], [0.32, 0.25],
  [0.31, 0.26], [0.30, 0.25],
];

const ICELAND = [
  [0.30, 0.12], [0.32, 0.11], [0.33, 0.12], [0.32, 0.14],
  [0.30, 0.14],
];

const ITALY = [
  [0.40, 0.38], [0.41, 0.40], [0.42, 0.42], [0.41, 0.44],
  [0.40, 0.46], [0.39, 0.48], [0.38, 0.46], [0.39, 0.44],
  [0.39, 0.42], [0.40, 0.40],
];

// Africa
const AFRICA = [
  [0.28, 0.52], [0.30, 0.50], [0.32, 0.50], [0.34, 0.50],
  [0.38, 0.50], [0.42, 0.48], [0.46, 0.48], [0.50, 0.50],
  [0.54, 0.48], [0.56, 0.50],
  // East coast
  [0.58, 0.52], [0.56, 0.56], [0.54, 0.60], [0.52, 0.64],
  [0.50, 0.68], [0.48, 0.72], [0.46, 0.76], [0.44, 0.80],
  [0.42, 0.84], [0.40, 0.86],
  // South
  [0.38, 0.88], [0.36, 0.86], [0.34, 0.84],
  // West coast
  [0.32, 0.80], [0.30, 0.76], [0.28, 0.72],
  [0.26, 0.68], [0.24, 0.64], [0.22, 0.60],
  [0.24, 0.56], [0.26, 0.54],
];

// Middle East
const MIDDLE_EAST = [
  [0.52, 0.36], [0.56, 0.34], [0.60, 0.36],
  [0.64, 0.38], [0.66, 0.40], [0.68, 0.42],
  [0.66, 0.46], [0.64, 0.50], [0.62, 0.52],
  [0.58, 0.54], [0.56, 0.52], [0.54, 0.50],
  [0.52, 0.48], [0.50, 0.44], [0.50, 0.40],
];

// Central/East Asia
const ASIA = [
  [0.66, 0.24], [0.70, 0.20], [0.74, 0.16],
  [0.78, 0.14], [0.82, 0.12], [0.86, 0.14],
  [0.90, 0.16], [0.92, 0.18], [0.94, 0.22],
  [0.94, 0.26], [0.92, 0.30], [0.90, 0.34],
  // China coast
  [0.88, 0.38], [0.86, 0.42], [0.84, 0.46],
  [0.82, 0.50], [0.80, 0.52],
  // Southeast Asia
  [0.78, 0.54], [0.76, 0.56], [0.74, 0.58],
  [0.72, 0.56], [0.70, 0.52], [0.68, 0.48],
  [0.66, 0.44], [0.64, 0.40], [0.66, 0.36],
  [0.66, 0.30], [0.66, 0.26],
];

// Japan islands
const JAPAN = [
  [0.90, 0.30], [0.91, 0.28], [0.92, 0.30], [0.92, 0.34],
  [0.91, 0.36], [0.90, 0.38], [0.89, 0.36], [0.89, 0.34],
  [0.90, 0.32],
];

// India
const INDIA = [
  [0.66, 0.44], [0.68, 0.46], [0.70, 0.50],
  [0.72, 0.54], [0.70, 0.58], [0.68, 0.62],
  [0.66, 0.64], [0.64, 0.62], [0.62, 0.58],
  [0.62, 0.54], [0.64, 0.50], [0.66, 0.46],
];

// Arabian Peninsula
const ARABIA = [
  [0.54, 0.44], [0.56, 0.46], [0.58, 0.48],
  [0.60, 0.52], [0.62, 0.54], [0.60, 0.56],
  [0.58, 0.54], [0.56, 0.52], [0.54, 0.50],
  [0.52, 0.48], [0.52, 0.46],
];

function drawLand(
  ctx: CanvasRenderingContext2D,
  pts: number[][],
  w: number,
  h: number,
  fill: string,
  coastColor: string,
  coastWidth: number
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(pts[0][0] * w, pts[0][1] * h);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0] * w, pts[i][1] * h);
  }
  ctx.closePath();
  ctx.fill();

  // Coast border
  ctx.strokeStyle = coastColor;
  ctx.lineWidth = coastWidth;
  ctx.stroke();

  // Inner shadow/dark border
  ctx.strokeStyle = COL.landDark;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawRivers(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = COL.river;
  ctx.lineWidth = 1;

  // Nile
  const nile = [[0.50, 0.48], [0.48, 0.52], [0.46, 0.56], [0.44, 0.60]];
  ctx.beginPath();
  ctx.moveTo(nile[0][0] * w, nile[0][1] * h);
  for (let i = 1; i < nile.length; i++) ctx.lineTo(nile[i][0] * w, nile[i][1] * h);
  ctx.stroke();

  // European rivers
  const rhine = [[0.37, 0.30], [0.38, 0.34], [0.36, 0.38]];
  ctx.beginPath();
  ctx.moveTo(rhine[0][0] * w, rhine[0][1] * h);
  for (let i = 1; i < rhine.length; i++) ctx.lineTo(rhine[i][0] * w, rhine[i][1] * h);
  ctx.stroke();
}

function getCountryFromNodeId(nodeId: string): string | null {
  if (nodeId.startsWith('japan')) return 'japan';
  if (nodeId.startsWith('dubai')) return 'dubai';
  if (nodeId.startsWith('london')) return 'london';
  return null;
}

interface FlightMapProps {
  currentNodeId: string;
}

export function FlightMap({ currentNodeId }: FlightMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const country = getCountryFromNodeId(currentNodeId);

  useEffect(() => {
    if (!country) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const route = ROUTES[country];
    if (!route) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const ctx = canvas.getContext('2d')!;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      // Ocean background
      ctx.fillStyle = COL.ocean;
      ctx.fillRect(0, 0, w, h);

      // Ocean grid lines (subtle latitude/longitude)
      ctx.strokeStyle = COL.oceanGrid;
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw all land masses with coast
      const cw = 3; // coast width
      drawLand(ctx, EUROPE_MAIN, w, h, COL.land, COL.coast, cw);
      drawLand(ctx, BRITAIN, w, h, COL.land, COL.coast, cw);
      drawLand(ctx, IRELAND, w, h, COL.land, COL.coast, cw);
      drawLand(ctx, ICELAND, w, h, COL.land, COL.coast, cw);
      drawLand(ctx, AFRICA, w, h, COL.landDark, COL.coast, cw);
      drawLand(ctx, MIDDLE_EAST, w, h, COL.landLight, COL.coast, cw);
      drawLand(ctx, ASIA, w, h, COL.land, COL.coast, cw);
      drawLand(ctx, JAPAN, w, h, COL.land, COL.coast, cw);
      drawLand(ctx, INDIA, w, h, COL.landLight, COL.coast, cw);
      drawLand(ctx, ARABIA, w, h, COL.landDark, COL.coast, cw);
      drawLand(ctx, ITALY, w, h, COL.land, COL.coast, 2);

      // Rivers
      drawRivers(ctx, w, h);

      // Animated route line
      const totalLength = route.points.length - 1;
      const animDuration = 2500;
      const progress = Math.min(1, elapsed / animDuration);
      const currentSegment = progress * totalLength;

      // Route line (pink/red like Indiana Jones)
      ctx.strokeStyle = '#ff8888';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 5]);
      ctx.lineDashOffset = -(elapsed * 0.05);

      ctx.beginPath();
      const firstPt = route.points[0];
      ctx.moveTo(firstPt.x * w, firstPt.y * h);

      for (let i = 1; i <= Math.floor(currentSegment); i++) {
        const pt = route.points[i];
        ctx.lineTo(pt.x * w, pt.y * h);
      }

      const segIdx = Math.floor(currentSegment);
      if (segIdx < totalLength) {
        const frac = currentSegment - segIdx;
        const from = route.points[segIdx];
        const to = route.points[segIdx + 1];
        const cx = from.x + (to.x - from.x) * frac;
        const cy = from.y + (to.y - from.y) * frac;
        ctx.lineTo(cx * w, cy * h);
      }

      ctx.stroke();
      ctx.setLineDash([]);

      // Airplane icon at current position
      if (progress < 1) {
        const segI = Math.min(Math.floor(currentSegment), totalLength - 1);
        const frac = currentSegment - Math.floor(currentSegment);
        const from = route.points[segI];
        const to = route.points[Math.min(segI + 1, totalLength)];
        const px = (from.x + (to.x - from.x) * frac) * w;
        const py = (from.y + (to.y - from.y) * frac) * h;

        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✈', px, py - 8);
      }

      // City dots and labels
      ctx.font = '10px "Press Start 2P", monospace';
      for (const pt of route.points) {
        if (pt.label) {
          // Red dot with black border
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(pt.x * w - 3, pt.y * h - 3, 6, 6);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(pt.x * w - 3, pt.y * h - 3, 6, 6);

          // Label with shadow
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';
          ctx.fillText(pt.label, pt.x * w + 1, pt.y * h - 9);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(pt.label, pt.x * w, pt.y * h - 10);
        }
      }

      // Ocean label
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(route.ocean, w * 0.50 + 1, h * 0.85 + 1);
      ctx.fillStyle = '#333355';
      ctx.fillText(route.ocean, w * 0.50, h * 0.85);

      // Keep animating as background — no auto-stop
    }, 33);

    return () => {
      clearInterval(interval);
      ro.disconnect();
    };
  }, [country]);

  if (!country) return null;

  return (
    <div className="flight-map-bg">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
