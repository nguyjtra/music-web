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

export const detail=async(req:Request,res:Response)=>{
    const slug:string=req.params.slug
    const detail=await Song.findOne({
        slug:slug,
        deleted:false
    })
     const singer=await Singer.findOne({
        _id:detail.singerId
     }).select(`fullName `)


     const topic=await Topic.findOne({
        _id:detail.topicId
     }).select(`title`)
    res.render('client/pages/songs/detail',{
        pagetitle:`song detail`,
        song:detail,
        singer: singer,
        topic: topic
    })
}

export const like=async(req:Request,res:Response)=>{
    

    const{id,type}=req.body
    try {
        const song=await Song.findOne({
            _id:id,
            deleted:false,
            status:'active'
        })
        let update=song.like
        if(type=="like"){
            update+=1;
        }
        else if(type=="dislike" && update>=1){
            update-=1
        }
        await Song.updateOne({
            _id:id,
            deleted:false,
            status:'active'
        },{
            like:update
        })

        res.json({
            code:200,
            updateLike:update,
            message:"success"
        })
    } catch (error) {
        res.json({
            code:400,
            message:"error"
        })
    
    }
}