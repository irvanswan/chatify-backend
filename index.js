const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))
//routing imports
const router = require('./route')
let whitelist = ['http://localhost:3000','http://localhost:5024','http://localhost:3001']
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  }
}

app.use(cors(corsOptions))

router(app,'/api/v1')
app.get('/api/v1', (req, res) => {
  res.send('Hello World!')
})

app.get('*', (req, res) => {
  res.status(404).send({
    message: `Resource Not Found`,
    statusCode: 404,
  })
})



// end routing

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server app listening at http://localhost:${process.env.SERVER_PORT}`)
})