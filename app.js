import express from 'express'
import dotenv from 'dotenv'
import connectDatabase from './config/database.js';
import cors from 'cors'
import errorMiddleware from './middlewares/error.js';
import cookieParser from 'cookie-parser'

const app = express();

//Config
dotenv.config({path:"config/config.env"})
connectDatabase();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//Routes
import userRoutes from './routes/userRoute.js'
app.use("/api/v1",userRoutes)
import productRoutes from './routes/productRoute.js'
app.use("/api/v1", productRoutes)
import orderRoute from './routes/orderRoute.js'
app.use("/api/v1", orderRoute)

export default app;

app.use(errorMiddleware)