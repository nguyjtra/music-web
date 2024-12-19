import { Request, Response } from "express";
export const index=(req:Request,res:Response)=>{
    console.log(req.body.file);
    res.json ({
        location:req.body.file})
 
}