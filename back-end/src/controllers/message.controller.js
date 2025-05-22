const { MessageService } = require('../services/index');

class MessageController {
    /**
    * method: GET
    * router(api/v1/message)
    * author: XXX
    */
    getAllMessages = async (req, res, next) => {
        try {
            const messages = await MessageService.getAllMessages();
            res.status(200).json({
                data: messages,
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new MessageController;
