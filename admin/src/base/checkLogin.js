import ajax from './ajax';
import token from 'loginState';
export default function(callback){
    let token=token.get();
    if(token){
        
    }else{
        callback();
    }
}