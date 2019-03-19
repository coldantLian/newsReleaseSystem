import React from 'react';
import { Layout } from 'antd';

export default class extends React.Component {
    render() {
        return (<Layout style={{backgroundColor:"#FFF",padding:"12px"}}>
            {this.props.children}
        </Layout>);
    }
}