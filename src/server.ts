import express from 'express'
import dotenv from 'dotenv'
import { userRoutes } from './routes'

dotenv.config()

const app = express()
const port = process.env.PORT || 3333

app.use(express.json())

app.use('/users', userRoutes)

app.listen(port, () => console.log('HTTP Server Running'))
