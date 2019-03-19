/*
    统一AJAX操作类，用于交互数据并提供统一的处理过程 
    本操作类基于xmlHttpRequest对像编写，未使用fetch
*/

import ports from './port';
import loginState from './loginState';
import actionTypes from '../redux/actionTypes';
import { store } from '../redux/store';
import message from './message';


class ajax {
    constructor(url = "", data = {}, method = "get", type = "json", async = true) {
        this.send = false;
        //在配置项上记录构造函数参数
        this.config = { url, data, method, type, async };
        //用于事件响 应的回调函数
        this.callback = {
            fn_before: undefined,
            fn_then: undefined,
            fn_catch: undefined,
            fn_complete: undefined,
            fn_progress: undefined
        };


        this.init();
    }
}


//公用方法和属性
ajax.prototype = {
    //定义用于检测返回状态的枚举
    statusType: {
        OK: 200,      //操作成功
        Unauthorized: 401,  //需要验证
        Forbidden: 403,    //罗辑错误，业务错误，关系数据库限制等 
        NotFound: 404,  //请求的资源不存在
        Timeout: 408, //连接超时 
        Conflict: 409, //服务自忙
        Locked: 423,//逻辑锁，资源锁定
        Error: 500  //实时错误，未知错误
    },
    statusText: {
        200: "操作成功",
        401: "需要用户验证身份",
        403: "业务层拒绝请求",
        404: "请求的资源不存在",
        408: "服务器或服务层连接超时，请稍后重试",
        409: "服务器正忙，请稍后重试",
        423: "请求的资源被锁定，请稍后重试",
        500: "服务发生未可知的错误"
    },
    //序列化数据对像的方法
    serializeObject(obj) {
        var data_str = "";

        for (let key in obj) {
            if (obj[key] != undefined) {
                data_str += (data_str ? "&" : "") + key.toString() + "=" + obj[key].toString();
            }
        }

        return data_str;
    },
    //初始化方法
    init() {
        //区分method，处理data参数
        let url = this.config.url;
        let data = this.config.data;
        // 如果为get方式
        if (this.config.method.toLowerCase() == "get") {
            //向data域添加一个随机ID用来防缓存
            data["rid_" + Math.random().toString().replace(".", "")] = Math.random();
            //向URL拼接数据
            //如果没找到 ？
            if (url.indexOf("?") == -1) {
                url += "?"
            } else {
                url += "&"
            }
            //拼接前URL转码
            url += encodeURI(this.serializeObject(this.config.data));
        }
        //初始化xhr对像
        this.xhr = new XMLHttpRequest();
        this.xhr.open(this.config.method, url, this.config.async);
        this.xhr.responseType = this.config.type;
        //处理过程主体
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState == 4) {
                // 处理成功
                if (this.xhr.status == 200) {
                    this.callback.fn_then && this.callback.fn_then(this.xhr);
                } else {
                    //权限错误处理
                    if (this.xhr.status == "401") {
                        //复制一个callback对用的ajax对像 然后调用
                        //注意在这里修复一个bug 如果不加此判断会造成登陆失败后再也没法成功验证身份，因为每次验证成功后会再提交一次错误的身份login 
                        if (this.config.url != (ports.server + ports.base.login)) {
                            let callback = () => {
                                var newAjax = new ajax(this.config.url, this.config.data, this.config.method, this.config.type, this.config.async);
                                newAjax.callback = this.callback;
                                newAjax.do();
                            }
                            store.dispatch(actionTypes.create(actionTypes.SET_LOGIN_STATE, { isLogin: false, loginCallback: callback.bind(this) }));
                        }
                    }
                    //处理失败
                    let msg = (this.statusText[this.xhr.status] || "未定义错误") + "[" + this.xhr.status + "]";
                    this.callback.fn_catch && this.callback.fn_catch({ msg, xhr: this.xhr });
                    //把错误提交到redux 
                    store.dispatch(actionTypes.create(actionTypes.ADD_MESSAGE, new message(msg, message.types.error)));
                }
                this.callback.fn_complete && this.callback.fn_complete(this.xhr);
            }
        };

        this.xhr.onprogress = (e) => {
            this.callback.fn_progress && this.callback.fn_progress(e)
        };
    },

    //向请求头部添加一个属性
    addRequestHeader(key, value) {
        this.xhr.setRequestHeader(key, value);
    },

    //启动ajax的方法
    do() {
        if (this.send) {
            return this;
        } else {
            //取得token并回传,设置在header
            const token = loginState.get();
            if (token) {
                this.xhr.setRequestHeader("token", token);  //用POST的时候一定要有这句
            }
            //访问发起前回调
            if (this.callback.fn_before) {
                this.callback.fn_before();
            }
            //标记状态
            this.send = true;
            let arg = this.serializeObject(this.config.data)
            // 如果为post方式 send方法中要添加数据
            if (this.config.method.toLowerCase() == "post") {
                this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");  //用POST的时候一定要有这句
                this.xhr.send(arg);
            } else {
                this.xhr.send();
            }
            return this;
        }
    },
    //成功回调
    then(callback) {
        this.callback.fn_then = callback;
        return this.do();
    },
    //失败回调
    catch(callback) {
        this.callback.fn_catch = callback;
        return this.do();
    },
    //完成回调
    complete(callback) {
        this.callback.fn_complete = callback;
        return this.do();
    },
    //进度条事件
    progress(callback) {
        this.callback.fn_progress = callback;
        return this.do();
    },
    before(callback) {
        this.callback.fn_before = callback();
        return this.do();
    }
}


//提供一个快捷的get方法
let get = function (url, data, type) {
    return new ajax(url, data, "get", type).do();
}
//提供一个快捷的post方法
let post = function (url, data, type) {
    return new ajax(url, data, "post", type).do();
}
const url = (param) => {
    return ports.server + param;
}

export default { ajax, get, post, ports, url }