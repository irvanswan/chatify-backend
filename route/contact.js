const route = require('express').Router()
const upload = require('../helpers/upload')
const contactController = require('../controllers/contactController')

route.get('/:id', contactController.getContact) // get all contact
/* route.get('/:id', contactController.getContactByName) // get user */
route.post('/:id', contactController.addContact) // add contact
route.patch('/:id', contactController.updateContact) //update 


module.exports = route