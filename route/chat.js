const route = require('express').Router()
const messageController = require('../controllers/messageController')

route.post('/:id', messageController.sendMessage)
route.get('/:id',messageController.getChatlist)
/* route.get('/:id/',messageController.sendMessage) */

module.exports = route