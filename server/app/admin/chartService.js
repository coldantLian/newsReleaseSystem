const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const async = require("async");
router.get("/pic_content_sort_count", (req, res) => {
    let m_sort = db.model("content_sort");
    let m_content = db.model("content");

    try {
        m_sort.find({}).sort({ order_index: 1 }).exec((err, sort_results) => {
            if (!err) {
                m_content.aggregate({ $group: { _id: "$sort_id", count: { $sum: 1 } } }).exec((err, content_results) => {
                    if (err) {
                        ho(res, ho.status.e500, err);
                    } else {
                        let chart_result = [];
                        for (let sort of sort_results) {
                            for (let count of content_results) {
                                if (count._id && count._id.toString() === sort._id.toString()) {
                                    chart_result.push({ name: sort.name, value: count.count });
                                }
                            }
                        }

                        ho(res, ho.status.ok, { chart: chart_result });
                    }
                });

            } else {
                throw err;
            }
        });
    } catch (er) {
        ho(res, ho.status.e500, err);
    }

});


router.get("/pic_sort_hits", (req, res) => {
    let m_sort = db.model("content_sort");
    let m_hits = db.model("content_hits");

    async.parallel({
        sort: (done) => {
            m_sort.find({}).exec((err, result) => {
                done(err, result);
            });
        },
        hits: (done) => {
            m_hits.aggregate({
                $group: { _id: "$sort_id", count: { $sum: "$hits" } }
            }, (err, results) => {
                done(err, results);
            });
        }
    }, (err, results) => {
        if (!err) {
            let chart_arr = [];
            for (let sort of results.sort) {
                for (let hits of results.hits) {
                    if (sort._id.toString() === hits._id.toString()) {
                        chart_arr.push({ name: sort.name, value: hits.count });
                    }
                }
            }
            ho(res, ho.status.ok, {chart:chart_arr});
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});
module.exports = router;