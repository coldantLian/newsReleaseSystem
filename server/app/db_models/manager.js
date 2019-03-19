/*
    管理员模型
*/
const mongoose = require("mongoose");
//定义文档
const manager = new mongoose.Schema({
    user_id:{type:String},
    password:{type:String},
    name:{type:String},
    last_time:{type:Date,default:Date.now},
    is_admin:{type:Boolean,default:false},
    locked:{type:Boolean,default:false},
    token:{type:String}
});
mongoose.model("manager", manager);
