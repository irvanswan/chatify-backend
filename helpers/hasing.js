const bcrypt = require('bcrypt')
const formResponse = require('./formResponse')

let hashingPassword = (req,res,next) =>{
if(req.body.password != null){
    bcrypt.genSalt(10, function(saltError, salt){
        if(!saltError){
            bcrypt.hash(req.body.password, salt, function(hashingError, hash){
               if(!hashingError){
                    req.body.password = hash
                    next()
               }else{
                    formResponse({
                        message: `Error hasing password ${hashingError}`,
                        status: 400
                    },res)
               }
            })
        }else{
            formResponse({
                message : `Error hasing password ${saltError}`,
                status : 400
            },res)
        }
    })
    }else{
        next()
    }
}

module.exports = hashingPassword