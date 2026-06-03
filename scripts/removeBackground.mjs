import { Jimp } from "jimp";
import { readdirSync } from "fs";
import { join, basename, extname } from "path";

const INPUT_DIR = "assets/character";
const files = readdirSync(INPUT_DIR).filter((f) =>
  [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase())
);

for (const file of files) {
  const inputPath = join(INPUT_DIR, file);
  const outputPath = join(INPUT_DIR, basename(file, extname(file)) + ".png");

  const img = await Jimp.read(inputPath);

  for (let y = 0; y < img.bitmap.height; y++) {
    for (let x = 0; x < img.bitmap.width; x++) {
      const idx = (img.bitmap.width * y + x) * 4;
      const r = img.bitmap.data[idx];
      const g = img.bitmap.data[idx + 1];
      const b = img.bitmap.data[idx + 2];
      if (r > 220 && g > 220 && b > 220) {
        img.bitmap.data[idx + 3] = 0;
      }
    }
  }

  await img.write(outputPath);
  console.log(`✓ ${file} → ${basename(outputPath)}`);
}

console.log("Done — all characters processed.");
