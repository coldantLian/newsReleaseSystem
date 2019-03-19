const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");
const queryPage = require("../base/queryPage");

const findManager = require("../base/find_manager");

// 添加文章内容
router.post("/create", (req, res, next) => {
    // 接参数
    const {
        sort_id,
        title,
        subTitle,
        titleImage,
        contentText,
        // createTime,
        author,
        origin,
        keyword,
        show,
        draft,
        beginTime,
        // manager,
        isComment,
        isTop,
        isRecommend

    } = req.body;

    //验证数据有效性

    const createContent = (manager_id, callback) => {
        // 预处理字段
        let formData = {
            sort_id,
            title,
            subTitle,
            titleImage,
            contentText,
            "createTime": Date.now(),
            author,
            origin,
            keyword,
            show,
            draft,
            beginTime,
            manager: manager_id,
            isComment,
            isTop,
            isRecommend
        }
        let model = db.model("content");
        //向数据库添加数据
        model.create(
            formData,
            (error) => {
                callback(error);
            }
        );
    }




    // 取得管理员信息
    findManager(req.headers["token"], (error, manager) => {
        if (!error) {
            createContent(manager["_id"], (error) => {
                if (!error) {
                    //插入成功
                    ho(res, ho.status.ok);
                } else {
                    ho(res, ho.status.e500);
                }
            });
        } else {
            ho(res, ho.status.e401);
        }
    })

});

// 更新文章内容
router.post("/update", (req, res, next) => {
    // 接参数
    const {
        content_id,
        sort_id,
        title,
        subTitle,
        titleImage,
        contentText,

        author,
        origin,
        keyword,
        show,
        draft,
        beginTime,
        isComment,
        isTop,
        isRecommend
    } = req.body;

    //验证数据有效性
    const updateContent = (manager_id, callback) => {
        // 预处理字段
        let formData = {
            sort_id,
            title,
            subTitle,
            titleImage,
            contentText,
            author,
            origin,
            keyword,
            show,
            draft,
            beginTime,
            manager: manager_id,
            isComment,
            isTop,
            isRecommend
        }
        let model = db.model("content");
        //向数据库更新数据
        model.findByIdAndUpdate(content_id, formData, (error) => {
            callback(error);
        })
    }




    // 取得管理员信息
    findManager(req.headers["token"], (error, manager) => {
        if (!error) {
            updateContent(manager["_id"], (error) => {
                if (!error) {
                    //插入成功
                    ho(res, ho.status.ok);
                } else {
                    ho(res, ho.status.e500);
                }
            });
        } else {
            ho(res, ho.status.e401);
        }
    })

});

// 得到内容列表
router.get("/list", (req, res, next) => {
    let model = db.model("content");
    // //接参数
    const { keyword, pageNumber, pageSize, order_field, order_direct, filters } = req.query;
    //查询
    //page, pageSize, Model,queryParams, sortParams, callback
    //queryPage()
    let $where = {
        title: new RegExp(keyword)
    }

    let filter_obj = JSON.parse(filters);

    for (let i in filter_obj) {
        $where[i] = { "$in": filter_obj[i] }
    }


    //'ascend' 'descend'
    let order = {}
    if (order_field) {
        order[order_field] = (order_direct === "ascend") ? 1 : -1;
    }

    queryPage(pageNumber, pageSize, model, $where, order, (error, result) => {
        if (!error) {
            ho(res, ho.status.OK, result);
        } else {
            ho(res, ho.e500, error);
        }
    });
});

router.post("/remove", (req, res) => {
    const ids = req.body.ids;

    let model = db.model("content");
    let $where = {
        _id: { $in: ids.split(",") }
    };
    model.remove($where, (err) => {
        if (!err) {
            ho(res, ho.status.OK);
        } else {
            ho(res, ho.status.e500, err);
        }
    })
});

router.get("/getOne", (req, res) => {
    const id = req.query.content_id;
    let model = db.model("content");


    model.findOne({ "_id": id }, (err, record) => {
        if (err) {
            ho(res, ho.status.e500);
        } else {
            if (!record) {
                ho(res, ho.status.e404);
            } else {
                ho(res, ho.status.ok, record);
            }
        }
    });
});

module.exports = router;