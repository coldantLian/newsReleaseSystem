/*
    管理员模型
*/
const mongoose = require("mongoose");
//定义分类文档
const website_config = new mongoose.Schema({
    name: { type: String },
    domain: { type: String },
    keyword: { type: String },
    copyright: { type: String },
    websit_code: { type: String },
    logo: { type: String },
    email: { type: String },
    phone_number: { type: String }
});
mongoose.model("website_config", website_config);
