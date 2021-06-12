const chatModel = require('../models/Chatroom')
const formResponse = require('../helpers/formResponse')
const messageModel = require('../models/Message')

const chatController ={
    getChatlist : (req, res) =>{
        chatModel.getChatlist(req).then((result) => {
            formResponse(result, res)
        }).catch((err)=> {
            formResponse(err, res)
        })
    },
    sendMessage : (req,res)=>{
        messageModel.sendChat(req).then((result)=>{
            formResponse(result, res)
        }).catch((err)=>{
            formResponse(err, res)
        })
    },
    getAllMessage : (req,res)=>{
        if(req.query.id_chatroom != null && req.query.id_user != null){
            messageModel.getAllMessage(req).then((result)=>{
                formResponse(result, res)
            }).catch((err)=>{
                formResponse(err, res)
            })
        }
    },
    getLastMessage : (req,res)=>{
        if(req.query.id_chatroom != null && req.query.id_user != null){
            messageModel.getLasMessage(req).then((result)=>{
                formResponse(result, res)
            }).catch((err)=>{
                formResponse(err, res)
            })
        }
    }
}

module.exports = chatController