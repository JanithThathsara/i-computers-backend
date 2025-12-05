import express from 'express'
import mongoose from 'mongoose'
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import authorizeUser from './lib/jwtMiddleware.js'


const mongoURI = "mongodb+srv://admin:1234@cluster0.8v0ywjh.mongodb.net/"

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


app.use(express.json()) // Middleware to parse JSON request bodies

//token and authorizeUser 
app.use(authorizeUser)

app.use("/users", userRouter)

app.use("/products", productRouter)

app.listen(3000,
    ()=>{
        console.log("Server is running on port 3000")
    }
)