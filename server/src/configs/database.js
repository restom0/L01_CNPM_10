import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
export const DATABASE_CONFIG = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
  // other properties
  // other properties
}
