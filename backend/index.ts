import express from 'express'
import cors from "cors"
import mongoose from "mongoose"
import bodyparser from "body-parser"
import UserRoutes from "./src/routes/UserRoutes"
import dotenv from 'dotenv';

dotenv.config()
const app = express()
const port  = 3000

app.use(cors())
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())


const MONGODB_URL = process.env.MONGO_URL || ""

mongoose.connect(MONGODB_URL,{
     
})
.then(()=>{
    console.log("connected mongo db")
})
.catch((err)=>{
    console.log("error with connecttion",err)
})


app.listen(port,()=>{
    console.log("server is running on",port)
})

app.use("/",UserRoutes)
