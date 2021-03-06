var config = {};

// config.twitter = {};
// config.redis = {};
// config.web = {};

// config.default_stuff =  ['red','green','blue','apple','yellow','orange','politics'];
// config.twitter.user_name = process.env.TWITTER_USER || 'username';
// config.twitter.password=  process.env.TWITTER_PASSWORD || 'password';
// config.redis.uri = process.env.DUOSTACK_DB_REDIS;
// config.redis.host = 'hostname';
// config.redis.port = 6379;
// config.web.port = process.env.WEB_PORT || 9980;

config.rate = {};
config.rate.up = 1.1;
config.rate.down = 0.95;
config.rate.solid = 0.1;

config.spamSec = 20;
config.sleepTime = 200;

config.api = {};
config.api.enabled = process.env.API_ENABLED;
config.api.port = process.env.API_PORT ? parseInt(process.env.API_PORT) : 1234;

module.exports = config;
