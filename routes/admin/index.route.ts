import { Express } from "express";
import { dashboard } from "./dashboard.route";
import {systemConfig} from "../../config/system"
import { topic } from "./topic.route";
import {song} from "./song.route"

export const routeApiAdmin=(app:Express)=>{
    const patch=`${systemConfig.prefixAdmin}`
    app.use(`/${patch}/dashboard`,dashboard)

    app.use(`/${patch}/topics`,topic)

    app.use(`/${patch}/songs`,song)

}
