const bcrypt = require('bcrypt')


const hashTest = async () => {
    try {
        // test hashing
        const password = 'hello'
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // match the hash to a string 
        const matchPasswords = await bcrypt.compare('hello', hashedPassword)
        console.log('do they match?', matchPasswords)
    } catch(err) {
        console.log(err)
    }
}


hashTest()