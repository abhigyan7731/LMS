const http = require('http');

async function tryPost(port) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ role: 'teacher' });
    const options = {
      hostname: 'localhost',
      port,
      path: '/api/onboarding',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.write(data);
    req.end();
  });
}

(async () => {
  for (const port of [3001, 3000]) {
    console.log('Trying port', port);
    const r = await tryPost(port);
    console.log('Result for', port, r);
    if (!r.error) break;
  }
})();
