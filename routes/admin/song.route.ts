import express from "express";
const router=express.Router();
import * as controller from "../../controller/admin/song.controller"
import multer from "multer"
import * as uploadCoud from "../../middlewares/admin/uploadCloud.midleware"
const upload=multer();
router.get("/",controller.index)

router.get("/create",controller.create)

router.post("/create",upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),uploadCoud.uploadFields,controller.createAndSave)

router.get('/edit/:id',controller.edit)

router.patch("/edit/:id",upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),uploadCoud.uploadFields,controller.editt)


export const song =router