const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");
const async = require("async");

//router.use("/",)
router.get("/list", (req, res, next) => {
    let m_channel = db.model("channel");
    let m_content_sort = db.model("content_sort");
    let m_simple = db.model("simple_page");
    async.parallel({
        channel(done) {
            m_channel.find({}).sort({ "order_index": 1 }).exec((error, result) => {
                if (error) {
                    ho(res, ho.status.e500);
                } else {
                    done(error, result);
                }
            });
        },
        content_sort(done) {
            m_content_sort.find({}).exec((error, result) => {
                if (error) {
                    ho(res, ho.status.e500);
                } else {
                    done(error, result);
                }
            });
        },
        simple(done) {
            m_simple.find({}).exec((error, result) => {
                if (error) {
                    ho(res, ho.status.e500);
                } else {
                    done(error, result);
                }
            });
        }
    }, (err, result) => {
        if (err) {
            ho(res, ho.status.e500);
        } else {
            ho(res, ho.status.ok, { list: result.channel, content_sort: result.content_sort, simple: result.simple });
        }
    });


});
router.post("/create", (req, res, next) => {
    let {
        title,
        module,
        param,
        order_index,
        show
    } = req.body;
    let model = db.model("channel");
    //先找到order_index最大值 
    model.find({}).sort({ order_index: -1 }).exec((err, result) => {
        if (err) {
            ho(res, ho.status.e500, err);
        } else {
            if (result.length) {
                order_index = result[0].order_index + 1;
            } else {
                order_index = 1;
            }

            model.create({
                title,
                module,
                param,
                order_index,
                show:Boolean(show)
            }, (err) => {
                if (!err) {
                    ho(res, ho.status.ok);
                } else {
                    ho(res, ho.status.e500, err);
                }
            });
        }

    });




});
router.post("/remove", (req, res, next) => {
    const ids = req.body.ids;

    let model = db.model("channel");
    let $where = {
        _id: { $in: ids.split(",") }
    };
    model.remove($where, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});
router.post("/update", (req, res, next) => {
    const {
         _id,
        title,
        module,
        param,
        order_index,
        show
    } = req.body;
    let model = db.model("channel");
    model.findByIdAndUpdate(_id, {
        title,
        module,
        param,
        order_index,
        show:Boolean(show)
    }, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });

});
router.post("/order", (req, res, next) => {
    const { id_a, id_b } = req.body;
    let model = db.model("channel");
    $where = {
        _id: { $in: [id_a, id_b] }
    };
    model.find($where).exec((error, results) => {
        if (error) {
            ho(res, ho.status.e500);
        } else if (results.length === 2) {
            ca = results[0];
            cb = results[1];

            //成功，进行交换
            async.parallel({
                a: (done) => {
                    model.findByIdAndUpdate(ca._id, { order_index: cb.order_index }, (err, result) => {
                        done(err, result);
                    });
                },
                b: (done) => {
                    model.findByIdAndUpdate(cb._id, { order_index: ca.order_index }, (err, result) => {
                        done(err, result);
                    });
                }
            }, (error, result) => {
                if (!error) {
                    ho(res, ho.status.ok);
                } else {
                    ho(res, ho.status.e500);
                }
            })
        } else {
            ho(res, ho.status.e500, "没有找到可调换顺序的频道");
        }
    });
});

router.get("/get_module_tree", (req, res) => {
    let m_content = db.model("content_sort");
    let m_simple = db.model("simple_page");

    async.parallel({
        content(done) {
            m_content.find({}).exec((err, result) => done(err, result));
        },
        simple(done) {
            m_simple.find({}).exec((err, result) => done(err, result));
        }
    }, (err, results) => {
        if (err) {
            ho(res, ho.status.e500);

        } else {
            // 返回的树形数据
            let tree = [{
                value: 'content',
                label: '内容',
                children: []
            }, {
                value: 'simple',
                label: '单页',
                children: []
            }];

            for (let index in results.content) {
                tree[0].children.push({ value: results.content[index]._id, label: results.content[index].name });
            }
            for (let index in results.simple) {
                tree[1].children.push({ value: results.simple[index]._id, label: results.simple[index].title });
            }

            ho(res, ho.status.ok, tree);
        }


    });
})

module.exports = router;