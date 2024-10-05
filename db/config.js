const mongose = require('mongoose')

const mon = mongose.connect(`mongodb+srv:${process.env.DATABASE}`)
.then(res=>console.log('connected'))
.catch(err=>console.log(err))

module.exports = mon