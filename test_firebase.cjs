const https = require('https');

https.get('https://bxhtop-85816-default-rtdb.asia-southeast1.firebasedatabase.app/leaderboard_vuihoc.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const keys = Object.keys(parsed);
    console.log(keys.length + " items in leaderboard_vuihoc");
    console.log("Sample item:");
    console.log(parsed[keys[0]]);
  });
});
