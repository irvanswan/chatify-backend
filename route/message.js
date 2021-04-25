const route = require('express').Router()
const messageController = require('../controllers/messageController')
const upload = require('../helpers/upload')
const verifyToken = require('../helpers/verifyToken')

route.get('/', verifyToken, messageController.getAllMessage)
route.post('/:id_user',verifyToken,upload.uploadFileImages, messageController.sendMessage)// get user  

module.exports = route