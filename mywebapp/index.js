const express = require('express');
const redis = require('redis');
const process = require('process')

const app = express();
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

app.listen(8080, () => {
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
