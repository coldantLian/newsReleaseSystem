const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");
const md5 = require("md5");
const uuid = require("uuid");

router.use("*", (req, res, next) => {
    if(req.method=="OPTIONS"){
        res.end();
    }else{
        if(req.headers["token"]){
            //检到token，就检查token
            let m_manager = db.model("manager");
            m_manager.findOne(
                {"token":req.headers["token"]},
                (err,result)=>{
                    if(result){
                        //成功，继续
                        next();
                    }else{
                        //失败，滚蛋
                        ho(res,ho.status.e401);
                    }
                }
            );

        }else{
            ho(res,ho.status.e401);
        }
    }
});

module.exports = router;