const db = require('../helpers/database')
const config = require('../helpers/queryBuilder')
const table = 'users'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { resolve } = require('path')
const {orWhere,select,orderBy,limitOffset,selectWhere,deleted, selectLike} = config


const userModel = {
    getAllUser : (req) =>{
            return new Promise((resolve,reject)=>{
                const newdata = {
                    limit : req.query.limit ?? 2,
                    offset : req.query.offset ?? 1
                }
                const {limit,offset} = newdata
                db.query(`${select(table)} 
                          ${orderBy('id_user')}
                          ${limitOffset(limit, (offset-1)*limit)}`, 
                (err, result)=>{
                    if(!err){
                        resolve({
                            message : 'get all user success',
                            statusCode : 200,
                            data : result.rows
                        })
                    }else{
                        reject({
                            message : 'get all user failed',
                            statusCode : 500,
                            data :[]
                        })
                    }
                })
            })
    },
    registerUser:(req)=>{
        let phone = {phone : req.body.phone}
        let email = {email : req.body.email}
        return new Promise((resolve, reject)=>{
            db.query(`${selectWhere(table, phone)}
                    ${orWhere(email)}`, 
            (err, result)=>{
                if(!err){
                    if(result.rows.length > 0){
                        reject({
                            message : `data is exist`,
                            statusCode : 200
                        })
                    }else{
                        if(phone == null || email == null){
                            reject({
                                message : `Phone or email is empty`,
                                statusCode : 400
                            })
                        }else{
                            let newBody = {
                                phone : req.body.phone,
                                email : req.body.email,
                                username : req.body.username?? req.body.phone,
                                password : req.body.password,
                                level : req.body.level ?? 'basic',
                                bio : req.body.bio ?? 'Iam Here ! '
                            }
                            let {phone,email,password,level,bio,username} = newBody
                            db.query(`INSERT INTO users(${Object.keys(newBody)}) VALUES('${phone}','${email}','${username}','${password}','${level}','${bio}')`, (error)=>{
                                if(!error){
                                    resolve({
                                        message : `Data has been registered`,
                                        statusCode : 200
                                    })
                                }else{
                                    reject({
                                        message : `Data failed to registered ${error}`,
                                        statusCode : 500,
                                        data : error
                                    })
                                }
                            })
                        }
                    }
                }else{
                // error handled
                    reject({
                        message : `Error ${err}`,
                        statusCode : 400,
                        data : err
                    })
                }
            })
        })
    },
    loginUser : (req)=>{
        const { email, password } = req.body
        return new Promise((resolve, reject) => {
            const where = {email : email}
            db.query(`${selectWhere(table, where)}`, (err, result) => {
                if (!err) {
                    if (result?.rows?.length < 1) {
                        reject({
                            message: `wrong email/password`,
                            status: 400,
                        })
                    }else {    
                        bcrypt.compare(password, result.rows[0].password, function(error, res) {
                            if(!error) {
                                if(!res) {
                                    reject({
                                        message: `wrong email/password`,
                                        status: 400
                                    })
                                }else {
                                    const {id_user, phone, name, level} = result?.rows[0]
                                    const processToken = {
                                        "id": id_user,
                                        "phone": phone,
                                        "name": name,
                                        "level": level ?? 'basic'
                                      }
                                    jwt.sign(processToken, process.env.SECRET_KEY, function(err, token) {
                                        if(!err) {
                                            db.query(`UPDATE users SET status = 'online'  WHERE id_user = '${id_user}'`,(messageError)=>{
                                                if(!error){
                                                    resolve({
                                                        message: `login successfully`,
                                                        status: 200,
                                                        data:{
                                                            token : token,
                                                            id_user : result.rows[0].id_user,
                                                            status : 'online'
                                                        }
                                                    })
                                                }else{
                                                    reject({
                                                        message: messageError,
                                                        status: 200,
                                                        data: encode
                                                    }) 
                                                }
                                            })
                                        }
                                    });
    
                                }
                            }else{
                                reject({
                                    message: `Error Code 500`,
                                    status: 500,
                                })
                            }
                        });
                    }
                } else {
                    reject({
                        message : `Error Code 500`,
                        status : 500
                    })
                }
            })
        })
    },
    updateUser : (req) =>{
        const where = {id_user : req.params.id}
        return new Promise((resolve, reject)=>{
            db.query(`${selectWhere(table,where)}`, (error, result)=>{
                if (result.rows.length < 1) {
                    reject({
                        message: `user not found`,
                        status: 400,
                    })
                }else{
                    if(req.file !== undefined){
                        if(result.rows[0].image != null){
                            fs.unlink(`public/${result.rows[0].image}`, (err => {
                                if (err){
                                    reject({
                                        message : `Error when updating image profil${err}`,
                                        status : 400
                                    })
                                }
                            }));
                        }
                    }
                    let newBody = {
                        username    : req.body.username?? result.rows[0].username, //initial value/default value (optional chaining) atau bisa juga dengan (nullish coalescing)
                        phone       : req.body.phone?? result.rows[0].phone,
                        email       : req.body.email?? result.rows[0].email,
                        password    : (req.body.password != null || req.body.password != '')? req.body.password : result.rows[0].password,
                        avatar      : (!req.file || req.file === undefined || req.file== null) ? result.rows[0].image : `uploads/images/${req.file.filename}`,
                        bio         : req.body.bio?? result.rows[0].bio,
                        status      : req.body.status?? 'online'
                    }
                    const {username,phone,avatar,email,bio,status,password} = newBody
                    db.query(`UPDATE users SET username = '${username}', phone = '${phone}',image = '${avatar}', email = '${email}', bio = '${bio}', status = '${status}',password = '${password}' WHERE id_user = '${req.params.id}'`, (errorUpdate) => {
                        if (!errorUpdate) {
                                resolve({
                                    message: `Update data success`,
                                    status: 200,
                                })
                            } else {
                                reject({
                                    message:`${errorUpdate}`,
                                    status: 500,
                                })
                            }
                        })
                }
                })
            })

    },
    deleteUser : (req) =>{
        const where = {id_user : req.params.id}
        return new Promise((resolve, reject)=>{
            db.query(`${deleted(table, where)}`, (err)=>{
                if(!err){
                    resolve({
                        message : 'Data success deleted',
                        status : 200
                    })
                }else{
                    reject({
                        message : 'Data failed to delete',
                        status : 400
                    })
                }
            })
        })
    },
    searchUser : (req)=>{
        if(req.query.email != null || undefined){
            const where = {email : req.query.email}
            return new Promise((resolve, reject)=>{
                const newBody = {
                    limit : req.query.limit ?? 1,
                    offset : req.query.offset ?? 1,
                }
                const {limit, offset} = newBody
                db.query(`${select(table)}
                    ${selectLike(where)} 
                    ${limitOffset(limit, offset)}`,
                (err, result)=>{
                    if(!err){
                        resolve({
                            message : `success get data with pagination`,
                            status : 200,
                            data : result.rows
                        })
                    }else{
                        reject({
                            message : `failed get data`,
                            status : 400,
                            data : err
                        })
                    }
                })
            })
        }
    },
    sendFiles : (req) =>{
        return new Promise((resolve, reject)=>{
            
        })
       /*  req.file.map((element)=>{
            console.log(element.filename)
        }) */
    }
}

module.exports = userModel