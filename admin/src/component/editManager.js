import React from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal, Upload, message, Switch
} from 'antd';
import { connect, Provider } from 'react-redux';
import actionTypes from '../redux/actionTypes';
import sysMsg from '../base/message';
import ajax from '../base/ajax';
import token from '../base/loginState';


const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};
class EditManager extends React.Component {
    state = {
        loading: true,
        _id: ""

    }

    componentDidMount() {
        ajax.get(ajax.url(ajax.ports.base.get_manager_of_token)).then((xhr) => {
            this.setState({
                _id: xhr.response._id
            });

            this.props.form.setFieldsValue({ user_id: xhr.response.user_id });


        }).complete(() => {
            this.setState({ loading: false });
        })
    }

    handler_ok() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ submiting: true });
                const { user_id, password } = values;
                ajax.post(
                    ajax.url(ajax.ports.base.edit_id_and_password),
                    {
                        _id: this.state._id,
                        user_id,
                        password
                    }
                ).then(() => {
                    this.props.handler_close();
                    token.clear();
                    this.props.dispatch(actionTypes.create(actionTypes.SET_LOGIN_STATE, { isLogin: false }));
                }).catch((msg) => {

                }).complete(() => {
                    this.setState({ submiting: false });
                });
            }

        });

    }
    handler_cancel() {
        this.props.handler_close();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="修改管理员用户名密码"
                visible={this.props.show}
                onOk={this.handler_ok.bind(this)}
                onCancel={this.handler_cancel.bind(this)}
                okText="确认"
                cancelText="取消"
                confirmLoading={this.state.submiting}
            >
                <Spin spinning={this.state.loading}>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="用户名"
                            hasFeedback

                        >
                            {
                                getFieldDecorator("user_id", {
                                    rules: [{
                                        required: true,
                                        message: "请输入用户名"
                                    }]
                                })(<Input placeholder="用户名" />)
                            }

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                            type="password"
                            hasFeedback

                        >
                            {
                                getFieldDecorator("password", {
                                    rules: [{
                                        required: true,
                                        message: "请输入密码"
                                    }]
                                })(<Input placeholder="输入密码" type="password" />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="确认密码"
                            type="password"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("eq_password", {
                                    rules: [{
                                        required: true,
                                        message: "请确认密码"
                                    }, {
                                        validator: (rules, vaule, callback, formData) => {
                                            if (this.props.form.getFieldValue("password") !== formData.eq_password) {
                                                callback("两次输入的密码不一样");
                                            } else {
                                                callback();
                                            }
                                        },
                                        message: "两次输入的密码不一样"
                                    }]
                                })(<Input placeholder="再次输入密码" type="password" />)
                            }

                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

EditManager = Form.create({})(EditManager);

export default connect(state => {
    return { state };
})(EditManager);
