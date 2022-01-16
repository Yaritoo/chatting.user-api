
const User = require('../api/model/user');
const eventbus = require('./eventbus-kafka');

exports.NeedUserHandler = async (message) => {
    try{
        let foundUser = await User.findById(message.value.toString()).exec();
        await eventbus.producer.send({
            topic: 'get-user',
            messages: [
                { value: foundUser.toString() }
            ]
        });
    }catch(err){
        console.log(err);
    }
}