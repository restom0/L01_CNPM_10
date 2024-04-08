import { LogModel } from '../models/Logs.js'

const getDataOnDate = async (date, id) => {
  const start = new Date(date)
  start.setDate(start.getDate() + 1)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return await LogModel.find({
    userId: id,
    date: {
      $gte: start,
      $lte: end
    }
  }).exec()
}
export const LogService = {
  getDataOnDate
}
