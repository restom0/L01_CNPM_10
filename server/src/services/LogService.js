import { LogModel } from '../models/Logs.js'

/**
 * Get log records for one UTC calendar day and one user.
 *
 * @param {string|Date} date - Day used to build the UTC date range.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<Array<object>>} Log records inside the day.
 */
const getDataOnDate = async (date, id) => {
  const start = new Date(date)
  start.setUTCDate(start.getUTCDate())
  start.setUTCHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setUTCHours(23, 59, 59, 999)
  console.log(new Date(date), start, end)
  return await LogModel.find({
    userID: id,
    Date: {
      $gte: start,
      $lte: end
    }
  }).exec()
}
export const LogService = {
  getDataOnDate
}
