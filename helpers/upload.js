const multer = require('multer')
const fs = require('fs')
const path = require('path')
const formResponse = require('./formResponse')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
})

let storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/documents')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

let storage3 = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/uploads/file_images')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

let uploadImages = multer({storage:storage3, limits:{
    fileSize : 5 * 1000 * 1000
},fileFilter:function(req, file , inst){
    const ext = path.extname(file.originalname);
    (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') ? inst(new Error('Only images allowed'), false) : inst(null, true)
}
})

let uploadImage = multer({storage, limits:{
    fileSize : 5 * 1000 * 1000
},fileFilter:function(req, file , inst){
    const ext = path.extname(file.originalname);
    (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') ? inst(new Error('Only images allowed'), false) : inst(null, true)
}
})

let uploadFile = multer({storage : storage2, limits:{
    fileSize : 100 * 1000 * 1000
}
})
const formUpload = {
    uploadAvatar : (req,res,next) =>{
            const uploadedImage = uploadImage.single(`photo`)
            uploadedImage(req, res, (err)=>{
                if (err instanceof multer.MulterError) {
                    formResponse({
                        message: `Error Multer Error${err.message}`,
                        status: 400
                    },res)
                } else if (err) {
                    formResponse({
                        message: `${err.message}`,
                        status: 400
                    },res)
                } else{
                    next()                
                }
        })
    },
    uploadFile : (req, res, next) =>{
        if(req.files !== 'undefined' || req.files != null){
            const uploadedFiles = uploadFile.array(`document`, 10)
            uploadedFiles(req, res, (err)=>{
                if (err instanceof multer.MulterError) {
                    formResponse({
                        message: `Error Multer Error${err.message}`,
                        status: 400
                    },res)
                } else if (err) {
                    formResponse({
                        message: `${err.message}`,
                        status: 400
                    },res)
                } else{
                    const files = req.files
                    req.file = files
                    next()
                }
        })
        }else{
            next()
        }
    },
    uploadFileImages : (req, res, next) =>{
        if(req.files !== 'undefined' || req.files != null){
            const uploadedFilesImage = uploadImages.array(`images`, 10)
            uploadedFilesImage(req, res, (err)=>{
                if (err instanceof multer.MulterError) {
                    formResponse({
                        message: `Error Multer Error${err.message}`,
                        status: 400
                    },res)
                } else if (err) {
                    formResponse({
                        message: `${err.message}`,
                        status: 400
                    },res)
                } else{
                    const files = req.files
                    req.file = files
                    next()
                }
        })
        }else{
            next()
        }
    }
}
module.exports = formUpload