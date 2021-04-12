require('dotenv').config()//import dotenv
const { Client } = require('pg') //penghubung dengan pgadmin

const db = new Client({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
})

db.connect().then((res)=>{
    console.log('Connection success')
}).catch((err)=>{
    console.log('Connection failed', err)
})

module.exports=db