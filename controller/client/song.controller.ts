import { Response, Request } from "express"
import Song from "../../models/songs.model"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"
import FavoriteSong from "../../models/favorite-song.model"
import unidecode from "unidecode"
import { title } from "process"
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

export const listFavorite=async(req:Request,res:Response)=>{

    let list=await FavoriteSong.find({
        // userId:res.locals.user.id
    })
    for( let item of list){
      item[`infoSong`]=await Song.findOne({
            _id:item.songId
    }).select("avatar slug title singerId")

        item[`infoSinger`]=await Singer.findOne({
            _id:item[`infoSong`].singerId
        }).select("fullName")
}
    res.render('client/pages/songs/favorite',{
        pagetitle:"Favorite song",
        songs:list

    })
}

export const sreach=async(req:Request,res:Response)=>{
    const type=req.params.type;

    const keyword=`${req.query.keyword}`
    keyword.trim()
   let keywordSlug=keyword.replace(/\s/g,"-")
    keywordSlug=keyword.replace(/\s+/g,"-")
    keywordSlug=unidecode(keywordSlug)
    const regexA=new RegExp(keyword,"i")
    const regexB=new RegExp(keywordSlug,"i")
    
    let songSuggest=[]
    //searching
    if(keyword){
    const song= await Song.find({
        deleted:false,
        $or:[
            {title: regexA},
            {slug: regexB}
        ],
        status:"active"
    }).select("title avatar singerId like slug")

    for(const item of song){
        const singerName=await Singer.findOne({
            _id:item.singerId
        }).select("fullName")

        //  item[`singerFullName`]=singerName[`fullName`]
        // cannot using for fetch api

         const itemFinal={
                title:item.title,
                avatar: item.avatar,
                singerId: item.singerId,
                like: item.like,
                slug: item.slug,
                singerFullName: singerName["fullName"],
         }
         songSuggest.push(itemFinal)
    }
}
    if(type=="result"){
    res.render("client/pages/songs/list",{
        pageTitle:`Result for ${keyword}`,
        songs:songSuggest,
    })}
    else if(type=="suggest"){
        res.json({
            code:200,
            songs:songSuggest
        })
    }
    else{
        res.json({
            code:400
        })
    }
}

export const listen=async(req:Request,res:Response)=>{
    try {
        const id=req.params.id
        const Listen=await Song.findOne({
            _id:id,
            deleted:false,
            status:"active"
        }).select('id listen')

        await Song.updateOne({
            _id:id
        },{
            listen:Listen.listen+1
        })
        res.json({
            code:200,
            listen:Listen.listen+1
        })
    } catch (error) {
        res.json({
            code:400,
            message:"error"
        }
        )
    }
}