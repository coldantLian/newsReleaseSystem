//处理过程
import types from './actionTypes';
import immutable from 'immutable';
import sysMsg from '../base/message';
import { message } from 'antd';
let action = {};


//设置左边栏状态
action[types.COLLAPSED_VIEW_SIDER] = (state, val) => {
    return state.setIn(["view", "collapsed"], val);
}


//添加错误信息
action[types.ADD_MESSAGE] = (state, msg) => {

    switch (msg.type) {
        case sysMsg.types.success:
            message.success(msg.message);
            break;
        case sysMsg.types.warning:
            message.warning(msg.message);
            break;
        case sysMsg.types.error:
            message.error(msg.message);
            break;
    }

    return state;
    // return state.update("message_queue", (v) => {
    //     return v.push(immutable.fromJS(msg));
    // });
}
// 取消错误信息状态
action[types.CANCEL_MESSAGE] = (state, index) => {
    return state.setIn(["message_queue", index], true);
}

//设置登陆状态
action[types.SET_LOGIN_STATE] = (state, data) => {
    const { isLogin, loginCallback } = data;
    if (isLogin == true) {
        let Callback = state.getIn(["view", "loginCallback"]);
        if (Callback) {
            Callback();
        }
        return state.setIn(["view", "isLogin"], isLogin).setIn(["view", "loginCallback"], undefined);
    } else {
        return state.setIn(["view", "isLogin"], isLogin).setIn(["view", "loginCallback"], loginCallback);
    }
}


export default action;