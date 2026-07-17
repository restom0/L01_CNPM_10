import express from 'express'
import { LogController } from '../controllers/LogController.js'
const LogRouter = express.Router()

/**
 * @openapi
 * /logs:
 *   get:
 *     summary: Get logs by date
 *     tags:
 *       - Logs
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Logs recorded on requested UTC day.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
LogRouter.get('/', LogController.getDataOnDate)
export { LogRouter }
