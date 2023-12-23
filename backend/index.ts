import express from 'express'
import cors from "cors"
import mongoose from "mongoose"
import bodyparser from "body-parser"
import UserRoutes from "./src/routes/UserRoutes"
import PostRoutes from "./src/routes/PostRoutes"
import FollowRoutes from "./src/routes/FollowRoutes"
import dotenv from 'dotenv';

dotenv.config()
const app = express()
const port  = 3000

app.use(cors())
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

mongoose.connect(process.env.MONGO_URL || "",{
     
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
app.use("/posts",PostRoutes)
app.use("/followers",FollowRoutes)
