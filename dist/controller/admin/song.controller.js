"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editt = exports.edit = exports.createAndSave = exports.create = exports.index = void 0;
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const system_1 = require("../../config/system");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield songs_model_1.default.find({
        deleted: false
    });
    res.render('admin/pages/song/index', {
        pageTitle: "Topics",
        songs: song
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topic_model_1.default.find({
        deleted: false
    }).select("title");
    const singer = yield singer_model_1.default.find({
        deleted: false
    }).select("fullName");
    res.render("admin/pages/song/creat", {
        pageTitle: "Add new ",
        topics: topic,
        singers: singer
    });
});
exports.create = create;
const createAndSave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.avatar) {
        req.body.avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        req.body.audio = req.body.audio[0];
    }
    const song = new songs_model_1.default(req.body);
    yield song.save();
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/songs`);
});
exports.createAndSave = createAndSave;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const song = yield songs_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    const topic = yield topic_model_1.default.find({
        deleted: false
    }).select("title");
    const singer = yield singer_model_1.default.find({
        deleted: false
    }).select("fullName");
    res.render("admin/pages/song/edit", {
        pageTitle: "Edit",
        topics: topic,
        singers: singer,
        song: song
    });
});
exports.edit = edit;
const editt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (req.body.avatar) {
        req.body.avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        req.body.audio = req.body.audio[0];
    }
    yield songs_model_1.default.updateOne({
        _id: id,
        deleted: false
    }, req.body);
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/songs`);
});
exports.editt = editt;
