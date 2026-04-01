const redis = require('redis');
require('dotenv').config();

// Redis Client Setup
const redisClient = redis.createClient({
   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis Connected'));

(async () => {
  await redisClient.connect();
})();

module.exports = { redisClient };
