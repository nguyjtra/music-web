import express from "express";
const router=express.Router();
import * as uploadCoud from "../../middlewares/admin/uploadCloud.midleware"

import multer from "multer"

const upload=multer()

import * as controller from "../../controller/admin/upload.controller"

router.get("/",upload.single("file"),uploadCoud.uploadSingle,controller.index)


export const uploadRouter =router
