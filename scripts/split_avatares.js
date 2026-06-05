const { Jimp } = require("jimp");
const path = require("path");
const fs = require("fs");

const SRC = path.join(__dirname, "avatares.jpeg");
const OUT = path.join(__dirname, "avatares");

const COLS = 4;
const ROWS = 7;

// Flood fill desde las esquinas para eliminar el fondo blanco/claro
// sin tocar los tonos de piel ni colores del avatar
function removeBackground(img, threshold = 30) {
  const { width: w, height: h, data } = img.bitmap;

  const isNearWhite = (idx) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold;
  };

  const visited = new Uint8Array(w * h);

  const queue = [];
  const seeds = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
  ];

  for (const [sx, sy] of seeds) {
    const idx = (sy * w + sx) * 4;
    if (!visited[sy * w + sx] && isNearWhite(idx)) {
      queue.push([sx, sy]);
      visited[sy * w + sx] = 1;
    }
  }

  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (queue.length) {
    const [x, y] = queue.pop();
    const idx = (y * w + x) * 4;
    data[idx + 3] = 0; // transparente

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (visited[ni]) continue;
      const nIdx = ni * 4;
      if (isNearWhite(nIdx)) {
        visited[ni] = 1;
        queue.push([nx, ny]);
      }
    }
  }

  // Suaviza bordes: semitransparente los píxeles casi-blancos en el borde del avatar
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] === 0) continue;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const brightness = (r + g + b) / 3;
      if (brightness > 240) {
        data[idx + 3] = Math.round(((255 - brightness) / 15) * 255);
      }
    }
  }
}

(async () => {
  const img = await Jimp.read(SRC);
  const W = img.width;
  const H = img.height;
  console.log(`Imagen: ${W}x${H}`);

  const cellW = Math.floor(W / COLS);
  const cellH = Math.floor(H / ROWS);

  fs.mkdirSync(OUT, { recursive: true });

  let n = 1;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * cellW;
      const y = row * cellH;

      const crop = img.clone().crop({ x, y, w: cellW, h: cellH });
      removeBackground(crop);

      const filename = path.join(OUT, `avatar_${String(n).padStart(2, "0")}.png`);
      await crop.write(filename);
      process.stdout.write(`  avatar_${String(n).padStart(2, "0")}.png\n`);
      n++;
    }
  }

  console.log(`\nListo — ${n - 1} avatares sin fondo en assets/avatares/`);
})();
