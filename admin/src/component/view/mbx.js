import React from 'react';
import { Breadcrumb, Icon } from 'antd';
import sitemap from '../../base/sitemap';
//引处路由组件
import { Link } from 'react-router';


export default class extends React.Component {

    create_path() {
        if (sitemap[this.props.location.pathname]) {
            return sitemap[this.props.location.pathname];
        } else {
            return [];
        }
    }

    createPathEl() {
        let path = this.create_path();
        var pathEl = [];
        for (var i = 0; i < path.length; i++) {
            pathEl.push(
                <Breadcrumb.Item >
                    <Link to={path[i].link}>
                    <Icon type={path[i].icon || "smile-o"} />&nbsp;
                    {path[i].title}
                    </Link>
                </Breadcrumb.Item>
            )
        }
        return pathEl;
    }

    render() {

        return (<Breadcrumb mode="inline" className="view_Breadcrumb" style={this.props.style}>
            <Breadcrumb.Item >
                <Link to="/">
                    <Icon type="home" />
                    首页
                </Link>
            </Breadcrumb.Item>
            {
                this.createPathEl()
            }
        </Breadcrumb>);
    }
}