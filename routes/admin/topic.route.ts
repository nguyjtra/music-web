import express from "express";
const router=express.Router();
import * as controller from "../../controller/admin/topic.controller"

router.get("/",controller.index)


router.get('/change-status/:statusChange/:id',controller.changeStatus)

export const topic =router