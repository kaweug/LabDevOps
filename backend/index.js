const express = require('express');
const redis = require('redis');
const process = require('process');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./keys.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log(keys);

const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

const client = redis.createClient({
  host: 'redis',
  port: 6379
});

client.set('counter', 0);

app.get('/', (req, resp) => {

  process.exit(0);

  client.get('counter', (err, counter_value)  => {
    resp.send('Counter: ' + counter_value);
    client.set('counter', parseInt(counter_value) + 1);
  });
});

app.listen(8080, err => {
  console.log("Listening on port 8080");
});


app.get('/gcd', (req, resp) => {
    num1 = parseInt(req.query.num1)
    num2 = parseInt(req.query.num2)

    key = ""
    if(num1 <= num2) {
      key += num1 + "" + num2
    } else {
      key += num2 + "" + num1
    }

    client.get(key, function(err, reply) {
        gcdVal = -1;
        if(reply == null) {
            console.log("no " + key + " in redis");
            gcdVal = gcd(num1, num2);
            client.set(key, gcdVal);
        } else {
          console.log("got " + key + " from redis");
          gcdVal = reply;
        }

        resp.send('GCD: ' + gcdVal);
    });
});

function gcd(x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number'))
    return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}
