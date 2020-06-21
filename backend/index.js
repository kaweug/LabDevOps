const express = require('express');
const redis = require('redis');
const process = require('process');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./keys.js');
const {v4: uuidv4} = require('uuid');
const port = 5000;

//sleep(4000);

const appId = uuidv4();
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
  .query('CREATE TABLE IF NOT EXISTS values (key VARCHAR(10) PRIMARY KEY, avg NUMERIC(5,2))')
  .catch(err => console.log(err));

const client = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 3000
});

client.set('counter', 0);

app.get('/', (req, resp) => {
  client.get('counter', (err, counter_value)  => {
    resp.send('Counter: ' + counter_value);
    client.set('counter', parseInt(counter_value) + 1);
  });
});

app.listen(port, err => {
  console.log(`Listening on port ${port}`);
});

app.get('/fuelAvg', (req, resp) => {
  const key = req.query.distance + "X" + req.query.fuel;
  const readQuery = {
    name: 'get-acg',
    text: 'SELECT avg FROM values WHERE key =$1::text',
    values: [key],
    rowMode: 'array',
  }

  pgClient.query(readQuery, (err, res) => {
      if (err) throw err

      if(res.rows.length) {
        resp.send((res.rows[0][0] + "").substring(0, 10));
      } else {
        const resultAvg = (parseFloat(req.query.fuel) / parseFloat(req.query.distance)).toFixed(2);

        if(resultAvg) {
          const insertQuery = {
            name: 'put-avg',
            text: 'INSERT INTO values VALUES ($1::varchar, $2::numeric)',
            values: [key, resultAvg],
            rowMode: 'array',
          }
          pgClient.query(insertQuery, (err, res) => {
            if (err) throw err
            console.log(res);
          });
        }
        resp.send(resultAvg);
      }
    });
});

app.get('/values', (req, resp) => {
  const readQuery = {
    name: 'get-acg',
    text: 'SELECT * FROM values',
    values: [],
    rowMode: 'array',
  }

  pgClient.query(readQuery, (err, res) => {
      if (err) throw err

      if(res.rows.length) {
        response = "<!DOCTYPE html><html lang=\"en\"><body>";
        for (const row of res.rows) {
            response += row[0] + " - " + row[1] + "<br/>";
        }
        resp.send(response + "</body></html>");
      } else {
        resp.send("no values");
      }
    });
});

app.get('/api', (req, resp) => {
  resp.send('Hello from backend!');
});

client.set(appId, 0);

app.get('/uuid', (req, resp) => {
  client.get(appId, (err, counter_value)  => {
    resp.send(`[${appId}] Hello from uuid-backend service. This instance counter: ${counter_value}`);
    client.set(appId, parseInt(counter_value) + 1);
  });
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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
