const express = require('express');
const router = express.Router();
const db = require("mongoose");
const ho = require("../base/httpOutput");


router.get("/", (req, res) => {
    const model = db.model("website_config");
    model.find({}).exec((err, results) => {
        if (err) {
            ho(res, ho.status.e500);
        } else {
            if (results.length) {
                ho(res, ho.status.ok, results[0]);
            } else {
                ho(res, ho.status.e404);
            }

        }
    });
});

router.post("/", (req, res) => {
    const model = db.model("website_config");
    const {
        name,
        domain,
        keyword,
        copyright,
        websit_code,
        logo,
        email,
        phone_number
    } = req.body;

    model.remove({}, (err) => {
        if (err) {
            ho(res, ho.status.e500);
        } else {
            model.create({
                name,
                domain,
                keyword,
                copyright,
                websit_code,
                logo,
                email,
                phone_number
            }, (err) => {
                if (err) {
                    ho(res, ho.status.e500);
                } else {
                    ho(res, ho.status.ok);
                }
            });
        }
    });

});

module.exports = router;