/**
 * Download 3 extra images per excursion from Unsplash for richer videos.
 * Each excursion will have 4 images total (1 existing + 3 new).
 */
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'public', 'images', 'mallorca');

// Unsplash photo IDs grouped by excursion (3 extra per excursion)
const extraImages = {
  'playa-palma': [
    { id: 'photo-1507525428034-b723cf961d3e', name: 'playa-palma-2.jpg' },  // tropical beach
    { id: 'photo-1519046904884-53103b34b206', name: 'playa-palma-3.jpg' },  // sandy beach
    { id: 'photo-1506953823976-52e1fdc0149a', name: 'playa-palma-4.jpg' },  // beach sunset
  ],
  'catedral-seu': [
    { id: 'photo-1566438480900-0609be27a4be', name: 'catedral-seu-2.jpg' },  // cathedral interior
    { id: 'photo-1548013146-72479768bada', name: 'catedral-seu-3.jpg' },     // gothic architecture
    { id: 'photo-1555881400-74d7acaacd8b', name: 'catedral-seu-4.jpg' },     // cathedral details
  ],
  'castillo-bellver': [
    { id: 'photo-1533154683836-84ea7a0bc310', name: 'castillo-bellver-2.jpg' }, // castle view
    { id: 'photo-1551524559-8af4e6624178', name: 'castillo-bellver-3.jpg' },   // medieval castle
    { id: 'photo-1562483335-c87a3ee5ad63', name: 'castillo-bellver-4.jpg' },   // castle gardens
  ],
  'tren-soller': [
    { id: 'photo-1474487548417-781cb71495f3', name: 'tren-soller-2.jpg' },     // vintage train
    { id: 'photo-1506905925346-21bda4d32df4', name: 'tren-soller-3.jpg' },     // mountain scenery
    { id: 'photo-1464822759023-fed622ff2c3b', name: 'tren-soller-4.jpg' },     // mountain valley
  ],
  'serra-tramuntana': [
    { id: 'photo-1486870591958-9b9d0d1dda99', name: 'serra-tramuntana-2.jpg' }, // mountain peaks
    { id: 'photo-1454496522488-7a8e488e8606', name: 'serra-tramuntana-3.jpg' }, // mountain range
    { id: 'photo-1483728642387-6c3bdd6c93e5', name: 'serra-tramuntana-4.jpg' }, // mountain forest
  ],
  'cuevas-drach': [
    { id: 'photo-1504700610630-ac6eeec848f8', name: 'cuevas-drach-2.jpg' },    // cave interior
    { id: 'photo-1508739773434-c26b3d09e071', name: 'cuevas-drach-3.jpg' },    // underground lake
    { id: 'photo-1527489377706-5bf97e608852', name: 'cuevas-drach-4.jpg' },    // cave formations
  ],
  'valldemossa': [
    { id: 'photo-1523531294919-4bcd7c65e216', name: 'valldemossa-2.jpg' },     // mediterranean village
    { id: 'photo-1499678329028-101435549a4e', name: 'valldemossa-3.jpg' },     // cobblestone streets
    { id: 'photo-1516483638261-f4dbaf036963', name: 'valldemossa-4.jpg' },     // italian village
  ],
  'es-trenc': [
    { id: 'photo-1520454974749-611b7248ffdb', name: 'es-trenc-2.jpg' },        // turquoise water
    { id: 'photo-1471922694854-ff1b63b20054', name: 'es-trenc-3.jpg' },        // clear beach
    { id: 'photo-1510414842594-a61c69b5ae57', name: 'es-trenc-4.jpg' },        // paradise beach
  ],
  'puerto-portals': [
    { id: 'photo-1514649923863-ceaf75b7ec00', name: 'puerto-portals-2.jpg' },  // marina boats
    { id: 'photo-1567899378494-47b22a2ae96a', name: 'puerto-portals-3.jpg' },  // luxury yacht
    { id: 'photo-1544551763-46a013bb70d5', name: 'puerto-portals-4.jpg' },     // harbour sunset
  ],
};

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = (urlStr) => {
      https.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${urlStr}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', reject);
    };
    request(url);
  });
}

async function main() {
  let total = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [base, images] of Object.entries(extraImages)) {
    for (const img of images) {
      total++;
      const dest = path.join(imgDir, img.name);

      if (fs.existsSync(dest)) {
        const stats = fs.statSync(dest);
        if (stats.size > 5000) {
          console.log(`  SKIP ${img.name} (already exists, ${(stats.size/1024).toFixed(0)}KB)`);
          skipped++;
          continue;
        }
      }

      const url = `https://images.unsplash.com/${img.id}?w=1280&h=720&fit=crop&q=80`;
      console.log(`  Downloading ${img.name}...`);
      try {
        await downloadImage(url, dest);
        const stats = fs.statSync(dest);
        if (stats.size < 5000) {
          console.log(`  WARNING: ${img.name} is only ${stats.size} bytes, may be invalid`);
          failed++;
        } else {
          console.log(`  OK ${img.name} (${(stats.size/1024).toFixed(0)}KB)`);
          downloaded++;
        }
      } catch (err) {
        console.log(`  FAIL ${img.name}: ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\nDone: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed out of ${total} total`);
}

main();
