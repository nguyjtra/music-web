"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeApiAdmin = void 0;
const dashboard_route_1 = require("./dashboard.route");
const system_1 = require("../../config/system");
const topic_route_1 = require("./topic.route");
const upload_route_1 = require("./upload.route");
const song_route_1 = require("./song.route");
const routeApiAdmin = (app) => {
    const patch = `${system_1.systemConfig.prefixAdmin}`;
    app.use(`/${patch}/dashboard`, dashboard_route_1.dashboard);
    app.use(`/${patch}/topics`, topic_route_1.topic);
    app.use(`/${patch}/songs`, song_route_1.song);
    app.use(`/${patch}/route`, upload_route_1.uploadRouter);
};
exports.routeApiAdmin = routeApiAdmin;
