const AuthMiddleware = require('./auth.middleware');
const ErrorHandle = require('./errorHandle.middleware');
const uploadFileMiddleware = require('./uploadFile.middleware');
module.exports = {
    AuthMiddleware,
    ErrorHandle,
    uploadFileMiddleware
}