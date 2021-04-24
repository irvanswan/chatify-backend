const userModel = require('../models/User')
const formResponse = require('../helpers/formResponse')
const userController={
    getUser : (req, res) =>{
        if(req.query.id_chatroom == null){
            userModel.getAllUser(req).then((result) => {
                formResponse(result, res)
            }).catch((err)=> {
                formResponse(err, res)
            })
        }else{
            userModel.getInfoUser(req).then((result)=>{
                formResponse(result, res)
            }).catch((err)=>{
                formResponse(err, res)
            })
        }
    },  
    registerUser : (req, res)=>{
        userModel.registerUser(req).then((result)=>{
            formResponse(result, res)
        }).catch((err)=>{
            formResponse(err, res)
        })
    },
    loginUser : (req, res)=>{
        userModel.loginUser(req).then((result)=>{
            formResponse(result, res)
        }).catch((err)=>{
            formResponse(err, res)
        })
    },
    updateUser : (req, res)=>{
        userModel.updateUser(req).then((result)=>{
            formResponse(result, res)
        }).catch((err)=>{
            formResponse(err, res)
        })
    },
    deleteUser : (req, res)=>{
        userModel.deleteUser(req).then((result)=>{
            formResponse(result, res)
        }).catch((err)=>{
            formResponse(err, res)
        })
    },
    searchingUser : (req, res)=>{
        userModel.searchUser(req).then((result)=>{
            formResponse(result, res)
        }).catch((err)=>{
            formResponse(err,res)
        })
    },
}

module.exports = userController