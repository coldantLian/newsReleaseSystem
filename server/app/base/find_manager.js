const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");


const findManager = function (tokenStr, callback) {
    //生成默认超级管理员
    let m_manager = db.model("manager");

    m_manager.findOne(
        { "token": tokenStr },
        (err, result) => {
            if (result) {
                //成功，继续
                callback(false,result);
            } else {
                //失败，滚蛋
                callback(true,result);
            }
        }
    );
}

module.exports = findManager;