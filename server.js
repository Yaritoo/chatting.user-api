const http = require('http');
const io_client = require('socket.io-client');
const redis = require('redis');

const app = require('./app');
const eventbus = require('./eventbus/eventbus-kafka');
const eventHandler = require('./eventbus/event-handler');

const port = process.env.PORT || 3000;
const redis_port = process.env.REDIS_PORT || 6379;

const clientRedis = redis.createClient({
    url: 'redis://redis:6379'
});
const server = http.createServer(app);

const test = async () => {
    try {
        await eventbus.producer.connect();

        await clientRedis.connect();
    } catch (err) {
        console.log(err);
    }
}

eventbus.manageSubcribe();
test();
server.listen(port);
clientRedis.on('connect', () => console.log('connected'));
clientRedis.on('reconnecting', () => console.log('reconnecting...'));

exports.sendMessage = async (user) => {
    await eventbus.producer.send({
        topic: 'get-user',
        messages: [
            { key: user.id, value: JSON.stringify(user) }
        ]
    });
}

exports.setRedis = async (key, value) => {
    try {
        await clientRedis.set(key, JSON.stringify(value));
    } catch (err) {
        console.log('user: save redis fail');
        console.log(err);
    }
}