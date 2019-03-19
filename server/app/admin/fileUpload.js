const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const multiparty = require('multiparty');
const uuid = require("uuid");
const fs = require("fs");
var path = require('path');
router.post("/", (req, res, next) => {
    let form = new multiparty.Form({ uploadDir: './public/uploadfile/' });
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        if (!err) {
            let inputFile = files.file[0];
            //临时文件的位置
            var uploadedPath = inputFile.path;
            //准备的文件名
            let fileName = `${uuid()}_${inputFile.originalFilename}`;
            //要保存的文件名
            var dstPath = "./public/uploadfile/" + fileName;
            fs.rename(uploadedPath, dstPath, function (err) {
                if (!err) {
                    ho(res,ho.status.ok,{fileName:fileName});
                } else {
                    ho(res,ho.status.e500);
                }
            });                       
        } else {
            ho(res,ho.status.e500);
        }
    });
});

module.exports = router;