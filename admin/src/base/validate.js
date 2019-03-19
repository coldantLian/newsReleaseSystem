/*
*   数据验证组件，用于验证各种格式的表单项
    例子： 
        必填+手机号：validation(this.state.mobilePhone,[validate.mobile,validate.requre],true)
        选填：!!this.state.email && validation(this.state.email,validate.email,true)
    对像 说明   
    validationResult:可用于记录所有指定ID名称的验证项是否完全通过

*/

var validateState={
    success:"success",
    warning:"warning",
    error:"error"
}

//验证组
var validate={
    //必填
    "requre":function(val){
        if(!val && val !== 0 ){
            return false;
        }else{
            return true;
        }
    },
    "int":function(val){
        if(!val && val!==0 ){
            return true;
        } 
        var reg=/^\d*$/;
        
        return reg.test(val);
    },
    //对比
    "compare":function(val1,val2){
        
        if(val1 == val2){
            return true;
        }else{
            return false;
        }
    },
    //身份证
    identityCard:function(val){
        if(!val && val!==0 ){
            return true;
        }    
        //身份证号码位权值
        var factor=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]
        var validCode=["1","0","x","9","8","7","6","5","4","3","2",]
        try{
            //长度不是18位，不给通过
            if(parseInt(val).toString().length != 18){
                return false;
            }else{
                //加权取徐计算
                var number=val.substring(0,17);
                var count=0;
                for(var i=0;i<number.length;i++){
                    count+=Number(number[i])*factor[i];
                }
                var last=validCode[count % 11];
                var CardNumber=number.toString()+last;
                if(CardNumber.toUpperCase() == val.toUpperCase()){
                    return true;
                }else{
                    return false;
                }

            }
        }catch(ex){
            return false;
        }
        
    },
    //手机号
    mobile:function(val){
        if(!val && val!==0 ){
            return true;
        }
        var reg=/^1\d{10}$/;
        
        return reg.test(val);
    },
    //固定电话
    phone:function(val){
        if(!val && val!==0 ){
            return true;
        } 

        var reg=/[0\d{2}-\d{8}|0\d{2}-\d{7}|0\d{3}-\d{7}|0\d{3}-\d{8}]/; 
        return reg.test(val);
    },
    //电子邮件
    email:function(val){
        if(!val && val!==0 ){
            return true;
        } 
        
        var reg=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/; 
        return reg.test(val);
    },
    //日期
    date:function(val){

    }    
}
//用于统计验证结果数的对像
//items 字符串数组,传一组ID进来用于保存验证状态 
function validationResult(items){
    //记录验证对像
    this.validItem=items;
    //验证项Class对像，用于保存状态
    var itemClass=function(){
        this.state=true;
        this.set=function(b){
            this.state=b;
        }
    }

    //验证方法,如果所有项都为真就返回真
    this.isValid=function(){
        for(var i=0;i<this.validItem.length;i++){
            if(!this[this.validItem[i]].state){
                return false;
            }
        }
        return true;
    }

    //生成验证属性
    for(var i=0;i<this.validItem.length;i++){
        this[this.validItem[i]]=new itemClass();
    }

    return this;
}



/*
    测试方法，可成组加入验证柜则
    参数：
        str：要验证的字符串值
        items:要验证的项目，可为1可为数组 取自validate，或者是反回bool型的自定义函数 
        returnStateStr：bool型，表示是否要以字符串型式返回结果
        validationTarget:用于向统计对像发送验证结果，用一统计错误数
                         格式为:[validationResult对像，字段名称（string)]

        例子：
        第一步：
        this.vResult = new validationResult([
            "name", "sex", "identityCard", "birthday", "email", "mobilePhone", "alternativePhone"
        ]);
        第二步：
        validation(this.state.name, validate.requre, true, this.vResult.name)
        validation(this.state.birthday, validate.requre, true, this.vResult.birthday)
        第三步：
        this.vResult.isValid()


*/
function validation(str,items,returnStateStr,validationTarget){
    var result=true;
    
    //循环检测
    if(Object.prototype.toString.call(items) === '[object Array]'){
        for(var i=0;i<items.length;i++){
            if(!items[i](str)){
                result=false;
            }
        }
    }else{
        result=items(str);
    }
    //如果有validationResult 就向其填充
    if(validationTarget){
        validationTarget.set(result);
    }

    //返回结果
    if(returnStateStr){
        return (result?((str && str.length)?validateState.success:""):((str && str.length)?validateState.error:validateState.warning));
    }else{
        return result;
    }
}

export {validate,validateState,validation,validationResult};