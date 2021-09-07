const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config();
const cors = require('cors')
const httpServer = require('http').createServer(app);
const whitelist = ['http://localhost:3000','http://localhost:5024','http://localhost:3001']
const options = {
  cors: {
    origin: [...whitelist],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  }
}
const io = require("socket.io")(httpServer, options);
//routing imports
const router = require('./route')

let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  }
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(cors(corsOptions))

router(app,'/api/v1')
app.get('/api/v1', (req, res) => {
  res.send('Hello World!')
})

io.on("connection", socket =>{
  socket.on("join", (data)=>{
    socket.join(data.roomId)
  });
  socket.on("send message", (data)=>{
    app.get('/api/v1/')
    io.to(data.roomId).emit("message", data.updated)
  });
})

app.get('*', (req, res) => {
  res.status(404).send({
    message: `Resource Not Found`,
    statusCode: 404,
  })
})
// end routing

httpServer.listen(process.env.Server_PORT, () => {
  console.log(`Server app listening at http://localhost:${process.env.SERVER_PORT}`)
})