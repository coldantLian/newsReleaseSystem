const express = require("express");
const service=require("./website/service_query");

router = express.Router();

// 页面路由
router.get("/", (req, res) => {
    return next.render(req, res, '/index', req.query);
});
router.get("/content/sort", (req, res) => {
    return next.render(req, res, '/content_sort', req.query);
});
router.get("/content/full_text", (req, res) => {
    return next.render(req, res, '/content_full_text', req.query);
});
// 服务路由
router.use("/service",service);


module.exports = router;
