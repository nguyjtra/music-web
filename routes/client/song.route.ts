import express from "express";
const router=express.Router()
import * as controller from "../../controller/client/song.controller"

router.get('/topic/:slugTopic',controller.list)

router.get('/detail/:slug',controller.detail)

router.patch('/like',controller.like)

router.patch('/favorite',controller.favorite)

router.get('/listFavorite',controller.listFavorite)

router.get('/search/:type',controller.sreach)

router.get('/listen/:id',controller.listen)

export const songRoute=router