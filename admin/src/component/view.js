import React from 'react';
import { connect, Provider } from 'react-redux';
import { store } from '../redux/store';

import {
  Layout, Icon, Breadcrumb, Spin, Modal,
  Form, Input, Button,
  message, Dropdown, Menu, Avatar

} from 'antd';

import ViewMask from './view_mask';
import LoginModal from './loginModal';

import Nav from './view/nav';
import Mbx from './view/mbx';
import loginState from '../base/loginState';
import actionTypes from '../redux/actionTypes';
import UserMenu from './view/user_dw_menu';
import ajax from '../base/ajax';
import EditManager from './editManager';

const FormItem = Form.Item;
const { Header, Sider, Content } = Layout;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};


class MainView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      collapsed: props.state.getIn(["view", "collapsed"]),
      isLogin: props.state.getIn(["view", "isLogin"]),
      editManager: false
    };
  }
  handler_close_editManager() {
    this.setState({ editManager: false });
  }
  handler_show_editManager() {
    this.setState({ editManager: true });
  }

  componentDidMount() {
    const token = loginState.get();
    if (token) {
      //成功
      this.props.dispatch(actionTypes.create(actionTypes.SET_LOGIN_STATE, { isLogin: true }));
    } else {
      //失败
      this.props.dispatch(actionTypes.create(actionTypes.SET_LOGIN_STATE, { isLogin: false }));
    }
    ajax.get(ajax.url(ajax.ports.base.checkLogin)).do();
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      collapsed: nextProps.state.getIn(["view", "collapsed"]),
      isLogin: nextProps.state.getIn(["view", "isLogin"])
    });
  }

  toggle = () => {
    this.props.dispatch(actionTypes.create(actionTypes.COLLAPSED_VIEW_SIDER, !this.state.collapsed));
  }


  render() {

    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo">
            <span className="logo_title"> 网站项目后台</span>
          </div>
          {/*主导航*/}
          <Nav location={this.props.location} ref={"navList"} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} >
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            {/* 用户菜单 */}
            <UserMenu handler_show={() => this.handler_show_editManager()} />
          </Header>
          {/*面包屑*/}
          <Mbx location={this.props.location} style={{ margin: '16px' }} />
          <Content style={{ margin: '0px 16px 24px 16px', background: '#fff', minHeight: 280 }}>
            {
              this.props.children
            }
          </Content>
        </Layout>
        {/*登录框*/}
        {!this.state.isLogin && <LoginModal show={!this.state.isLogin} />}
        {this.state.editManager && <EditManager show={this.state.editManager} handler_close={() => this.handler_close_editManager()} />}
      </Layout>

    );
  }
}

// var connenter = connect((state) => {
//   return { state: state };
// });

// const NewMainView = connenter(MainView);


// export default NewMainView;

export default connect(state => ({ state: state }))(MainView);
