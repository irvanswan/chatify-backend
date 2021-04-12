const route = require('express').Router()
const upload = require('../helpers/upload')
const contactController = require('../controllers/contactController')

route.get('/', contactController.getAllContact)
route.get('/:id', contactController.getContactByName)   
                   // get user
route.post('/:id', contactController.addContact)
route.patch('/:id', upload.uploadAvatar ,contactController.updateContact)


module.exports = route