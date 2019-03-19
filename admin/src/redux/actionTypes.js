//动作
export default {
    create:(type,data)=>{
        return {"type":type,"data":data};
    },
    //左边栏控制
    COLLAPSED_VIEW_SIDER:Symbol("COLLAPSED_VIEW_SIDER"),
    //设置登示状态
    SET_LOGIN_STATE:Symbol("SET_LOGIN_STATE"),

    // 提交错误消息
    ADD_MESSAGE:Symbol('ADD_ERROR'),
    // 标记错误信息为已读
    CANCEL_MESSAGE:Symbol('CANCEL_ERROR')
}