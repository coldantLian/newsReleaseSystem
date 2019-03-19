// 错误信息结构体
class message{
    constructor(msg,type){
        this.message=msg;
        this.read=false;
        this.type=type;
    }
}
message.types={
    success:1,
    warning:2,
    error:3
}

export default message;