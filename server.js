const http = require('http');
const io_client = require('socket.io-client');

const app = require('./app');
const eventbus = require('./eventbus/eventbus-kafka');
const eventHandler = require('./eventbus/event-handler');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const sendMessage = () => {
    eventbus.producer.send({
        topic: 'hhhh',
        messages: [
            { value: 'hello world' }
        ]
    });
}

const configSubcribeManager = () => {
    eventbus.subscribeManager['need-user'] = eventHandler.NeedUserHandler;
}
configSubcribeManager();

const test = async () => {
    try {
        await eventbus.producer.connect();

        await eventbus.consumer.connect();
        await eventbus.consumer.subscribe({ topic: 'need-user', fromBeginning: true });
        await eventbus.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                eventbus.subscribeManager[topic](message);
            }
        });
    } catch (err) {
        console.log(err);
    }
}
test();

server.listen(port);
