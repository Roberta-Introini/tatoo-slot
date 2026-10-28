/**
 * Convert every .png in the symbols folder to a 200x200 .svg.
 * Each SVG is exactly 200x200; the original PNG is embedded and scaled to
 * fit (centered, no stretching) so every symbol cell is the same square size.
 *
 * Usage:  node png_to_svg.js
 */
const fs = require('fs');
const path = require('path');

const FOLDER = path.join(__dirname);
const SIZE = 200;

for (const png of fs.readdirSync(FOLDER).filter(f => f.endsWith('.png')).sort()) {
  const svgPath = path.join(FOLDER, png.replace(/\.png$/, '.svg'));
  const buf = fs.readFileSync(path.join(FOLDER, png));
  const b64 = buf.toString('base64');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">` +
    `<rect width="${SIZE}" height="${SIZE}" fill="#0a0a14"/>` +
    `<image width="${SIZE}" height="${SIZE}" xlink:href="data:image/png;base64,${b64}" ` +
    `preserveAspectRatio="xMidYMid meet"/>` +
    `</svg>`;
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log('created', path.basename(svgPath));
}