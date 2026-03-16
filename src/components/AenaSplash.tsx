import { useRef, useEffect } from 'react';

// Pixel art letter definitions (each letter is a 7x9 grid)
const LETTERS: Record<string, number[][]> = {
  A: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
  ],
  E: [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  N: [
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
  ],
};

const WORD = ['A', 'E', 'N', 'A'];
const PIXEL = 5;
const LETTER_W = 7;
const LETTER_H = 9;
const GAP = 2; // gap between letters in pixels
const TOTAL_W = WORD.length * LETTER_W + (WORD.length - 1) * GAP;
const TOTAL_H = LETTER_H;

interface AenaSplashProps {
  onFinished: () => void;
}

export function AenaSplash({ onFinished }: AenaSplashProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = 480;
    const h = 270;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const startTime = Date.now();
    const duration = 5000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Calculate logo position (centered)
      const logoW = TOTAL_W * PIXEL;
      const logoH = TOTAL_H * PIXEL;
      const startX = (w - logoW) / 2;
      const startY = (h - logoH) / 2 - 20;

      // Animated shimmer offset
      const shimmerX = (elapsed * 0.08) % (logoW + 100) - 50;

      // Draw each letter
      let offsetX = 0;
      for (const letter of WORD) {
        const grid = LETTERS[letter];
        for (let row = 0; row < LETTER_H; row++) {
          for (let col = 0; col < LETTER_W; col++) {
            if (grid[row][col] === 0) continue;

            const px = startX + (offsetX + col) * PIXEL;
            const py = startY + row * PIXEL;

            // Metallic gradient effect (top to bottom)
            const rowRatio = row / (LETTER_H - 1);
            let r: number, g: number, b: number;

            if (rowRatio < 0.15) {
              // Top highlight - bright cyan
              r = 100; g = 240; b = 255;
            } else if (rowRatio < 0.35) {
              // Upper chrome
              r = 180; g = 210; b = 220;
            } else if (rowRatio < 0.45) {
              // Dark band
              r = 80; g = 40; b = 30;
            } else if (rowRatio < 0.55) {
              // Mid chrome
              r = 160; g = 170; b = 180;
            } else if (rowRatio < 0.7) {
              // Lower section
              r = 120; g = 130; b = 140;
            } else if (rowRatio < 0.85) {
              // Dark lower band
              r = 60; g = 30; b = 20;
            } else {
              // Bottom highlight
              r = 200; g = 180; b = 100;
            }

            // Shimmer effect
            const distFromShimmer = Math.abs(px - startX - shimmerX);
            if (distFromShimmer < 30) {
              const shimmerIntensity = 1 - distFromShimmer / 30;
              r = Math.min(255, r + shimmerIntensity * 80);
              g = Math.min(255, g + shimmerIntensity * 80);
              b = Math.min(255, b + shimmerIntensity * 80);
            }

            // Fade in during first 1s
            const alpha = t < 0.2 ? t / 0.2 : 1;

            ctx.fillStyle = `rgba(${r|0}, ${g|0}, ${b|0}, ${alpha})`;
            ctx.fillRect(px, py, PIXEL, PIXEL);

            // Pixel border (bottom and right shadow)
            ctx.fillStyle = `rgba(20, 10, 5, ${alpha * 0.6})`;
            ctx.fillRect(px + PIXEL - 1, py + 1, 1, PIXEL);
            ctx.fillRect(px + 1, py + PIXEL - 1, PIXEL, 1);
          }
        }
        offsetX += LETTER_W + GAP;
      }

      // Subtitle "AEROPUERTOS para ti" below logo - pixel style
      const subY = startY + logoH + 18;

      // Draw a yellow bar behind subtitle
      const barW = 240;
      const barH = 16;
      const barX = (w - barW) / 2;
      const fadeIn = t < 0.3 ? 0 : Math.min(1, (t - 0.3) / 0.2);

      if (fadeIn > 0) {
        // Yellow/gold bar
        ctx.fillStyle = `rgba(255, 200, 0, ${fadeIn * 0.9})`;
        ctx.fillRect(barX, subY - 2, barW, barH);
        // Border
        ctx.fillStyle = `rgba(180, 140, 0, ${fadeIn})`;
        ctx.fillRect(barX, subY - 2, barW, 2);
        ctx.fillRect(barX, subY + barH - 4, barW, 2);

        // Draw green arrow pixel art logo (11x11 grid, 1px per cell)
        const arrowGrid = [
          0,0,0,0,0,1,0,0,0,0,0,
          0,0,0,0,1,1,0,0,0,0,0,
          0,0,0,1,1,1,0,0,0,0,0,
          0,0,1,1,1,1,0,0,0,0,0,
          0,1,1,1,1,1,1,0,0,0,0,
          1,1,1,1,1,1,1,1,1,1,1,
          0,1,1,1,1,1,1,0,0,0,0,
          0,0,1,1,1,1,0,0,0,0,0,
          0,0,0,1,1,1,0,0,0,0,0,
          0,0,0,0,1,1,0,0,0,0,0,
          0,0,0,0,0,1,0,0,0,0,0,
        ];
        const arrowPx = 1.2;
        const arrowTotalH = 11 * arrowPx;
        const arrowX = barX + 5;
        const arrowY = subY + (barH - arrowTotalH) / 2 - 1;
        for (let ay = 0; ay < 11; ay++) {
          for (let ax = 0; ax < 11; ax++) {
            if (arrowGrid[ay * 11 + ax]) {
              ctx.fillStyle = `rgba(100, 160, 20, ${fadeIn})`;
              ctx.fillRect(arrowX + ax * arrowPx, arrowY + ay * arrowPx, arrowPx, arrowPx);
            }
          }
        }

        // "AEROPUERTOS  para ti ✈" text
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeIn})`;
        ctx.font = `${10}px "Press Start 2P", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('aeropuertos para ti', w / 2 + 6, subY + 1);
      }

      // Second subtitle line - appears after AEROPUERTOS
      const line2Y = subY + barH + 14;
      const fadeIn2 = t < 0.45 ? 0 : Math.min(1, (t - 0.45) / 0.2);

      if (fadeIn2 > 0) {
        ctx.font = `7px "Press Start 2P", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // "y el último avión que ha aterrizado"
        ctx.fillStyle = `rgba(200, 200, 200, ${fadeIn2})`;
        ctx.fillText('y el ultimo avion que ha aterrizado', w / 2, line2Y);

        // "La aventura gráfica" - gold, bigger
        const line3Y = line2Y + 16;
        const fadeIn3 = t < 0.55 ? 0 : Math.min(1, (t - 0.55) / 0.2);

        if (fadeIn3 > 0) {
          ctx.font = `9px "Press Start 2P", monospace`;
          ctx.fillStyle = `rgba(255, 215, 0, ${fadeIn3})`;
          ctx.fillText('La aventura grafica', w / 2, line3Y);

          // Underline
          const ulW = 160;
          ctx.fillStyle = `rgba(255, 215, 0, ${fadeIn3 * 0.5})`;
          ctx.fillRect((w - ulW) / 2, line3Y + 14, ulW, 2);
        }
      }

      // Fade out in last 0.8s
      if (t > 0.84) {
        const fadeOut = (t - 0.84) / 0.16;
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeOut})`;
        ctx.fillRect(0, 0, w, h);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        onFinished();
      }
    }, 33);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        imageRendering: 'pixelated',
      }}
    />
  );
}
