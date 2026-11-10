const fs = require('fs');
const lines = fs.readFileSync('C:/Users/mrpha/.gemini/antigravity-ide/brain/1ff8788b-b6b4-4d5f-8864-eb6b4427dce8/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');

for(let i=0; i<lines.length; i++) {
  if (!lines[i]) continue;
  try {
      const parsed = JSON.parse(lines[i]);
      if (parsed.type === 'USER_INPUT' && parsed.content.includes('Ai Là Triệu Phú Công Giáo')) {
          fs.writeFileSync('f:/Gameshow/altp_backup.txt', parsed.content);
          console.log('Found and wrote to altp_backup.txt');
          break;
      }
  } catch(e) {}
}
