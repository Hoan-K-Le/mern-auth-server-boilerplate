// require package
require('dotenv').config()
require('./models') // connect to the db
const express = require('express')
const cors = require('cors')
// app config/middlewares
const app = express()
const PORT = 8000
app.use(cors())
app.use(express.json()) // json req.bodies

// routes and controllers
app.get('/', (req,res) => {
    res.json({ msg: 'welcome to the backend! its good to be back' })
})




// listen on a port
app.listen(PORT, () => {
    console.log(`listening to PORT ${PORT}`)
})