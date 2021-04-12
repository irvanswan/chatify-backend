const route = require('express').Router()
const userController = require('../controllers/userController')
const upload = require('../helpers/upload')
const validation = require('../helpers/validation')
const hashing  = require('../helpers/hasing')

route.patch('/:id',validation,upload.uploadAvatar,hashing, userController.updateUser)
route.get('/',userController.getUser)        
route.post('/login', userController.loginUser)                   // get user
route.post('/register', hashing, userController.registerUser)        // register           // login
route.delete('/:id', userController.deleteUser)
route.get('/search/', userController.searchingUser)
route.post('/formupload/',upload.uploadFile, userController.sendFiles)

module.exports = route