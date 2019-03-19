const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");


//router.use("/",)
router.get("/list", (req, res, next) => {
    let model = db.model("simple_page");
    model.find({}).exec((error, result) => {
        ho(res, ho.status.ok, { list: result });
    });
});

router.post("/create", (req, res, next) => {
    const { title, url } = req.body;
    let model = db.model("simple_page");
    model.create({ title, url }, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});
router.post("/remove", (req, res, next) => {
    const ids = req.body.ids;    
    let model = db.model("simple_page");
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
router.post("/update", (req, res, next) => {
    const { _id, title, url } = req.body;
    let model = db.model("simple_page");
    model.findByIdAndUpdate(_id, { title, url }, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});

module.exports = router;