const db = require('../helpers/database')
const config = require('../helpers/queryBuilder')
const table = 'contacts'
const {orWhere,select,orderBy,limitOffset,selectWhere,deleted,leftJoinTable,selectLike} = config

const contactModel = {
    getAllContacts :(req)=>{
        return new Promise((resolve, reject)=>{
            if(req.query.id != null){
                db.query(`SELECT * FROM ${table} RIGHT JOIN users ON contacts.relation = users.id_user
                         WHERE contacts.id_account
                          = ${req.params.id}`, (err, res)=>{
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
            }else{
                reject({
                    message : 'Forbidden access',
                    statusCode : 500,
                    data :[]
                })
            }
        })
    },
    updateContact : (req)=>{
        return new Promise((resolve, reject)=>{
            if(req.params.id == null){
                reject({
                    message : 'Forbidden access',
                    statusCode : 500,
                    data :[]
                })
            }else{
                if(req.query.id_user == null || req.query.id_user == ''){
                    reject({
                        message :'Error command',
                        statusCode : 403,
                        data :[]
                    })
                }
                db.query(`SELECT * FROM contacts LEFT JOIN users ON contacts.id_account = users.id_user WHERE contacts.id_account = ${req.params.id} AND contacts.relation = ${req.query.id_user}`,(err, res)=>{
                    if(!err){
                        if(res.rows.length < 1){
                            reject({
                                message : 'contact not found',
                                statusCode : 404,
                                data : []
                            })
                        }else{
                            const newBody = {
                                name : req.body.name ?? res.rows[0].username
                            }
                            const{name} = newBody
                            db.query(`UPDATE contacts SET name = '${name}' WHERE friend = '${req.query.id_user}' AND id_user = '${req.params.id}' `, (error, result)=>{
                                if(!err){
                                    resolve({
                                        message : `Update user success`,
                                        statusCode : 200,
                                        data : []
                                    })
                                }else{
                                    reject({
                                        messsage: `Update user failed`,
                                        statusCode : 400,
                                        data : err
                                    })
                                }
                            })
                            
                        }
                    }else{
                        reject({
                            message : 'error get data',
                            statusCode : 400,
                            data : []
                        })
                    }
                })
            }
        })
    },
    searchContacts : (req)=>{
        const where = {key : req.query.key}
        return new Promise((resolve, reject)=>{
            if(req.params.id == null || req.params.id ==''){
                reject({
                    message : 'Forbidden',
                    statusCode : 403,
                    data : []
                })
            }else{
                db.query(`SELECT * FROM contacts JOIN users ON contacts.id_account = users.id_user JOIN  WHERE contacts.name LIKE '%${Object.values(where)}%' OR contacts.phone LIKE '%${Object.values(where)}' AND contacts.id_account = ${req.params.id}`, (err, res)=>{
                    if(!err){
                        if(res.rows.length < 1){
                            reject({
                                message : 'No Result',
                                statusCode : 400,
                                data : []
                            })
                        }else{
                            resolve({
                                message : 'Success get data',
                                statusCode : 200,
                                data : res.rows
                            })
                        }
                    }else{
                        reject({
                            message : 'Error',
                            statusCode : 400,
                            data : err
                        })
                    }
                })
            }
        })
    },
    getContactByIdContact : (req)=>{
       return new Promise((resolve, reject)=>{
            if(req.params.id == null || req.params.id ==''){
                reject({
                    message : 'Forbidden',
                    statusCode : 403,
                    data : []
                })
            }else{
                db.query(`SELECT * FROM contacts RIGHT JOIN users ON contacts.relation = users.id WHERE contacts.relation = '${req.query.id_contact}' AND contacts.id_user = ${req.params.id} OR users.id=`, (err, res)=>{
                    if(!err){
                        if(res.rows.length < 1){
                            reject({
                                message : 'No Result',
                                statusCode : 400,
                                data : []
                            })
                        }else{
                            resolve({
                                message : 'Success get data',
                                statusCode : 200,
                                data : res.rows
                            })
                        }
                    }else{
                        reject({
                            message : 'Error',
                            statusCode : 400,
                            data : err
                        })
                    }
                })
            }
        })
    },
    addContact : (req)=>{
        const where = {id_user : req.params.id}
        return new Promise((resolve, reject)=>{
            if(where !=null){
                const data ={phone : req.body.phone}
                db.query(`${selectWhere('users',data)}`,(error, result)=>{
                if(!error){
                    if(result.rows.length < 1){
                        reject({
                            message : 'phone number is not registered',
                            statusCode : 400
                        })
                    }else{
                        if(req.params.id == result.rows[0].id_user){
                            reject({
                                message : 'Your Acount',
                                statusCode : 200,
                                data : result.rows
                            })
                        }else{
                            db.query(`SELECT * FROM contacts JOIN users ON contacts.id_account = users.id_user WHERE contacts.id_account = ${req.params.id} AND contacts.relation = ${result.rows[0].id_user}`,(err, res) =>{
                                if(!err){
                                    if(res.rows.length > 0){
                                        reject ({
                                            message : 'data is exist',
                                            statusCode : 200,
                                            data : res.rows
                                        })
                                    }else{
                                        const newBody = {
                                            id_account : req.params.id,
                                            name : req.body.name ?? result.rows[0].username,
                                            relation : result.rows[0].id_user
                                        }
                                        const {id_account, name, relation}  = newBody
                                        db.query(`INSERT INTO ${table} (${Object.keys(newBody)}) VALUES(${id_account},'${name}','${relation}')`,(errorMessage, resultMessage)=>{
                                            if(!errorMessage){
                                                resolve({
                                                    message : 'add contact success',
                                                    statusCode : 200,
                                                    data : resultMessage.rows
                                                })
                                            }else{
                                                reject({
                                                    message : `failed add contact`,
                                                    statusCode : 400,
                                                    data : errorMessage
                                                })
                                            }
                                        })
                                    }
                                }else{
                                    reject({
                                        message :'eror unhandled',
                                        statusCode : 400,
                                        data : err
                                    })
                                }
                            })
                        } 
                    }
                }else{
                    reject({
                        message : 'unknow Error 500',
                        statusCode : 500,
                        data : error
                    })
                }
                })
            }
                    
        })
    }
}

module.exports = contactModel