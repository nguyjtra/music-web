import express,{Express,Request,Response } from "express";

import dotenv from "dotenv";
import {systemConfig} from "./config/system"
var bodyParser = require('body-parser')


import {connectDatabase} from "./config/database"
dotenv.config();
connectDatabase();

import Topic from "./models/topic.model";


import {routeApiAdmin} from "./routes/admin/index.route"
import { routeApi } from "./routes/client/index.route";
import path from "path";

const app:Express=express();

const port:number|string=process.env.PORT||3000;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))

app.set("views",`${__dirname}/views`)

app.set("view engine","pug")

app.use('/tinymce',express.static(path.join(__dirname,'node_modules','tinymce')))

// app.get('/topics',async(req:Request,res:Response)=>{

//     const topic=await Topic.find({
//         deleted:false
//     })
//     console.log(topic)
//     res.render('client/pages/topics/index')

// })
app.locals.prefixAdmin = systemConfig.prefixAdmin;
routeApi(app)
routeApiAdmin(app)

app.listen(port,()=>{
    
    console.log(`app listening on port ${port}`)
})