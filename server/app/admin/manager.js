const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");

router.get("/Manager",(req,res)=>{
    let m_manager = db.model("manager");

    m_manager.create({
        user_id:"admin",
        password:md5("admin"),
        name:'洪',
        locked:false,
        is_admin:true,
        token:""
    },(err, record)=>{
        if(err){
            ho(res, ho.status.e500, err);
        }else{
            ho(res, ho.status.ok);
        }
    })
})


//这两个方法所有管理员都可用
router.get("/get_manager_of_token", (req, res) => {
    let m_manager = db.model("manager");
    let token = req.headers.token;

    m_manager.findOne({ token }, (err, record) => {
        if (err) {
            ho(res, ho.status.e401);
        } else {
            ho(res, ho.status.ok, { _id: record._id, user_id: record.user_id });
        }
    });
});



router.post("/edit_id_and_password", (req, res) => {
    let m_manager = db.model("manager");
    const { _id, user_id, password } = req.body;

    m_manager.findByIdAndUpdate(_id, { user_id, password: md5(password) }, (err, record) => {
        if (err) {
            ho(res, ho.status.e401);
        } else {
            ho(res, ho.status.ok);
        }
    })
});

//以下方法只有admin可用 以下操作会先检查管理员身份是不是 is_admin
router.use("*", (req, res, next) => {
    let m_manager = db.model("manager");
    let token = req.headers.token;

    m_manager.findOne({ token }, (err, record) => {
        if (err) {
            ho(res, ho.status.e500, err);
        } else {
            if (record.is_admin) {
                next();
            } else {
                ho(res, ho.status.e403, "只有超级管理员可以进行此操作");
            }
        }
    });
});

router.get("/list", (req, res) => {
    let m_manager = db.model("manager");
    m_manager.find({}).sort({ is_admin: 1 }).exec((err, result) => {
        if (err) {
            ho(res, ho.status.e500, err);
        } else {
            ho(res, ho.status.ok, result);
        }
    });
});


router.post("/update", (req, res, next) => {
    let m_manager = db.model("manager");
    const {
        _id, locked
    } = req.body;

    m_manager.findById(_id, (err, record) => {
        if (!err) {
            if (record.is_admin && locked) {
                ho(res, ho.status.e403, "超级用户不可锁定");
            } else {
                next();
            }
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});

router.post("/update", (req, res) => {
    let m_manager = db.model("manager");
    const {
        _id,
        user_id,
        password,
        name,
        locked
    } = req.body;

    m_manager.findByIdAndUpdate(_id, {
        user_id,
        password: md5(password),
        name,
        locked

    }, (err, record) => {
        if (err) {
            ho(res, ho.status.e500, err);
        } else {
            ho(res, ho.status.ok);
        }
    })
});

router.post("/create", (req, res) => {
    let m_manager = db.model("manager");
    const {
        user_id,
        password,
        name,
        locked
    } = req.body;

    m_manager.create({
        user_id,
        password: md5(password),
        name,
        locked
    }, (err, record) => {
        if (err) {
            ho(res, ho.status.e500, err);
        } else {
            ho(res, ho.status.ok);
        }
    })
});

router.post("/remove", (req, res, next) => {
    let m_manager = db.model("manager");
    const ids = req.body.ids;
    let $where = {
        _id: { $in: ids.split(",") }
    };
    m_manager.find($where, (err, results) => {
        if (!err) {
            let is_admin = false;
            for (item of results) {
                if (item.is_admin) {
                    is_admin = true;
                }
            }
            if (is_admin) {
                ho(res, ho.status.e403, "超级用户不可删除");
            } else {
                next();
            }

        } else {
            ho(res, ho.status.e500, err);
        }
    });
});

router.post("/remove", (req, res) => {
    let m_manager = db.model("manager");
    const ids = req.body.ids;
    let $where = {
        _id: { $in: ids.split(",") }
    };
    m_manager.remove($where, (err) => {
        if (!err) {
            ho(res, ho.status.ok);
        } else {
            ho(res, ho.status.e500, err);
        }
    });
});


module.exports = router;