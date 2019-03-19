//simple_page
/*
    单页模块模
*/
const mongoose = require("mongoose");
//定义分类文档
const simple_page = new mongoose.Schema({
    title: { type: String },
    url: { type: String }
});
mongoose.model("simple_page", simple_page);
