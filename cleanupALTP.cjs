const https = require('https');
const http = require('http');

const DB_URL = 'bxhtop-85816-default-rtdb.asia-southeast1.firebasedatabase.app';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: DB_URL,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log("Fetching users...");
  const users = await request('GET', '/users.json');
  const updates = {};
  
  if (users) {
    for (const [uid, user] of Object.entries(users)) {
      if (user.gameScores && user.gameScores['ai-la-trieu-phu']) {
        let altpScore = user.gameScores['ai-la-trieu-phu'].bestScore || 0;
        if (altpScore > 5000) {
          // It's inflated! Set to max 1600.
          console.log(`Fixing user ${uid}: ALTP score was ${altpScore}`);
          altpScore = 1600;
          
          let totalScore = 0;
          for (const [gameId, gameData] of Object.entries(user.gameScores)) {
            if (gameId === 'ai-la-trieu-phu') {
              totalScore += 1600;
            } else {
              totalScore += (gameData.bestScore || 0);
            }
          }
          
          updates[`/users/${uid}/gameScores/ai-la-trieu-phu/bestScore`] = 1600;
          updates[`/users/${uid}/totalScore`] = totalScore;
        }
      }
    }
  }

  console.log("Fetching leaderboard (ALTP internal)...");
  const leaderboard = await request('GET', '/leaderboard.json');
  if (leaderboard) {
    for (const [key, entry] of Object.entries(leaderboard)) {
      if (entry.score > 5000) {
        console.log(`Fixing leaderboard entry ${key}: score was ${entry.score}`);
        updates[`/leaderboard/${key}/score`] = 1600;
      }
    }
  }

  if (Object.keys(updates).length > 0) {
    console.log("Applying updates...", updates);
    const result = await request('PATCH', '/.json', updates);
    console.log("Update result:", result);
  } else {
    console.log("No inflated scores found. Everything is clean!");
  }
}

run().catch(console.error);
