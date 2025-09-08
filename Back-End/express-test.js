import express from "express";

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Express test server is working!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`Express test server running on port ${PORT}`);
  console.log(`Access via: http://localhost:${PORT}`);
});
