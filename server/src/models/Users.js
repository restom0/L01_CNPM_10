import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const User = new mongoose.Schema({
  _id: ObjectId,
  username: { type: String, required: true },
  password: { type: String, required: true },
  mqttusername: { type: String, required: true },
  AIO_Key: { type: String, required: true }
})
const UserModel = mongoose.model('User', User)
export { UserModel }
