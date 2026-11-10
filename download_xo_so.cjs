const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images', 'xo-so');
const soundDir = path.join(__dirname, 'public', 'sounds', 'xo-so');

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
if (!fs.existsSync(soundDir)) fs.mkdirSync(soundDir, { recursive: true });

const files = [
  { url: 'https://vericath.org/wp-content/uploads/2026/07/giangsinh.jpg', dest: path.join(imgDir, 'bg-christmas.jpg') },
  { url: 'https://vericath.org/wp-content/uploads/2026/07/Xuan-vinh-cuu.png', dest: path.join(imgDir, 'bg-tet.png') },
  { url: 'https://vericath.org/wp-content/uploads/2026/07/phucsinh.jpg', dest: path.join(imgDir, 'bg-easter.jpg') },
  { url: 'https://actions.google.com/sounds/v1/science_fiction/glitch_synthesizer_loop.ogg', dest: path.join(soundDir, 'spin.ogg') },
  { url: 'https://actions.google.com/sounds/v1/ui/click_sound.ogg', dest: path.join(soundDir, 'tick.ogg') },
  { url: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', dest: path.join(soundDir, 'win.ogg') }
];

async function download() {
  for (const f of files) {
    try {
      const res = await fetch(f.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(f.dest, buffer);
      console.log(`Downloaded ${path.basename(f.dest)}`);
    } catch (e) {
      console.error(`Failed ${path.basename(f.dest)}:`, e.message);
    }
  }
}

download();
