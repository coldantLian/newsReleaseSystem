// 网站数据初始化工作

const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");
const async = require("async");

router.get("/", (req, res) => {
    //生成默认超级管理员
    let m_manager = db.model("manager");
    let m_config = db.model("website_config");
    let user_id = "admin";
    let password = md5("admin");





    m_manager.find({}).exec((error, result) => {
        if (!error && !result.length) {
            async.parallel({
                //初始化管理员
                initManager(done) {
                    m_manager.create({
                        "user_id": user_id,
                        "password": password,
                        name: "超级用户",
                        is_admin: true,
                        locked: false,
                        token: ""
                    }, (error) => {
                        done(error);
                    });
                },
                //初始化网站配置
                initConfig(done) {
                    m_config.create({
                        name: "网站默认名称",
                        domain: "",
                        keyword: "",
                        copyright: "这里添加版本声明",
                        websit_code: "这里填写备案号",
                        logo: "",
                        email: "",
                        phone_number: ""
                    }, (error) => {
                        done(error);
                    })
                }
            }, (err, result) => {
                if(!err){
                    ho(res, ho.status.ok);
                }
            });

        } else {
            ho(res, ho.status.e403, "当前站点数据不需要初始化");
        }
    });
});

module.exports = router;