import express from "express";
const router=express.Router();
import * as controller from "../../controller/client/topic.controller"

router.get("/",controller.index)


export const topicRoute =router