const db = require('./database')
const queryBuilder = require('./queryBuilder')
const formResponse = require('./formResponse')
const {selectWhere} = queryBuilder

const validation = (req,res,next) =>{
    if(req.params.id != null){
        let where = {id_user : req.params.id} 
        return new Promise((resolve, reject)=>{
            db.query(`${selectWhere('users',where)}`, (error, result)=>{
                if(!error){
                    if(result.rows.length < 1){
                        formResponse({
                            message: `User Not Found`,
                            status: 400
                        },res)
                    }else{
                        next()
                    }
                }else{
                    formResponse({
                        message: `Unknow Error`,
                        status: 400
                    },res)
                }
            })
        })
    }else{
        formResponse({
            message: `Unknow`,
            status: 400
        },res)
    }
    
}

module.exports = validation