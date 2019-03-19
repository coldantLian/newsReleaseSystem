const express = require("express");
const ho = require("../base/httpOutput");
const db = require("mongoose");
const async = require("async");

router = express.Router();

router.post("/findOn", (req, res) => {
    const { model_name, id } = req.body;
    let m = db.model(model_name);
    m.findById(id, (err, result) => {
        if (err) {
            ho(res, ho.status.e500, err);
        } else {
            ho(res, ho.status.ok, result);
        }
    });

});

router.post("/find", (req, res) => {
    const { model_name, $where, order, pageNum, pageSize } = req.body;
    let model = db.model(model_name);
    async.parallel({
        count: (done) => {
            model.count($where, (error, count) => {
                if (!error) {
                    done(null, count);
                } else {
                    done(error);
                }
            });
        },
        list: (done) => {
            if (pageNum && pageSize) {
                model.find($where)
                    .sort(order)
                    .skip(Number((Number(pageNum) - 1) * Number(pageSize)))
                    .limit(Number(pageSize))
                    .exec((error, list) => {
                        done(error, list);
                    });
            } else {
                model.find($where)
                    .sort(order)
                    .exec((error, list) => {
                        done(error, list);
                    });
            }

        }
    }, (error, result) => {
        if (error) {
            ho(res, ho.status.e500, err);
        } else {
            //成功
            if (Number(pageSize) && (Number(pageNum))) {
                result.pageNum = pageNum;
                result.pageSize = pageSize;
            }
            ho(res, ho.status.ok, result);
        }
    });
})

// 点击量统计接口
router.post("/content_hit", (req, res) => {
    const { id, sort_id } = req.body;
    
    let now = new Date(Date.now());
    let queryDate = new Date(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`);

    let m = db.model("content_hits");
    m.findOne({ create_date: queryDate, content_id: id }, (err, record) => {
        if (!err && record) {
            // 找到就更新
            m.findByIdAndUpdate(record._id, { hits: record.hits + 1 }, (err, result) => {
                if (err) {
                    //失败
                    ho(res, ho.status.e500, err);
                } else {
                    //成功
                    ho(res, ho.status.ok, result);
                }
            });
        } else {
            if (err) {
                //错误就不继续
                ho(res, ho.status.e500, err);
            } else {
                //没找到就创建
                m.create({
                    content_id: id, //内容ID
                    sort_id: sort_id, //分类的ID
                    create_date: queryDate, //创建时间
                    hits: 1
                }, (err, result) => {
                    if (err) {
                        //失败
                        ho(res, ho.status.e500, err);
                    } else {
                        //成功
                        ho(res, ho.status.ok, result);
                    }
                })

            }
        }
    });

});
module.exports = router;
