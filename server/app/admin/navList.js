const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const async = require("async");
const config = require("../../config");

router.get("/", (req, res) => {
    let m_manager = db.model("manager");
    m_manager.findOne({
        token: req.headers.token
    }, (err, record) => {
        if (!err) {
            //区分管理员等级
            let is_admin = record.is_admin;

            const filterSubList = (list) => {
                list.filter((v, k) => {
                    if (v.is_admin) {
                        if (is_admin) {
                            return v;
                        }
                    } else {
                        return v;
                    }
                });
            }

            const navlist = config.adminNav.filter((v, k) => {
                const { title, icon, url, children } = v;
                if (v.is_admin) {
                    //判断一级
                    if (is_admin) {
                        if (v.children) {
                            return { title, icon, children: filterSubList(children) }
                        } else {
                            return v;
                        }
                    }
                } else {
                    //判断二级
                    if (v.children) {
                        return { title, icon, children: filterSubList(children) }
                    } else {
                        return v;
                    }
                }
            });

            ho(res, ho.status.ok, navlist);
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});

module.exports = router;