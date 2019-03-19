//默认状态
import immutable from 'immutable';

export default immutable.fromJS({
    message_queue:[],
    user:{
        token:""
    },
    view:{
        collapsed: false,
        isLogin:true,
        loginCallback:null     
    }
});