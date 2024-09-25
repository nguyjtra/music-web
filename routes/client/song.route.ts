import express from "express";
const router=express.Router()
import * as controller from "../../controller/client/song.controller"

router.get('/:slugTopic',controller.list)

router.get('/detail/:slug',controller.detail)

router.patch('/like',controller.like)
router.patch('/favorite',controller.favorite)
export const songRoute=router