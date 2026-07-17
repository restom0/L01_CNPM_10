import express from 'express'
import { SensorController } from '../controllers/SensorController.js'
const SensorRouter = express.Router()

/**
 * @openapi
 * /sensors/humid:
 *   get:
 *     summary: Get latest humidity value
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest humidity value with threshold status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 needNoti:
 *                   type: boolean
 *                 upper:
 *                   type: number
 *                 lower:
 *                   type: number
 *                 data:
 *                   $ref: '#/components/schemas/FeedValue'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/humid', SensorController.getHumidityThreshold, SensorController.getLastHumidityValue)

/**
 * @openapi
 * /sensors/light:
 *   get:
 *     summary: Get latest light value
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest light value with threshold status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 needNoti:
 *                   type: boolean
 *                 upper:
 *                   type: number
 *                 lower:
 *                   type: number
 *                 data:
 *                   $ref: '#/components/schemas/FeedValue'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/light', SensorController.getLightThreshold, SensorController.getLastLightValue)

/**
 * @openapi
 * /sensors/temp:
 *   get:
 *     summary: Get latest temperature value
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest temperature value with threshold status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 needNoti:
 *                   type: boolean
 *                 upper:
 *                   type: number
 *                 lower:
 *                   type: number
 *                 data:
 *                   $ref: '#/components/schemas/FeedValue'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/temp', SensorController.getTemperatureThreshold, SensorController.getLastTemperatureValue)

/**
 * @openapi
 * /sensors/moisture:
 *   get:
 *     summary: Get latest soil moisture value
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest moisture value with threshold status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 needNoti:
 *                   type: boolean
 *                 upper:
 *                   type: number
 *                 lower:
 *                   type: number
 *                 data:
 *                   $ref: '#/components/schemas/FeedValue'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/moisture', SensorController.getMoistureThreshold, SensorController.getLastMoistureValue)

/**
 * @openapi
 * /sensors/chart/humid:
 *   get:
 *     summary: Get humidity history
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Humidity records for authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorRecord'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/chart/humid', SensorController.getAllHumidityValue)

/**
 * @openapi
 * /sensors/chart/light:
 *   get:
 *     summary: Get light history
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Light records for authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorRecord'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/chart/light', SensorController.getAllLightValue)

/**
 * @openapi
 * /sensors/chart/temp:
 *   get:
 *     summary: Get temperature history
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Temperature records for authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorRecord'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/chart/temp', SensorController.getAllTemperatureValue)

/**
 * @openapi
 * /sensors/chart/moisture:
 *   get:
 *     summary: Get soil moisture history
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Moisture records for authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorRecord'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/chart/moisture', SensorController.getAllMoistureValue)

/**
 * @openapi
 * /sensors/threshold/humid:
 *   put:
 *     summary: Update humidity thresholds
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: upper
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lower
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Threshold updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid threshold values.
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.put('/threshold/humid', SensorController.updateHumidityThreshold)

/**
 * @openapi
 * /sensors/threshold/light:
 *   put:
 *     summary: Update light thresholds
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: upper
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lower
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Threshold updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid threshold values.
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.put('/threshold/light', SensorController.updateLightThreshold)

/**
 * @openapi
 * /sensors/threshold/temp:
 *   put:
 *     summary: Update temperature thresholds
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: upper
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lower
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Threshold updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid threshold values.
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.put('/threshold/temp', SensorController.updateTemperatureThreshold)

/**
 * @openapi
 * /sensors/threshold/moisture:
 *   put:
 *     summary: Update soil moisture thresholds
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: upper
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lower
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Threshold updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid threshold values.
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.put('/threshold/moisture', SensorController.updateMoistureThreshold)

/**
 * @openapi
 * /sensors/ed:
 *   get:
 *     summary: Calculate latest environmental dryness
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved environmental dryness record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SensorRecord'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/ed', SensorController.getLastEnvironmentValue)

/**
 * @openapi
 * /sensors/chart/ed:
 *   get:
 *     summary: Get environmental dryness history
 *     tags:
 *       - Sensors
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Environmental dryness records for authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorRecord'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
SensorRouter.get('/chart/ed', SensorController.getAllEnvironmentValue)
export { SensorRouter }
