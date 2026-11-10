const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'games');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const images = [
  { url: 'https://vericath.org/wp-content/uploads/2026/03/rung-chuong-vang-1.png', name: 'rung-chuong-vang.png' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/DO-VUI-GIAO-LY.jpg', name: 'do-vui-giao-ly.jpg' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/lottery-1580895821117709492600.png', name: 'xo-so.png' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/quiz.png', name: 'tao-quiz.png' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/tim-tu.png', name: 'tim-tu.png' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/loto.png', name: 'lo-to.png' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/chiecnonkydieu.png', name: 'chiec-non-ky-dieu.png' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/ailatrieuphu.png', name: 'ai-la-trieu-phu.png' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/xep-cau-kinh-thanh.jpg', name: 'sap-xep-kinh-thanh.jpg' },
  { url: 'https://vericath.org/wp-content/uploads/2026/03/LATHINH.jpg', name: 'lat-hinh.jpg' }
];

async function download() {
  for (const img of images) {
    const dest = path.join(dir, img.name);
    const file = fs.createWriteStream(dest);
    
    await new Promise((resolve, reject) => {
      https.get(img.url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${img.name}`);
            resolve();
          });
        } else {
          console.error(`Failed to download ${img.name}: ${response.statusCode}`);
          resolve();
        }
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        console.error(`Error downloading ${img.name}: ${err.message}`);
        resolve();
      });
    });
  }
}

download().then(() => console.log('Done'));
