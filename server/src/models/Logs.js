import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const Log = new Schema({
  _id: ObjectId,
  userID: { type: ObjectId, ref: 'Users', required: true },
  activity: { type: String, required: true },
  Date: { type: Date, required: true }
})
const LogModel = mongoose.model('Logs', Log)

export { LogModel }
