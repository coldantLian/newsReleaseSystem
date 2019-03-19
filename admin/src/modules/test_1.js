import React from 'react';
import ajax from '../base/ajax.js';
export default class extends React.Component {

    componentDidMount() {
        // let response, err;
        // var get_Channel_list = new Promise((resolve, reject) => {
        //     // ... some code
        //     ajax.get(
        //         ajax.url(ajax.ports.channel.list)
        //     ).then((xhr) => {
        //         response = xhr.response;
        //         resolve();
        //     }).catch((error, xhr) => {
        //         err = error;
        //         response = xhr.response;
        //         reject();
        //     });
        // });

        // var doGet = async () => {
        //     await get_Channel_list;
        //     console.log(response, err);
        // }

        // doGet();

        // let result=fetch('/service/find', {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         model_name: "channel",
        //         $where: { show: true },
        //         order: { order_index: 1 }
        //     })
        // }).then((json)=>{
        //     console.log(json.json());
        // });
    }

    render() {



        return (<h1>测试组件1</h1>);
    }
}