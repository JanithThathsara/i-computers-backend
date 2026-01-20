import express from 'express'
import mongoose from 'mongoose'
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import authorizeUser from './lib/jwtMiddleware.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI).then(
    ()=> {
        console.log("MongoDB Connected")
    }
).catch(
    ()=>{
        console.log("MongoDB Connection Failed")
    }
)

const app = express()

app.use(cors())


app.use(express.json()) // Middleware to parse JSON request bodies

//token and authorizeUser 
app.use(authorizeUser)

app.use("/api/users", userRouter)

app.use("/api/products", productRouter)

app.listen(3000,
    ()=>{
        console.log("Server is running on port 3000")
    }
)