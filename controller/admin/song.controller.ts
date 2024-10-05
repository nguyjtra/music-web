import { Request, Response } from "express";
import Song from "../../models/songs.model"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"
import exp from "constants";
import { systemConfig } from "../../config/system";
export const index=async(req:Request,res:Response)=>{

    const song=await Song.find({
        deleted:false
    })
    res.render('admin/pages/song/index',{
        pageTitle:"Topics",
        songs:song
    });
}

export const create=async(req:Request,res:Response)=>{
    const topic=await Topic.find({
        deleted:false
    }).select("title")
    const singer=await Singer.find({
        deleted:false
    }).select("fullName")
    res.render("admin/pages/song/creat",{
        pageTitle:"Add new ",
        topics:topic,
        singers:singer
    })
}

export const createAndSave=async(req:Request,res:Response)=>{
    if(req.body.avatar){
        req.body.avatar=req.body.avatar[0]
    }
    if(req.body.audio){
        req.body.audio=req.body.audio[0]
    }
    const song=new Song(req.body);
    await song.save()
    res.redirect(`/${systemConfig.prefixAdmin}`)

}