/*
    广告位
*/
const mongoose = require("mongoose");
//定义内容文档
const ad = new mongoose.Schema({
    title: { type: String }, //标题
    url: { type: String },
    photo: { type: String },
    show: { type: Boolean },
    createTime: { type: Date, default: Date.now() },
    sort_key:{type:String}
});
mongoose.model("ad", ad);
