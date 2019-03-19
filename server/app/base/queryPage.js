const db = require("mongoose");
const async = require("async");

const queryPage = (pageNum, pageSize, model, $where, order, callback) => {

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
            model.find($where)
                .sort(order)
                .skip(Number((pageNum - 1) * pageSize))
                .limit(Number(pageSize))
                .exec((error, list) => {
                    if (!error) {
                        done(null, list);
                    } else {
                        done(error);
                    }
                });
        }
    }, (error, result) => {
        if (error) {
            callback(error);
        } else {

            result.pageNum = pageNum;
            result.pageSize = pageSize;
            callback(result);
        }
    });


}

module.exports = queryPage;