/**
 * Generate 8-second excursion videos from 4 images each.
 * Each image gets a different Ken Burns effect (zoom-in, zoom-out, pan-left, pan-right).
 * Images crossfade into each other for a smooth slideshow feel.
 *
 * Uses FFmpeg with xfade filter for transitions.
 */
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'public', 'images', 'mallorca');
const outDir = path.join(__dirname, '..', 'public', 'videos', 'excursiones');

// Each excursion: main image + 3 extras
const excursions = [
  { id: 'mall_playa',       images: ['playa-palma.jpg', 'playa-palma-2.jpg', 'playa-palma-3.jpg', 'playa-palma-4.jpg'] },
  { id: 'mall_catedral',    images: ['catedral-seu.jpg', 'catedral-seu-2.jpg', 'catedral-seu-3.jpg', 'catedral-seu-4.jpg'] },
  { id: 'mall_bellver',     images: ['castillo-bellver.jpg', 'castillo-bellver-2.jpg', 'castillo-bellver-3.jpg', 'castillo-bellver-4.jpg'] },
  { id: 'mall_soller',      images: ['tren-soller.jpg', 'tren-soller-2.jpg', 'tren-soller-3.jpg', 'tren-soller-4.jpg'] },
  { id: 'mall_serra',       images: ['serra-tramuntana.jpg', 'serra-tramuntana-2.jpg', 'serra-tramuntana-3.jpg', 'serra-tramuntana-4.jpg'] },
  { id: 'mall_drach',       images: ['cuevas-drach.jpg', 'cuevas-drach-2.jpg', 'cuevas-drach-3.jpg', 'cuevas-drach-4.jpg'] },
  { id: 'mall_valldemossa', images: ['valldemossa.jpg', 'valldemossa-2.jpg', 'valldemossa-3.jpg', 'valldemossa-4.jpg'] },
  { id: 'mall_trenc',       images: ['es-trenc.jpg', 'es-trenc-2.jpg', 'es-trenc-3.jpg', 'es-trenc-4.jpg'] },
  { id: 'mall_portals',     images: ['puerto-portals.jpg', 'puerto-portals-2.jpg', 'puerto-portals-3.jpg', 'puerto-portals-4.jpg'] },
];

// Duration per image clip (seconds) and crossfade duration
const CLIP_DURATION = 3;
const FADE_DURATION = 0.8;
const FPS = 30;

// Different Ken Burns zoompan expressions for variety
// Each zooms/pans differently over the CLIP_DURATION
const kenBurnsEffects = [
  // Slow zoom in (center)
  `zoompan=z='min(zoom+0.0015,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${CLIP_DURATION * FPS}:s=1280x720:fps=${FPS}`,
  // Slow zoom out
  `zoompan=z='if(eq(on,1),1.3,max(zoom-0.0015,1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${CLIP_DURATION * FPS}:s=1280x720:fps=${FPS}`,
  // Pan left to right
  `zoompan=z='1.15':x='if(eq(on,1),0,min(x+2,iw-iw/zoom))':y='ih/2-(ih/zoom/2)':d=${CLIP_DURATION * FPS}:s=1280x720:fps=${FPS}`,
  // Pan right to left + slight zoom
  `zoompan=z='min(zoom+0.001,1.2)':x='if(eq(on,1),iw/zoom,max(x-2,0))':y='ih/2-(ih/zoom/2)':d=${CLIP_DURATION * FPS}:s=1280x720:fps=${FPS}`,
];

function generateVideo(excursion) {
  const outFile = path.join(outDir, `${excursion.id}.mp4`);
  const tmpDir = path.join(__dirname, 'tmp_clips');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  console.log(`\n  Generating ${excursion.id}...`);

  // Step 1: Create individual clips with Ken Burns effects
  const clipFiles = [];
  for (let i = 0; i < excursion.images.length; i++) {
    const imgPath = path.join(imgDir, excursion.images[i]).replace(/\\/g, '/');
    const clipPath = path.join(tmpDir, `${excursion.id}_clip${i}.mp4`).replace(/\\/g, '/');

    if (!fs.existsSync(imgPath.replace(/\//g, '\\'))) {
      console.log(`    WARNING: ${excursion.images[i]} not found, skipping`);
      continue;
    }

    const effect = kenBurnsEffects[i % kenBurnsEffects.length];
    const cmd = `ffmpeg -y -loop 1 -i "${imgPath}" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,${effect},format=yuv420p" -t ${CLIP_DURATION} -c:v libx264 -preset fast -pix_fmt yuv420p "${clipPath}" -loglevel error`;

    try {
      execSync(cmd, { stdio: 'pipe' });
      clipFiles.push(clipPath);
      console.log(`    Clip ${i + 1}/4 OK`);
    } catch (err) {
      console.log(`    Clip ${i + 1}/4 FAIL: ${err.message.substring(0, 100)}`);
    }
  }

  if (clipFiles.length < 2) {
    console.log(`    Not enough clips, skipping ${excursion.id}`);
    return;
  }

  // Step 2: Concatenate clips with xfade crossfade transitions
  // Build complex filter with xfade between consecutive clips
  const inputs = clipFiles.map(f => `-i "${f}"`).join(' ');
  let filterComplex = '';
  let lastOutput = '[0:v]';

  for (let i = 1; i < clipFiles.length; i++) {
    const offset = (CLIP_DURATION * i) - (FADE_DURATION * i);
    const outLabel = i < clipFiles.length - 1 ? `[v${i}]` : '[outv]';
    filterComplex += `${lastOutput}[${i}:v]xfade=transition=fade:duration=${FADE_DURATION}:offset=${offset.toFixed(2)}${outLabel};`;
    lastOutput = outLabel;
  }

  // Remove trailing semicolon
  filterComplex = filterComplex.replace(/;$/, '');

  const outPath = outFile.replace(/\\/g, '/');
  const concatCmd = `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[outv]" -c:v libx264 -preset fast -pix_fmt yuv420p -movflags +faststart "${outPath}" -loglevel error`;

  try {
    execSync(concatCmd, { stdio: 'pipe' });
    const size = (fs.statSync(outFile).size / 1024).toFixed(0);
    console.log(`    DONE ${excursion.id}.mp4 (${size}KB)`);
  } catch (err) {
    console.log(`    CONCAT FAIL: ${err.stderr?.toString().substring(0, 200) || err.message.substring(0, 200)}`);
  }

  // Cleanup temp clips
  for (const f of clipFiles) {
    try { fs.unlinkSync(f.replace(/\//g, '\\')); } catch {}
  }
}

// Check FFmpeg
try {
  execSync('ffmpeg -version', { stdio: 'pipe' });
} catch {
  console.error('FFmpeg not found! Install it first.');
  process.exit(1);
}

console.log('Generating excursion videos with multi-image Ken Burns + crossfade...');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const exc of excursions) {
  generateVideo(exc);
}

// Cleanup tmp dir
const tmpDir = path.join(__dirname, 'tmp_clips');
try { fs.rmdirSync(tmpDir); } catch {}

console.log('\nAll videos generated!');
