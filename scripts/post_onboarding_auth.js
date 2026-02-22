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
        // Dev headers to simulate a Clerk user (only used because route allows dev headers)
        'x-dev-clerk-user': 'simulated-user-1',
        'x-dev-email': 'simulated-user-1@example.com',
        'x-dev-first-name': 'Simulated',
        'x-dev-last-name': 'User',
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
  for (const port of [3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010]) {
    console.log('Trying port', port);
    const r = await tryPost(port);
    console.log('Result for', port, r);
    if (!r.error) break;
  }
})();
