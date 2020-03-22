const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({
  host: 'redis',
  port: 6379
});

app.get('/', (req, res) => {
  res.send("Hello form my webapp");
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
