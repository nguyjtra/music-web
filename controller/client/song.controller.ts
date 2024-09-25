import { Response, Request } from "express"
import Song from "../../models/songs.model"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"
import FavoriteSong from "../../models/favorite-song.model"
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
     const checkFavor=await FavoriteSong.findOne({
        songId:detail.id
        // userId:res.locals.user.id
     })
     if(checkFavor){
        detail[`isFavorite`]=true
     }
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

export const favorite=async(req:Request,res:Response)=>{
    const {id}=req.body
    const data={
         // userId:res.locals.user.id,
        songId:id,
    }
    const exist= await FavoriteSong.findOne({
        // userId:res.locals.user.id,
        songId:id,
    })
    let status:string="check"
    if(exist){
        await FavoriteSong.deleteOne({
          // userId:res.locals.user.id,
            songId:id,
        })
          status="delete"
    }else{
        const record =new FavoriteSong(data)
       await record.save()
       status="add"
    }
    res.json({
        code:200,
        check:status
    })
}