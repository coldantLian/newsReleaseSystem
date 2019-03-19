/*
    内容点击统计（每天只为一个内容生成一条记录)
*/
const mongoose = require("mongoose");
//定义内容文档
const content_hits = new mongoose.Schema({
    content_id:{type:mongoose.SchemaTypes.ObjectId}, //内容ID
    sort_id:{type:mongoose.SchemaTypes.ObjectId}, //分类ID
    create_date:{type:Date}, //创建时间
    hits:{type:Number}
});
mongoose.model("content_hits", content_hits);
