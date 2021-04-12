const userRoute = require('./user')
const contactRoute = require('./contact')
const chatRoute = require('./chat')

const app = (route, prefix) => {
    route.use(`${prefix}/users`, userRoute)
    route.use(`${prefix}/contacts`, contactRoute)
    route.use(`${prefix}/chats`, chatRoute)
}


module.exports = app