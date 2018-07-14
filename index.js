const express     = require('express')
const http        = require('http')
const bodyParser  = require('body-parser')
const morgan      = require('morgan')
const router      = require('./router')
const mongoose    = require('mongoose')

const app         = express()

mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true })

// app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))

router(app)

require('./models/user')

const port        = process.env.PORT || 3050
const server      = http.createServer(app)
server.listen(port, () => {
  console.log('server running on port: '+port)
})
