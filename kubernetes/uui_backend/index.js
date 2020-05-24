const express = require('express');
const redis = require('redis');
//const process = require('process');
//const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
//const cors = require('cors');
const port = 5000;

const app = express();
const appId = uuidv4();

const client = redis.createClient({
  host: "redis-service",
  port: 6379,
  retry_strategy: () => 3000
});

client.set(appId, 0);

app.get('/', (req, resp) => {
  client.get(appId, (err, counter_value)  => {
    resp.send(`[${appId}] Hello from my uuid-backend app. This instance counter: ${counter_value}`);
    client.set(appId, parseInt(counter_value) + 1);
  });
});


app.listen(port, err => {
  console.log(`Listening on port ${port}`);
});
