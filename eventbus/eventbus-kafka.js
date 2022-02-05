const {Kafka} = require('kafkajs');
const eventHandler = require('./event-handler');

const kafka = new Kafka({
    clientId: 'user-app',
    brokers: ['kafka1:9092', 'kafka1:9092', 'kafka1:9092']
});

const producer = kafka.producer();

const consumer = kafka.consumer({groupId: 'group1'});

const subscribeManager = {};

const manageSubcribe = () => {
    console.log('event bus');
    subscribeManager['need-user'] = eventHandler.NeedUserHandler;
};

module.exports = {producer, consumer, subscribeManager, manageSubcribe};