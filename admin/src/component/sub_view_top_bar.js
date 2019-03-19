import React from 'react';

export default class extends React.Component{
    render(){
        return (<div style={{ background: '#fff', paddingBottom: "10px" }}>{this.props.children}</div>);
    }
}