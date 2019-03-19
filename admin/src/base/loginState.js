export default {
    //设置状态
    set(tokenStr){
        window.localStorage.setItem("token",tokenStr);
    },
    //取得状态
    get(){
        return window.localStorage.getItem("token");
    },
    //清除状态
    clear(){
        window.localStorage.removeItem("token");
    }
}