import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoute'
import userRoutes from './routes/userRoute'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authMiddleware } from './middleware/authMiddleware'
dotenv.config()

const PORT = process.env.PORT
const app = express()

const dbConnectionString = process.env.MONGODB_CONNECTION_STRING
if (dbConnectionString) {
    mongoose.connect(dbConnectionString)
    const connection = mongoose.connection
    
    connection.on('open', () => {
        console.log('Connected to db')
    })
    
    connection.on('err', () => {
        console.log('Connection error')
    })
}

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/user', authMiddleware, userRoutes)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})