/*
    管理员模型
*/
const mongoose = require("mongoose");
//定义分类文档
const contentSort = new mongoose.Schema({
    name:{type:String},
    remark:{type:String},
    order:{type:Number}
});
mongoose.model("content_sort", contentSort);
