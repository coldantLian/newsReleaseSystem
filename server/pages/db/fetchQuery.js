//以后fetch可以在 node里使用
import 'isomorphic-fetch'

export default {
    findOne(url, model_name, id) {
        return new Promise((resolve, reject) => {
            let response = fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model_name,
                    id
                })
            }).then((response) => {
                if (response.status == 200) {
                    return response;
                } else {
                    throw { error: true, message: response.statustext };
                }
            }).then((response) => {
                return response.json();
            }).then((json) => {
                resolve(json);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    find(url, model_name, $where = {}, order = {}, pageNum, pageSize) {
        return new Promise((resolve, reject) => {
            let response = fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model_name,
                    $where,
                    order,
                    pageNum,
                    pageSize
                })
            }).then((response) => {
                if (response.status == 200) {
                    return response;
                } else {
                    throw { error: true, message: response.statustext };
                }
            }).then((response) => {
                return response.json();
            }).then((json) => {
                resolve(json);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    //用于提交请求
    postNoResult(url, body) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then((response) => {
                if (response.status == 200) {
                    return response;
                } else {
                    throw { error: true, message: response.statustext };
                }
            }).then((response) => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}