const https = require('https');
const http = require('http');

const PING_URL = process.env.PING_URL;

if (!PING_URL) {
  console.error('PING_URL environment variable is not set');
  process.exit(1);
}

const url = PING_URL.startsWith('https') ? PING_URL : `https://${PING_URL}`;
const fullUrl = `${url}/api/health`;

console.log(`[${new Date().toISOString()}] Pinging: ${fullUrl}`);

const protocol = fullUrl.startsWith('https') ? https : http;

const req = protocol.get(fullUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`[${new Date().toISOString()}] Status: ${res.statusCode}`);
    console.log(`[${new Date().toISOString()}] Response: ${data}`);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(`[${new Date().toISOString()}] Ping successful - service is awake`);
      process.exit(0);
    } else {
      console.error(`[${new Date().toISOString()}] Ping failed with status ${res.statusCode}`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`[${new Date().toISOString()}] Ping error:`, error.message);
  process.exit(1);
});

req.setTimeout(10000, () => {
  console.error(`[${new Date().toISOString()}] Request timed out`);
  req.destroy();
  process.exit(1);
});
