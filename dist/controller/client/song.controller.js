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
exports.listen = exports.sreach = exports.listFavorite = exports.favorite = exports.like = exports.detail = exports.list = void 0;
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const unidecode_1 = __importDefault(require("unidecode"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugTopic = req.params.slugTopic;
    const topicSong = yield topic_model_1.default.findOne({
        slug: slugTopic,
        deleted: false,
        status: "Available"
    });
    const song = yield songs_model_1.default.find({
        deleted: false,
        topicId: `${topicSong.id}`,
        status: "active"
    }).select("title avatar singerId like slug");
    for (const item of song) {
        const singerName = yield singer_model_1.default.findOne({
            _id: item.singerId
        }).select("fullName");
        item[`singerFullName`] = singerName[`fullName`];
    }
    res.render('client/pages/songs/list', {
        pagetitle: `${topicSong.title}`,
        songs: song
    });
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const detail = yield songs_model_1.default.findOne({
        slug: slug,
        deleted: false
    });
    const singer = yield singer_model_1.default.findOne({
        _id: detail.singerId
    }).select(`fullName `);
    const topic = yield topic_model_1.default.findOne({
        _id: detail.topicId
    }).select(`title`);
    const checkFavor = yield favorite_song_model_1.default.findOne({
        songId: detail.id
    });
    if (checkFavor) {
        detail[`isFavorite`] = true;
    }
    res.render('client/pages/songs/detail', {
        pagetitle: `song detail`,
        song: detail,
        singer: singer,
        topic: topic
    });
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, type } = req.body;
    try {
        const song = yield songs_model_1.default.findOne({
            _id: id,
            deleted: false,
            status: 'active'
        });
        let update = song.like;
        if (type == "like") {
            update += 1;
        }
        else if (type == "dislike" && update >= 1) {
            update -= 1;
        }
        yield songs_model_1.default.updateOne({
            _id: id,
            deleted: false,
            status: 'active'
        }, {
            like: update
        });
        res.json({
            code: 200,
            updateLike: update,
            message: "success"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "error"
        });
    }
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const data = {
        songId: id,
    };
    const exist = yield favorite_song_model_1.default.findOne({
        songId: id,
    });
    let status = "check";
    if (exist) {
        yield favorite_song_model_1.default.deleteOne({
            songId: id,
        });
        status = "delete";
    }
    else {
        const record = new favorite_song_model_1.default(data);
        yield record.save();
        status = "add";
    }
    res.json({
        code: 200,
        check: status
    });
});
exports.favorite = favorite;
const listFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let list = yield favorite_song_model_1.default.find({});
    for (let item of list) {
        item[`infoSong`] = yield songs_model_1.default.findOne({
            _id: item.songId
        }).select("avatar slug title singerId");
        item[`infoSinger`] = yield singer_model_1.default.findOne({
            _id: item[`infoSong`].singerId
        }).select("fullName");
    }
    res.render('client/pages/songs/favorite', {
        pagetitle: "Favorite song",
        songs: list
    });
});
exports.listFavorite = listFavorite;
const sreach = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    const keyword = `${req.query.keyword}`;
    keyword.trim();
    let keywordSlug = keyword.replace(/\s/g, "-");
    keywordSlug = keyword.replace(/\s+/g, "-");
    keywordSlug = (0, unidecode_1.default)(keywordSlug);
    const regexA = new RegExp(keyword, "i");
    const regexB = new RegExp(keywordSlug, "i");
    let songSuggest = [];
    if (keyword) {
        const song = yield songs_model_1.default.find({
            deleted: false,
            $or: [
                { title: regexA },
                { slug: regexB }
            ],
            status: "active"
        }).select("title avatar singerId like slug");
        for (const item of song) {
            const singerName = yield singer_model_1.default.findOne({
                _id: item.singerId
            }).select("fullName");
            const itemFinal = {
                title: item.title,
                avatar: item.avatar,
                singerId: item.singerId,
                like: item.like,
                slug: item.slug,
                singerFullName: singerName["fullName"],
            };
            songSuggest.push(itemFinal);
        }
    }
    if (type == "result") {
        res.render("client/pages/songs/list", {
            pageTitle: `Result for ${keyword}`,
            songs: songSuggest,
        });
    }
    else if (type == "suggest") {
        res.json({
            code: 200,
            songs: songSuggest
        });
    }
    else {
        res.json({
            code: 400
        });
    }
});
exports.sreach = sreach;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const Listen = yield songs_model_1.default.findOne({
            _id: id,
            deleted: false,
            status: "active"
        }).select('id listen');
        yield songs_model_1.default.updateOne({
            _id: id
        }, {
            listen: Listen.listen + 1
        });
        res.json({
            code: 200,
            listen: Listen.listen + 1
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "error"
        });
    }
});
exports.listen = listen;
