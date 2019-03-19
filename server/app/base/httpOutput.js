//用于处理ajax请求并返回成功或失败状态的处理函数

/*
    注：本方法返回格式content-Type永远是application/json
    ***参数说明
    res:<response>对像，用于输出，必填。
    status:<array>[2]状态对像 0 对应状态码  1提供提示信息 
    message:<string>用于传递提示信息，可不提供
    data:<object>用于输出JSON内容，可不提供
 */
const httpOutput = (res, status=[], message, data) => {
        
    //如果第三参数为object，且无第四参数，就认为第三参数是data
    if (!!message && typeof message == 'object' && !data) {
        data = message;
        message = undefined;
    }

    let result = data;

    res.writeHead(status[0] || 200, { 'content-Type': "application/json" });
    if (data) {
        res.end(JSON.stringify(data));
    } else {
        res.end(JSON.stringify({ message: message || status[1] || "发生了未知错误" }));
    }
};

httpOutput.status = {
    ok: [200, "请求完成。"],
    e400: [400, "语义有误，当前请求无法被服务器理解。"],
    e401: [401, "当前请求需要登录管理员帐号。"],
    e403: [403, "服务器已经理解请求，但是拒绝执行它。"],
    e404: [404, "未找到指定资源。"],
    e500: [500, "未知错误，无法完成请求。"],

};

module.exports = httpOutput;