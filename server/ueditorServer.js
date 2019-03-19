const path=require("path");
const express = require("express");
const ueditor = require("ueditor");
var bodyParser = require('body-parser')
let router = express.Router();
//定义UE上传的路径
const UE_UPLOAD_PATH='/uploadfile/ueditor/';
router.use(bodyParser.urlencoded({
  extended: true
}))
router.use(bodyParser.json());

// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'
router.use(ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    var ActionType = req.query.action;
     if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        // 这里你可以获得上传图片的信息
        // var foo = req.ueditor;
        // console.log(foo.filename); // exp.png
        // console.log(foo.encoding); // 7bit
        // console.log(foo.mimetype); // image/png
        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
        var file_url = UE_UPLOAD_PATH+"image";
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = UE_UPLOAD_PATH+"file"; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = UE_UPLOAD_PATH+"video"; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = UE_UPLOAD_PATH+"image"; // 要展示给客户端的文件夹路径
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

module.exports=router;