import { Jimp } from "jimp";
import { readdirSync } from "fs";
import { join, basename, extname } from "path";

const INPUT_DIR = "assets/character";
const THRESHOLD = 45;       // main flood-fill tolerance
const EXPAND_THRESH = 70;   // boundary-expansion tolerance (catches JPEG halos)
const EXPAND_PASSES = 5;    // more passes = cleaner edges

const files = readdirSync(INPUT_DIR).filter((f) =>
  [".jpg", ".jpeg"].includes(extname(f).toLowerCase())
);

function colorDist(r1, g1, b1, r2, g2, b2) {
  // Weighted Euclidean — human eye is more sensitive to green
  return Math.sqrt(
    2.2 * (r1 - r2) ** 2 +
    4.0 * (g1 - g2) ** 2 +
    1.8 * (b1 - b2) ** 2
  );
}

function sampleBgColor(data, width, height) {
  // Collect ALL edge pixels, quantize to 16-step buckets, pick most common
  const freq = new Map();
  const edgePts = [];
  for (let x = 0; x < width; x++) {
    edgePts.push([x, 0]);
    edgePts.push([x, height - 1]);
  }
  for (let y = 1; y < height - 1; y++) {
    edgePts.push([0, y]);
    edgePts.push([width - 1, y]);
  }

  for (const [x, y] of edgePts) {
    const idx = (y * width + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const key = `${r >> 4},${g >> 4},${b >> 4}`;
    freq.set(key, (freq.get(key) ?? 0) + 1);
  }

  let bestKey = null, bestCount = 0;
  for (const [k, count] of freq) {
    if (count > bestCount) { bestCount = count; bestKey = k; }
  }

  const [rq, gq, bq] = bestKey.split(",").map(Number);
  return [(rq << 4) + 8, (gq << 4) + 8, (bq << 4) + 8];
}

async function removeBackground(inputPath, outputPath) {
  const img = await Jimp.read(inputPath);
  const { width, height, data } = img.bitmap;
  const alpha = new Uint8Array(width * height).fill(255);

  const [bgR, bgG, bgB] = sampleBgColor(data, width, height);

  // ── Pass 1: flood fill from all edges ──
  const queue = [];
  const visited = new Uint8Array(width * height);

  const enqueue = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = y * width + x;
    if (visited[i]) return;
    const idx = i * 4;
    const dist = colorDist(data[idx], data[idx + 1], data[idx + 2], bgR, bgG, bgB);
    if (dist <= THRESHOLD) {
      visited[i] = 1;
      queue.push(x, y);
    }
  };

  for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
  for (let y = 0; y < height; y++) { enqueue(0, y); enqueue(width - 1, y); }

  let qi = 0;
  while (qi < queue.length) {
    const x = queue[qi++], y = queue[qi++];
    alpha[y * width + x] = 0;
    enqueue(x + 1, y); enqueue(x - 1, y);
    enqueue(x, y + 1); enqueue(x, y - 1);
  }

  // ── Pass 2: expand N times to eat JPEG halos ──
  for (let iter = 0; iter < EXPAND_PASSES; iter++) {
    const toErase = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (alpha[y * width + x] === 0) continue;
        const hasErased =
          (x > 0          && alpha[y * width + (x - 1)] === 0) ||
          (x < width - 1  && alpha[y * width + (x + 1)] === 0) ||
          (y > 0          && alpha[(y - 1) * width + x] === 0) ||
          (y < height - 1 && alpha[(y + 1) * width + x] === 0);
        if (!hasErased) continue;
        const idx = (y * width + x) * 4;
        const dist = colorDist(data[idx], data[idx + 1], data[idx + 2], bgR, bgG, bgB);
        if (dist <= EXPAND_THRESH) toErase.push(y * width + x);
      }
    }
    if (toErase.length === 0) break;
    toErase.forEach((i) => (alpha[i] = 0));
  }

  // Apply alpha
  for (let i = 0; i < width * height; i++) {
    data[i * 4 + 3] = alpha[i];
  }

  await img.write(outputPath);
  console.log(`✓ ${basename(inputPath)} (bg: rgb(${bgR},${bgG},${bgB})) → ${basename(outputPath)}`);
}

for (const file of files) {
  const inputPath = join(INPUT_DIR, file);
  const outputPath = join(INPUT_DIR, basename(file, extname(file)) + ".png");
  await removeBackground(inputPath, outputPath);
}

console.log("Done.");
