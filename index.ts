import express,{Express,Request,Response } from "express";

import dotenv from "dotenv";

var bodyParser = require('body-parser')


import {connectDatabase} from "./config/database"
dotenv.config();
connectDatabase();

import Topic from "./models/topic.model";

import { routeApi } from "./routes/client/index.route";

const app:Express=express();

const port:number|string=process.env.PORT||3000;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))

app.set("views","./views")

app.set("view engine","pug")

// app.get('/topics',async(req:Request,res:Response)=>{

//     const topic=await Topic.find({
//         deleted:false
//     })
//     console.log(topic)
//     res.render('client/pages/topics/index')

// })

routeApi(app)


app.listen(port,()=>{
    
    console.log(`app listening on port ${port}`)
})