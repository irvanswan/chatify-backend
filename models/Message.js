const e = require('express')
const db = require('../helpers/database')

const messageModel = {
    getAllMessage : (req) =>{
        return new Promise((resolve, reject)=>{
            if(req.query.id_chatroom != null){
                db.query(`SELECT * FROM participiants WHERE id_chatroom = ${req.query.id_chatroom} AND id_user=${req.query.id_user}`,(error,result)=>{
                    if(!error){
                        if(result.rows.length < 1){
                            reject({
                                message : 'failed',
                                status : 400,
                                data : []
                            })
                        }
                    }else{
                        reject({
                            message : 'failed',
                            status : 400,
                            data : []
                        })
                    }
                })
                db.query(`SELECT * FROM detail_chat JOIN (SELECT A.id AS participiant1, B.id AS participiant2, A.id_user AS user1
                    ,B.id_user AS user2, A.id_chatroom AS chatroom1, B.id_chatroom AS chatroom2 FROM participiants A, participiants B WHERE A.id_user != B.id_user)
                    AS b ON detail_chat.id_sender = b.participiant1 JOIN users ON b.user1 = users.id 
                    LEFT JOIN contacts ON users.id = contacts.relation
                    WHERE b.chatroom1 = ${req.query.id_chatroom}  AND b.chatroom2 = ${req.query.id_chatroom} ORDER BY detail_chat.timestamp ASC`,(err, res)=>{
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
    },
    sendChat : (req)=>{
        return new Promise((resolve, reject)=>{
            if(req.query.id_chatroom != null && req.query.id_sender != null){
                const {id_chatroom, id_sender} = req.query
                db.query(`SELECT participiants.id FROM participiants JOIN chatrooms ON participiants.id_chatroom = chatrooms.id WHERE participiants.id_user = ${id_sender}
                AND chatrooms.id = ${id_chatroom} `,(error, result)=>{
                    if(!error){
                        let id = result.rows[0].id
                        if(req.body.message != null){
                            db.query(`INSERT INTO detail_chat(id_sender,message,timestamp,status) VALUES 
                                (${id},'${req.body.message}',NOW(),'unread')`,(err, res)=>{
                                if(!err){
                                    resolve({
                                        message : 'success',
                                        status : 200,
                                        data : []
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
                        if(req.files != undefined){
                            for(let i=0; i < req.files.length; i++){
                                db.query(`INSERT INTO file(id_sender,type,name) VALUES(${id},'document','${req.files[i].filename}')`,(err)=>{
                                    if(!err){
                                        if(i == req.files.length - 1){
                                            resolve({
                                                message : 'success',
                                                status : 200,
                                                data : []
                                            })
                                        }
                                    }else{
                                        reject({
                                            message : 'failed',
                                            status : 400,
                                            data : []
                                        })
                                    }
                                })
                            }
                        }
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
