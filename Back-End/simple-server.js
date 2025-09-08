import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    message: 'Simple test server is working!',
    timestamp: new Date().toISOString(),
    port: 5002
  }));
});

server.listen(5002, '0.0.0.0', () => {
  console.log('Simple test server running on port 5002');
  console.log('Access via: http://localhost:5002');
  console.log('Access via: http://10.0.2.2:5002 (Android emulator)');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
