const mongoose = require('mongoose')

const Schema = mongoose.Schema
const User = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String },
  background: { type: String },
  phone_number: { type: String, required: true }
})
module.exports = mongoose.model('User', User)
