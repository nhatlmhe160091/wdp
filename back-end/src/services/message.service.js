const { Message } = require('../models/index');

class MessageService {
 
    getAllMessages = async () => {
        return await Message.find();
    }
}

module.exports = new MessageService;
