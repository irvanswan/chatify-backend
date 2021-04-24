const route = require('express').Router()
const userController = require('../controllers/userController')
const upload = require('../helpers/upload')
const validation = require('../helpers/validation')
const hashing  = require('../helpers/hashing')
const verifyToken = require('../helpers/verifyToken')

route.patch('/:id_user',verifyToken, upload.uploadAvatar, hashing, userController.updateUser) //update user
route.get('/', userController.getUser)// get user 
route.post('/login', userController.loginUser)// login user
route.post('/register', hashing, userController.registerUser)// register user
//route.delete('/:id', userController.deleteUser)
//route.get('/search/', userController.searchingUser)
//route.post('/formupload/',upload.uploadFile, userController.sendFiles)

module.exports = route