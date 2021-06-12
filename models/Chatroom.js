const db = require('../helpers/database')
// const config = require('../helpers/queryBuilder')
// const table = 'room_chat'

const Chatting = {
    
    getChatlist : (req)=>{
        return new Promise((resolve, reject)=>{
            let data = []
            if(req.params.id !=null || req.params.id !=undefined){
                const id_user = req.params.id
                db.query(`SELECT * FROM (SELECT A.id AS user1, B.id AS user2, A.id_user AS id_user1, B.id_user AS id_user2, 
                    A.id_chatroom AS chatroom FROM participiants A, participiants B WHERE A.id_user != B.id_user AND A.id_chatroom = B.id_chatroom)AS a
                    JOIN chatrooms ON a.chatroom = chatrooms.id JOIN
                    (SELECT detail_chat.message AS message, detail_chat.timestamp AS message_timestamp, detail_chat.id AS id_message, detail_chat.status AS status_message,
                    participiants.id_chatroom AS chatroom, participiants.id_user,
                    files.name_file AS file, files.id AS id_file
                    FROM detail_chat JOIN 
                    participiants ON detail_chat.id_sender = participiants.id
                    LEFT JOIN files ON detail_chat.id = files.id_detail
                    WHERE detail_chat.timestamp IN(SELECT MAX(detail_chat.timestamp) FROM detail_chat JOIN participiants ON detail_chat.id_sender = participiants.id
                    GROUP BY participiants.id_chatroom))AS b ON chatrooms.id = b.chatroom
                    JOIN (SELECT COUNT(detail_chat.status) AS counting,chatrooms.id AS chatroom FROM detail_chat JOIN participiants ON detail_Chat.id_sender = participiants.id
                    JOIN chatrooms ON participiants.id_chatroom = chatrooms.id WHERE detail_chat.status = 'unread' GROUP BY chatrooms.id) AS c ON chatrooms.id = c.chatroom
                    JOIN users ON a.id_user2 = users.id LEFT JOIN
                    contacts ON a.id_user2 = contacts.relation
                    WHERE a.id_user1 = ${id_user} ORDER BY b.message_timestamp DESC`,(error, result)=>{
                    if(!error){
                        resolve({
                            message : 'success',
                            status : 200,
                            data : result.rows
                        })
                    }else{
                        reject({
                            message : `Error`,
                            status : 500,
                            data : []
                        })
                    }
                })
            }else{
                reject({
                    message : `Error`,
                    status : 400,
                    data : []
                })
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
        })
    }
}

module.exports = Chatting