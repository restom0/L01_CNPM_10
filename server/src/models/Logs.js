import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const Log = new Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'Users', required: true },
  activity: { type: String, required: true },
  date: { type: Date, required: true }
})
const LogModel = mongoose.model('Logs', Log)

export { LogModel }
