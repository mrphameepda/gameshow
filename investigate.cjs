const https = require('https');

const dbUrl = 'https://bxhtop-85816-default-rtdb.asia-southeast1.firebasedatabase.app';

function fetchPath(path) {
  return new Promise((resolve, reject) => {
    https.get(`${dbUrl}/${path}.json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function investigate() {
  const users = await fetchPath('users');
  console.log("--- USERS ---");
  for (const uid in users) {
    const user = users[uid];
    if (user.totalScore >= 10000000 || user.fullName && user.fullName.includes('Gius')) {
      console.log(`UID: ${uid}, Name: ${user.fullName}, totalScore: ${user.totalScore}`);
      if (user.gameScores) {
         console.log("  Game Scores:", JSON.stringify(user.gameScores));
      }
    }
  }

  const nodes = ['leaderboard_vuihoc', 'leaderboard', 'leaderboard_memory', 'leaderboard_verses', 'leaderboard_demons'];
  for (const node of nodes) {
    const data = await fetchPath(node);
    if (data) {
      for (const key in data) {
        if (data[key].score >= 10000000 || (data[key].name && data[key].name.includes('Gius'))) {
          console.log(`[${node}] UID: ${key}, Name: ${data[key].name}, Score: ${data[key].score}`);
        }
      }
    }
  }
}

investigate();
