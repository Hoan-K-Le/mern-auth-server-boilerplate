
const db = require('../../models')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

// POST /users/register -- CREATE a new user
router.post('/register', async (req,res) => {
    try {   
        // check if the user exist already
        const findUser = await db.User.findOne({
            email: req.body.email
        })
        // disallow users from registering twice
        if (findUser) {
            // stop the route and send a response saying the user exist
            return res.status(400).json({ msg: 'email exist already :( try a new one!'})
        }

        // hash the user's password
        const password = req.body.password
        const saltRound = 12
        const hashedPassword = await bcrypt.hash(password, saltRound)
        // create a new user with the hashed password
        const newUser = new db.User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()
        // sign the user in by sending a valid jwt back
        // crreate the jwt payload 
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id
        }
        // sign the token and send it back
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }) // expires in one day
        res.json({ token })
    } catch (err) {
        console.log('oh no there is an error', err)
        // handle validation errors
        if (err.name === 'ValidationError') {
            res.status(400).json({ msg: err.message })
        } else {
            // handle all other errors
            res.status(500).json({msg: 'server error 500 '})
        }
    }
})
// POST /users/login -- validate login credentials
router.post('/login', async (req,res) => {
    try {
        // all the data will come in on the req.body
        
        // try to find the user in the database
        const findLogin = await db.User.findOne({
            email: req.body.email        
        })
        // if the user is not found, send a status of 400 and let the user know login failed
        if(!findLogin) {
            return res.status(400).json({msg: 'incorrect email or password'})
        }
        // check if the supplied password matches the hash in the db
        const password = req.body.password
        const matchPassword = await bcrypt.compare(password, findLogin.password)
        // console.log(matchPassword)
        // if they do not match, return and let the usuer know that login has failed
        if(!matchPassword) {
            return res.status(400).json({msg: 'Password does not match'})
        }

        // create a jwt payload 
        const payload = {
            name: findLogin.name,
            email: findLogin.email,
            id: findLogin.id 
        }
        // sign the jwt and send it back 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.json({token})
        
        
    } catch (err) {
        console.log('error', err)
        // do not forget to handle your errors
            res.status(500).json({msg: 'Server has an error 500'})    
    }
        
        



})
// GET /auth-locked -- checks users credentials and only sends back priviledge information if the user is logged in properly
router.get('/auth-locked', authLockedRoute, (req,res) => {
    console.log('current user is:', res.locals.user)
    res.json({ msg: 'welcome to the secret Auth-locked route' })
})
module.exports = router 