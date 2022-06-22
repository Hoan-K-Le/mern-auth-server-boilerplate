const db = require('./models')

// testing user CREATE
db.User.create({
    name: 'Test Boi',
    email: 'test@boi.com',
    password: '123'
    })
    .then(user => {
        console.log('whatup test boi', user)
    })
    .catch(console.warn)