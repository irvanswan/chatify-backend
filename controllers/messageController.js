const messageModel = require('../models/Chatroom')
const formResponse = require('../helpers/formResponse')

const chatController ={
    getChatlist : (req, res) =>{
        messageModel.getChatting(req).then((result) => {
            formResponse(result, res)
        }).catch((err)=> {
            formResponse(err, res)
        })
    },
    sendMessage : (req,res)=>{
        messageModel.sendChat(req).then((result)=>{
            formResponse(result, res)
        }).catch((err=>{
            formResponse(err, res)
        }))
    }
}

module.exports = chatController