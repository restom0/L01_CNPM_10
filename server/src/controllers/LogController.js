import { LogService } from '../services/LogService.js'

/**
 * Handle GET /logs and return logs for requested date.
 *
 * @param {import('express').Request} req - Request with date query and auth user.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const getDataOnDate = async (req, res) => {
  try {
    const { date } = req.query
    const data = await LogService.getDataOnDate(date, req.user.id)
    res.json(data)
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

export const LogController = {
  getDataOnDate
}
