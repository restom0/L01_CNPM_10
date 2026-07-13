import express from 'express'
import { UserController } from '../controllers/UserController.js'
const UserRouter = express.Router()

UserRouter.post('/login', UserController.login)
UserRouter.post('/register', UserController.register)
UserRouter.post('/logout', UserController.logout)
export { UserRouter }
