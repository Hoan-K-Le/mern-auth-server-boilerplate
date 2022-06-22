const jwt = require('jsonwebtoken')

//  tokens that are not verified will throw an error to the catch
try {
    // create a jwt 'payload' (the info that you want to encode in the token)
    // user data from the db
    const payload = {
        name: 'Billy boi',
        email: 'billy@shoota.com',
        // NO PASSWORD
        id: 'hi I am the user\'s id'
    }

    // sign and encode our jwt payload
    // jwt.sign(data to encode, secret to sign with, options object)
    const token = jwt.sign(payload, 'my super duper big secret', { expiresIn: 60 * 100 }) 
    console.log(token)

    const decode = jwt.verify(token, 'my super duper big secret')
    console.log('decoded payload:', decode)

} catch(err) {
    console.log('jwt err', err)
}