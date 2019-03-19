/*
    定义内容文档模型
*/
const mongoose = require("mongoose");
//定义内容文档
const content = new mongoose.Schema({
    sort_id:{type:mongoose.SchemaTypes.ObjectId}, //分类ID
    title:{type:String}, //标题
    subTitle:{type:String}, //副标题
    titleImage:{type:String}, //标题图片
    contentText:{type:String},//内容
    createTime:{type:Date}, //生成时间
    author:{type:String}, //做者
    origin:{type:String}, //来源
    keyword:{type:String},  //关键词
    show:{type:Boolean}, //是否显示
    draft:{type:Boolean}, //是否是草稿
    beginTime:{type:Date}, //文章开始时羊（生效时间）
    manager:{type:String}, //发布人
    isComment:{type:Boolean}, //文章是否可评论
    isRecommend:{type:Boolean}, //推荐
    isTop:{type:Date} //置顶有效时间

});
mongoose.model("content", content);
