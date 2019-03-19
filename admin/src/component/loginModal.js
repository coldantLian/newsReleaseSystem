import React from 'react';
import { connect, Provider } from 'react-redux';
import {
  Modal, Icon,
  Form, Input, Button

} from 'antd';

import ajax from '../base/ajax';
import loginState from '../base/loginState';
import actionTypes from '../redux/actionTypes';


const FormItem = Form.Item;


class LoginModal extends React.Component {
  state = {
    user_id: "",
    password: "",
    submiting: false,
    error: false
  }

  componentDidMount() {
    
  }

  handler_enter(e) {
    if (e.charCode == "13") {
      this.handler_submit();
    }
  }

  handler_user_id_change(e) {
    this.setState({ user_id: e.target.value });
  }

  handler_password_change(e) {
    this.setState({ password: e.target.value });
  }

  handler_submit() {
    const { user_id, password } = this.state;
    this.setState({ submiting: true });
    ajax.post(
      ajax.url(ajax.ports.base.login),
      { user_id, password }
    ).then((xhr) => {
      //成功
      //保存登录状态
      loginState.set(xhr.response.token)
      this.props.dispatch(actionTypes.create(actionTypes.SET_LOGIN_STATE, { isLogin: true }));
      this.setState({ error: false });
      //window.location.reload();

    }).catch((msg, xhr) => {
      //失败
      this.setState({ error: true });
    }).complete(() => {
      this.setState({ submiting: false });
    });
  }

  handler_reset() {
    this.setState({ user_id: "", password: "" });
  }

  render() {
    return (
      <Modal
        title="请登录"
        visible={this.props.show}
        width={320}
        confirmLoading={this.state.submiting}
        closable={false}
        onOk={this.handler_submit.bind(this)}
        onCancel={this.handler_reset.bind(this)}
        cancelText="重置"
      >
        <Form onSubmit={this.handleSubmit}
          onKeyPress={this.handler_enter.bind(this)}
        >
          <FormItem
            hasFeedback
            validateStatus=""
            
          >
            <Input 
              
              value={this.state.user_id} prefix={<Icon type="user"
              style={{ fontSize: 13 }} />} placeholder="用户名"
              onChange={this.handler_user_id_change.bind(this)}
              
            />
          </FormItem>
          <FormItem
            hasFeedback
            validateStatus={this.state.error ? "error" : ""}
          >
            <Input value={this.state.password}
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              placeholder="请输密码"
              type="password"
              onChange={this.handler_password_change.bind(this)}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default connect(state => ({ state: state.get("view") }))(LoginModal);
