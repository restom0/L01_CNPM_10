import express from 'express'
import { UserController } from '../controllers/UserController.js'
const UserRouter = express.Router()

/**
 * @openapi
 * openapi: 3.0.0
 * info:
 *   title: Smart Garden API
 *   version: 1.0.0
 *   description: Express API for users, sensors, logs, and water pump control.
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 *     MessageResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: string
 *         message:
 *           type: string
 *     FeedValue:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     SensorRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userID:
 *           type: string
 *         data:
 *           type: number
 *         Date:
 *           type: string
 *           format: date-time
 *     Timer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         startTime:
 *           type: string
 *           example: "06:00"
 *         endTime:
 *           type: string
 *           example: "06:15"
 */

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login succeeds and token is returned plus set in cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 api_token:
 *                   type: string
 *       400:
 *         description: Missing or invalid credentials.
 *       404:
 *         description: Username or password is incorrect.
 */
UserRouter.post('/login', UserController.login)

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - mqttUsername
 *               - aioKey
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               mqttUsername:
 *                 type: string
 *               aioKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: User account created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Missing, invalid, or duplicate account data.
 */
UserRouter.post('/register', UserController.register)

/**
 * @openapi
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Token cookie cleared.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
UserRouter.post('/logout', UserController.logout)
export { UserRouter }
