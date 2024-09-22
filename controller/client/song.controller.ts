import { Response, Request } from "express"
import Song from "../../models/songs.model"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"
export const list=async(req:Request,res:Response)=>{

    const slugTopic:string=req.params.slugTopic

    const topicSong=await Topic.findOne({
        slug:slugTopic,
        deleted:false,
        status:"Available"
    })

    const song= await Song.find({
        deleted:false,
        topicId:`${topicSong.id}`,
        status:"active"
    }).select("title avatar singerId like slug")

    for(const item of song){
        const singerName=await Singer.findOne({
            _id:item.singerId
        }).select("fullName")
         item[`singerFullName`]=singerName[`fullName`]
    }

    res.render('client/pages/songs/list',{
        pagetitle:`${topicSong.title}`,
        songs:song
    })
}