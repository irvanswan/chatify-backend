const route = require('express').Router()
const messageController = require('../controllers/messageController')
const verifyToken = require('../helpers/verifyToken')

route.post('/:id',verifyToken, messageController.sendMessage)
route.get('/:id',verifyToken, messageController.getChatlist)
route.get('/', messageController.getLastMessage)
/* route.get('/:id/',messageController.sendMessage) */

module.exports = route