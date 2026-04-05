const fs = require('fs');
const https = require('https');

const url = 'https://assets3.lottiefiles.com/private_files/lf30_8eqhhafb.json'; // Cute Cat

https.get(url, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    fs.writeFileSync('public/cat.json', body);
    console.log('Cat Lottie downloaded successfully.');
  });
}).on('error', (e) => {
  console.error('Error:', e);
});
