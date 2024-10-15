"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeApi = void 0;
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const routeApi = (app) => {
    app.use('/topics', topic_route_1.topicRoute);
    app.use('/songs', song_route_1.songRoute);
};
exports.routeApi = routeApi;
