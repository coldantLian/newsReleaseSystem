const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");
const async = require("async");

router.get("/list", (req, res) => {
    let m = db.model("ad");
    m.find({}).sort({ createTime: -1 }).exec((err, result) => {
        if (!err) {
            ho(res, ho.status.ok,result);
        } else {
            ho(res, ho.status.e500, err);
        }
    })
});
router.post("/create", (req, res) => {
    const { title, url, photo, show,sort_key } = req.body;
    let m = db.model("ad");
    m.create({ title, url, photo, show ,sort_key}, (err, result) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});
router.post("/update", (req, res) => {
    const { id, title, url, photo, show ,sort_key} = req.body;
    let m = db.model("ad");
    m.findByIdAndUpdate(id, { title, url, photo, show,sort_key }, (err, result) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});
router.post("/remove", (req, res) => {
    const ids = req.body.ids;
    let m = db.model("ad");
    let $where = {
        _id: { $in: ids.split(",") }
    };
    m.remove($where, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});


module.exports = router;