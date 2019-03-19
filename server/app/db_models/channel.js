/*
    频道
*/
const mongoose = require("mongoose");
//定义内容文档
const channel = new mongoose.Schema({
    title:{type:String}, //标题
    module:{type:String},
    param:{type:String},
    order_index:{type:Number},
    show:{type:Boolean}    
});
mongoose.model("channel", channel);
