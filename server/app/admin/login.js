const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");

router.post("/login", (req, res, next) => {
    let m_manager = db.model("manager");
    //接参数

    const { user_id, password } = req.body;
    let password_md5 = md5(password);
    //查询参数
    let $where = {
        user_id: user_id,
        password: password_md5
    };
    //查询
    m_manager.findOne($where, (error, model) => {
        //用户不能被锁定
        if (model && model.locked != true) {
            let token = uuid();
            m_manager.findByIdAndUpdate(model._id,
                { $set: { token: token } },
                (error) => {
                    if (!error) {
                        console.log('OK');
                        ho(res, ho.status.ok, { token: token });
                    } else {
                        console.log('返500');
                        ho(res, ho.status.e500, error);
                    }
                }
            );

        } else {
            console.log(返401);
            ho(res, ho.status.e401, error);
        }
    });
});

module.exports = router;