const e = require('express')
const db = require('../helpers/database')
// const config = require('../helpers/queryBuilder')
// const table = 'room_chat'

const Chatting = {
    getChatting : (req)=>{
        return new Promise((resolve, reject)=>{
            if(req.params.id !=null || req.params.id !=undefined){
                let parameter = {
                    id_user : req.params.id,
                    id_friend : req.query.id_friend
                }
                const {id_user, id_friend} = parameter
                db.query(`SELECT * FROM room_chat JOIN personal ON room_chat.id_chat = personal.id_room WHERE personal.user1 IN(${id_user},${id_friend})
                AND personal.user2 IN(${id_user},${id_friend})`,(error, result)=>{
                    if(!error){
                        if(result.rows.length > 0){
                            db.query(`SELECT * FROM detail_chat JOIN room_chat ON detail_chat.id_chat = room_chat.id_chat WHERE room_chat.id_chat = ${result.rows[0].id_chat}`,(err, res)=>{
                                if(!err){
                                    resolve({
                                        message : `success get data`,
                                        status : 200,
                                        data : res.rows
                                    })
                                }else{
                                    reject({
                                        message : `Error`,
                                        status : 400,
                                        data : []
                                    })
                                }
                            })
                        }
                    }else{
                        reject({
                            message : `Error`,
                            status : 200,
                            data : []
                        })
                    }
                })
            }else{

            }
        })
    },
    getChattingById : (req)=>{
        return new Promise((resolve, reject)=>{
            if(req.params.id !=null || req.params.id !=undefined){
                if(req.query.id_friend != null || req.query.id_friend != undefined){
                    db.query(`SELECT * FROM contacts RIGHT JOIN users ON contacts.friend = users.id_user
                        FULL JOIN personal ON users.id_user = personal.user1
                        FULL JOIN room_chat ON participiants.id_chat = room_chat.id_chat
                        WHERE contacts.friend=${req.query.id_friend} AND contacts.id_account = ${req.params.id}`, (err, res)=>{
                            if(!err){
                                if(res.rows.length < 1){
                                    reject({
                                        message : 'not have contact please invite your friend',
                                        statusCode : 400,
                                        data : []
                                    })
                                }else{
                                    resolve({
                                        message : 'success get contacts',
                                        statusCode : 200,
                                        data : res.rows
                                    })
                                }
                            }else{
                                reject({
                                    message : `Error`,
                                    statusCode : 500,
                                    data : err
                                })
                            }
                      })
                }
            }else{
                reject({
                    message : 'Forbidden access',
                    statusCode : 500,
                    data :[]
                })
            }
        })
    },
    sendChat : (req)=>{
        return new Promise((resolve, reject)=>{
            if(req.params.id != null && req.query.id_friend != null){
                db.query(`SELECT * FROM personal WHERE user1 IN(${req.params.id},${req.query.id_friend}) AND user2 IN(${req.params.id},${req.query.id_friend})`,(error, result)=>{
                    if(!error){
                        if(result.rows.length > 0){
                            db.query(`INSERT INTO detail_chat(id_chat, sender, message, status) VALUES(${result.rows[0].id_room}, ${req.params.id}, '${req.body.message}', 'unread')`,(err)=>{
                                if(!err){
                                    resolve({
                                        message: 'success send message',
                                        status : 200,
                                        data :[]
                                    })
                                }else{
                                    reject({
                                        message: `failed send message ${err}`,
                                        status : 400,
                                        data : [err.rows]
                                    })
                                }
                            })
                        }else{
                            db.query(`INSERT INTO room_chat(type) VALUES('personal') RETURNING id_chat`,(err, res)=>{
                                if(!err){
                                    let id_room = res.rows[0].id_chat
                                    db.query(`INSERT INTO personal (id_room, user1, user2, date_created) VALUES(${id_room},${req.params.id},${req.query.id_friend},NOW())`,(err1)=>{
                                        if(!err1){
                                            db.query(`INSERT INTO detail_chat(id_chat, sender, message, status) VALUES(${id_room},${req.params.id},'${req.body.message}','unread')`,(err2, res2)=>{
                                                if(!err2){
                                                    resolve({
                                                        message: 'success send message',
                                                        status : 200,
                                                        data :[]
                                                    })
                                                }else{
                                                    reject({
                                                        message: 'failed send message',
                                                        status : 400,
                                                        data : [err2.rows]
                                                    })
                                                }
                                            })
                                        }else{
                                            reject({
                                                message : 'failed to adding member',
                                                status : 400,
                                                data : [err1.rows]
                                            })
                                        }
                                    })
                                }else{
                                    reject({
                                        message : 'failed to create channel',
                                        status : 400,
                                        data : [err.rows]
                                    })
                                }
                            })
                        }
                    }else{

                    }
                })
            }
           /*  if(req.query.id_chat != null){
                db.query(`INSERT INTO detail_chat VALUES('','${req.query.id_chat}','${req.params.id}')`,(err, res)=>{
                    if(!err){
                        resolve({
                            message : 'success get contacts',
                            statusCode : 200,
                            data : res.rows
                        })
                    }
                })
            }else{
                db.query(`SELECT * FROM room_chat JOIN participiants ON room_chat.id_chat = particpians.id_chat
                WHERE participiants.id_member = '${req.params.id}' OR participians.id_member = ${req.query.id_friend} GROUP BY room_chat.id_chat`,(error,result)=>{

                })
               db.query(`INSERT INTO room_chat VALUES('','','personal') RETURNING id_chat`, (err, res)=>{
                    if(!err){
                        let id_chat = res.rows[0].id_chat;
                        db.query(`INSERT INTO detail_chat VALUES('','${id_chat}','${req.params.id}','${req.body.message}','unread')`, (error1)=>{
                            if(!error1){
                                db.query(`INSERT INTO participiants VALUES('','${id_chat}','${req.query.id_friend}')`, (error2)=>{
                                    if(!error2){
                                        resolve({
                                            message : 'success send message',
                                            statusCode : 200,
                                            data : []
                                        })
                                    }else{
                                        reject({
                                            message : 'failed send message2',
                                            statusCode : 400,
                                            data : []
                                        })
                                    }
                                })
                            }else{
                                reject({
                                    message : 'failed send message1',
                                    statusCode : 400,
                                    data : []
                                })
                            }
                        })
                    }else{
                        reject({
                            message : 'failed to seng message',
                            statusCode : 500,
                            data : [req.body.message]
                        })
                    }
               })
            } */
        })
    }
}

module.exports = Chatting