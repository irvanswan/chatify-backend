const e = require('express')
const db = require('../helpers/database')

const messageModel = {
    getAllMessage : (req) =>{
        return new Promise((resolve, reject)=>{
            if(req.query.id_chatroom != null){
                db.query(`SELECT * FROM detail_chat JOIN (SELECT A.id AS participiant1, B.id AS participiant2, A.id_user AS user1
                    ,B.id_user AS user2, A.id_chatroom AS chatroom1, B.id_chatroom AS chatroom2 FROM participiants A, participiants B WHERE A.id_user <> B.id_user)
                    AS b ON detail_chat.id_sender = b.participiant1 JOIN users ON b.user1 = users.id 
                    LEFT JOIN contacts ON users.id = contacts.relation
                    WHERE b.chatroom1 = ${req.query.id_chatroom}  AND b.chatroom2 = ${req.query.id_chatroom}`,(err, res)=>{
                        if(!err){
                            resolve({
                                message : 'success',
                                status : 200,
                                data : res.rows
                            })
                        }else{
                            reject({
                                message : 'failed',
                                status : 400,
                                data : []
                            })
                        }
                    })
            }
        })
    }
}

module.exports = messageModel
