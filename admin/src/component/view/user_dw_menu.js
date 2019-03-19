import React from 'react';
import { connect } from 'react-redux';

import actionTypes from '../../redux/actionTypes';
import {
    Layout, Icon, Breadcrumb, Spin, Modal,
    Form, Input, Button,
    message, Dropdown, Menu, Avatar

} from 'antd';
import token from '../../base/loginState';
class UserMenu extends React.Component {

    handle_cancel() {
        token.clear();
        this.props.dispatch(actionTypes.create(actionTypes.SET_LOGIN_STATE, { isLogin: false }));
    }
    render() {
        const user_menu = (
            <Menu>
                <Menu.Item key="0">
                    <span onClick={() => this.props.handler_show()}>
                        <Icon type="key" />&emsp;修改管理员帐号
                    </span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3" >
                    <span onClick={() => {
                        this.handle_cancel();
                    }}>
                        <Icon type="lock" />&emsp;注销登录
                    </span>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="user_menu">
                <Dropdown overlay={user_menu} trigger={['click']}>
                    <a className={`ant-dropdown-link ${this.props.state.getIn(["view", "isLogin"]) ? "active" : ""}`} href="#">
                        <Avatar shape="square" size="large" icon="user" />
                    </a>
                </Dropdown>
            </div>
        );
    }
}
// export default UserMenu;
export default connect(state => ({ state }))(UserMenu);