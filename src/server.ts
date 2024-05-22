import express from 'express'
import dotenv from 'dotenv'
import { userRoutes } from './routes'
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()
const port = process.env.PORT || 3333

app.use(express.json())

app.use('/users', userRoutes)

app.use(errorHandler)

app.listen(port, () => console.log('HTTP Server Running'))
