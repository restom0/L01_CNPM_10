const mongoose = require('mongoose')
require('dotenv').config()
const connect = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://' + process.env.USERNAME_KEY + ':' + process.env.PASSWORD_KEY + '@cluster0.lcj2oyv.mongodb.net/'
    )
    console.log('Connect success')
  } catch (error) {
    console.log('Connect failed')
  }
}
module.exports = { connect }
