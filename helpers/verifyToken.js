const jwt = require('jsonwebtoken');
const formResponse = require('./formResponse');

const verifyToken = (req, res, next) => {
    const bearerToken = req.header('user-token')
    if (!bearerToken) {
        formResponse({
            message: `Resource not Found`,
            status: 404,
        }, res)
    }else{
        jwt.verify(bearerToken, process.env.SECRET_KEY, function (err, decoded) {
            if (!err) {
                if(decoded.type == 'basic') next()
                else if(decoded.type == 'admin') next()
                else if (decoded.id == req.params.id_user) next()
                else formResponse({
                    message: `Forbidden`,
                    status: 403
                }, res)
            } else {
                formResponse({
                    message: `${err.message},${bearerToken}`,
                    status: 400,
                }, res)
            }
        });
    }
}


module.exports = verifyToken