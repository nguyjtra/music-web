import express from "express";
const router=express.Router();
import * as controller from "../../controller/admin/topic.controller"

router.get("/",controller.index)


export const topic =router