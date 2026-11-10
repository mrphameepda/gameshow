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

function patchPath(path, data) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(data);
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    };
    const req = https.request(`${dbUrl}/${path}.json`, options, (res) => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => resolve(response));
    });
    req.on('error', reject);
    req.write(dataString);
    req.end();
  });
}

async function repair() {
  console.log("Starting DB Repair...");
  const users = await fetchPath('users');
  const userUpdates = {};

  if (users) {
    for (const uid in users) {
      const user = users[uid];
      let needsUpdate = false;
      let newTotalScore = 0;
      
      if (user.gameScores) {
        for (const gameId in user.gameScores) {
          let score = user.gameScores[gameId].bestScore || 0;
          if (score > 2000) {
            console.log(`Fixing ${uid} in users: ${gameId} score ${score} -> 1600`);
            userUpdates[`${uid}/gameScores/${gameId}/bestScore`] = 1600;
            score = 1600;
            needsUpdate = true;
          }
          newTotalScore += score;
        }
      }
      
      if (needsUpdate || user.totalScore !== newTotalScore) {
        if (user.totalScore !== newTotalScore) {
           console.log(`Fixing ${uid} totalScore: ${user.totalScore} -> ${newTotalScore}`);
           userUpdates[`${uid}/totalScore`] = newTotalScore;
           needsUpdate = true;
        }
      }
    }

    if (Object.keys(userUpdates).length > 0) {
      console.log("Applying user updates...");
      await patchPath('users', userUpdates);
      console.log("User updates applied.");
    } else {
      console.log("No users needed fixing.");
    }
  }

  const nodes = ['leaderboard_vuihoc', 'leaderboard', 'leaderboard_memory', 'leaderboard_verses', 'leaderboard_demons'];
  for (const node of nodes) {
    const data = await fetchPath(node);
    if (data) {
      const nodeUpdates = {};
      for (const key in data) {
        if (data[key].score > 2000) {
          console.log(`Fixing ${key} in ${node}: score ${data[key].score} -> 1600`);
          nodeUpdates[`${key}/score`] = 1600;
        }
      }
      if (Object.keys(nodeUpdates).length > 0) {
        console.log(`Applying updates to ${node}...`);
        await patchPath(node, nodeUpdates);
        console.log(`${node} updates applied.`);
      }
    }
  }
  
  console.log("DB Repair complete.");
}

repair();
