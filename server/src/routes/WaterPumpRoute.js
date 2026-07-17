import express from 'express'
import { WaterPumpController } from '../controllers/WaterPumpController.js'
const WaterPumpRouter = express.Router()

/**
 * @openapi
 * /waterpumps/auto:
 *   get:
 *     summary: List automatic watering timers
 *     tags:
 *       - Water Pumps
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Timer ranges for authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Timer'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
WaterPumpRouter.get('/auto', WaterPumpController.automaticWatering)

/**
 * @openapi
 * /waterpumps/auto:
 *   post:
 *     summary: Create automatic watering timer
 *     tags:
 *       - Water Pumps
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - endTime
 *             properties:
 *               startTime:
 *                 type: string
 *                 example: "06:00"
 *               endTime:
 *                 type: string
 *                 example: "06:15"
 *     responses:
 *       200:
 *         description: Timer created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid time range.
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 */
WaterPumpRouter.post('/auto', WaterPumpController.createTimer)

/**
 * @openapi
 * /waterpumps/auto/{id}:
 *   put:
 *     summary: Update automatic watering timer
 *     tags:
 *       - Water Pumps
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - endTime
 *             properties:
 *               startTime:
 *                 type: string
 *                 example: "06:00"
 *               endTime:
 *                 type: string
 *                 example: "06:15"
 *     responses:
 *       200:
 *         description: Timer updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid id or time range.
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 *       404:
 *         description: Timer not found.
 */
WaterPumpRouter.put('/auto/:id', WaterPumpController.updateTimer)

/**
 * @openapi
 * /waterpumps/auto/{id}:
 *   delete:
 *     summary: Delete automatic watering timer
 *     tags:
 *       - Water Pumps
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timer deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid timer id.
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 *       404:
 *         description: Timer not found.
 */
WaterPumpRouter.delete('/auto/:id', WaterPumpController.deleteTimer)

/**
 * @openapi
 * /waterpumps/manual/on:
 *   post:
 *     summary: Turn water pump on
 *     tags:
 *       - Water Pumps
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pump turned on.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 *       404:
 *         description: Pump sensor not found.
 */
WaterPumpRouter.post('/manual/on', WaterPumpController.turnOnPump)

/**
 * @openapi
 * /waterpumps/manual/off:
 *   post:
 *     summary: Turn water pump off
 *     tags:
 *       - Water Pumps
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pump turned off.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 *       404:
 *         description: Pump sensor not found.
 */
WaterPumpRouter.post('/manual/off', WaterPumpController.turnOffPump)

/**
 * @openapi
 * /waterpumps:
 *   get:
 *     summary: Get latest water pump state
 *     tags:
 *       - Water Pumps
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest water pump feed value.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/FeedValue'
 *       401:
 *         description: Missing API token.
 *       403:
 *         description: Invalid API token.
 *       404:
 *         description: Pump sensor not found.
 */
WaterPumpRouter.get('/', WaterPumpController.getLastWaterPumpValue)
export { WaterPumpRouter }
