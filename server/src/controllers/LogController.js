import { LogService } from '../services/LogService.js'

const getDataOnDate = async (req, res, next) => {
  try {
    const { date } = req.query
    const data = await LogService.getDataOnDate(date, req.user.id)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export const LogController = {
  getDataOnDate
}
