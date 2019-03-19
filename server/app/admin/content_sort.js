const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");


//router.use("/",)
router.get("/sortList", (req, res, next) => {
    let model = db.model("content_sort");
    model.find({}).exec((error, result) => {
        ho(res, ho.status.ok, { list: result });
    });

});
router.post("/createSort", (req, res, next) => {
    const { name, remark } = req.body;
    let model = db.model("content_sort");
    model.create({ name, remark }, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });

});
router.post("/removeSort", (req, res, next) => {
    const ids = req.body.ids;
    
    let model = db.model("content_sort");
    let $where = {
        _id:{$in:ids.split(",")}
    };
    model.remove($where, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    })
});
router.post("/updateSort", (req, res, next) => {
    const { _id, name, remark } = req.body;
    let model = db.model("content_sort");
    model.findByIdAndUpdate(_id, { name, remark }, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });

});
router.post("/orderSort", (req, res, next) => {


});

module.exports = router;