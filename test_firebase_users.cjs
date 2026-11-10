const https = require('https');

https.get('https://bxhtop-85816-default-rtdb.asia-southeast1.firebasedatabase.app/users.json?shallow=true', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("users.json shallow:", data);
  });
});
