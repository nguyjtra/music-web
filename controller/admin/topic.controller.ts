import { Request, Response } from "express";
import Song from "../../models/songs.model"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"
export const index=async(req:Request,res:Response)=>{

    const topic=await Topic.find({
        deleted:false
    })
    res.render('admin/pages/topic/index',{
        pageTitle:"Topics",
        topics:topic
    });
}