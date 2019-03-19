const express = require('express');

const db = require("mongoose");
const async = require("async");
const ho = require("./base/httpOutput");
let router = express.Router();

const manager = require("./admin/manager.js");

const checkToken = require("./base/checkToken");
const login = require("./admin/login");
const content_sort = require("./admin/content_sort");
const content = require("./admin/content");
const fileUpload = require("./admin/fileUpload");
const website_config = require("./admin/website_config");
const simple_page = require("./admin/simple_page");
const channel = require("./admin/channel");
const ad = require("./admin/ad"); 
const admin_init = require("./admin/admininit");
const navList = require("./admin/navList");
const charts = require("./admin/chartService");;
//身份验证不需要权限
router.post("/login", login);
router.use("/init", admin_init);
// 其后所有操作都要验证过token
router.use("*", checkToken);


router.use("/manager", manager);
router.use("/content_sort", content_sort);
router.use("/content", content);
router.use("/upload", fileUpload);
router.use("/config", website_config);
router.use("/simple_page", simple_page);
router.use("/channel", channel);
router.use("/ad", ad);
router.use("/navList", navList);
router.use("/chart", charts);

router.get("/checkLogin", (req, res) => {
    ho(res, ho.status.ok);
});

module.exports = router;