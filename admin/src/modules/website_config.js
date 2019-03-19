import React, { Component } from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button, Select, Radio,
    Upload, message, Icon
} from 'antd';
import SubPanel from '../component/sub_view_panel';
import token from '../base/loginState';
import ajax from '../base/ajax';
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
    },
};

class WebsiteConfig extends Component {
    state = {
        loading: false,
        //form
        logo: "",

    }

    componentDidMount() {
        this.handler_get_config();
    }

    handler_get_config() {
        ajax.get(ajax.url(ajax.ports.base.getConfig)).before(() => {
            this.setState({ loading: true });
        }).then(
            (xhr) => {
                this.setState(xhr.response);
                //用新方法设置表单所有的值 
                this.props.form.setFieldsValue(xhr.response);
            }).complete(
            () => {
                this.setState({ loading: false })
            }
            );
    }

    handler_submit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                ajax.post(
                    ajax.url(ajax.ports.base.getConfig),
                    values
                ).before(() => {
                    this.setState({ loading: true });
                }).then(xhr => this.setState(xhr.response))
                .complete(() => this.setState({ loading: false }));
            }
        });
    }


    //'success' 'warning' 'error' 'validating'
    render() {
        const { getFieldDecorator } = this.props.form;
        var me = this;
        return (
            <SubPanel>
                <Spin spinning={this.state.loading} size={"large"} tip="正在加载">
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="网站名称"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("name", {
                                    rules: [{
                                        required: true,
                                        message: "请输入网站的名称"
                                    }]
                                })(<Input placeholder="请输入标题" />)
                            }

                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="网站域名"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("domain", {
                                    rules: [{
                                        required: true,
                                        message: "请输入网站的域名"
                                    }]
                                })(<Input placeholder="IP地址或域名" />)
                            }
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="全站关键字"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("keyword", {

                                })(<Input placeholder="请输入关键字并用“,”分开" />)
                            }
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="版权声明文字"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("copyright", {
                                    rules: [{
                                        required: true,
                                        message: "版权声明文字必需填写"
                                    }]
                                })(<Input placeholder="版权声明文字" />)
                            }
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="网站备案号"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("websit_code", {

                                })(<Input placeholder="网站备案号" />)
                            }

                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="联系邮件"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("email", {
                                    rules: [{
                                        pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                                        message: "请输入正确的邮件地址"
                                    }]
                                })(<Input placeholder="请输入邮件地址" />)
                            }
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="电话号码"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("phone_number", {
                                    rules: [{
                                        pattern: /^1\d{10}$/,
                                        message: "请输入正确的手机号码"
                                    }]
                                })(<Input placeholder="请输入联系电话" />)
                            }
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="logo图片"
                            hasFeedback
                        >
                            {
                                getFieldDecorator('logo', {
                                    valuePropName: 'file',
                                    getValueFromEvent: (e) => {
                                        if (e.file.status == "done") {
                                            me.setState({ logo: e.file.response.fileName });
                                            return e.file.response.fileName;
                                        }
                                    },
                                })(
                                    <Upload
                                        name={"file"}
                                        headers={
                                            { token: token.get() }
                                        }
                                        showUploadList={false}
                                        action={ajax.url(ajax.ports.base.upload)}

                                    >
                                        {
                                            this.state.logo ?
                                                <img src={`${ajax.url("/uploadfile/")}${this.state.logo}`} alt="" className="uploadedOneFile" /> :
                                                <Icon type="plus" className="selectOneFile" />
                                        }
                                    </Upload>
                                    )
                            }

                        </FormItem>
                        <FormItem >
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 14, offset: 2 }}>
                                <Button type="primary" htmlType="submit" loading={this.state.submiting}
                                    onClick={(e) => this.handler_submit(e)}
                                >保存</Button>
                                &emsp;
                            <Button type="danger" htmlType="button" loading={this.state.submiting}>重置</Button>
                            </Col>
                        </FormItem>
                    </Form>
                </Spin>
            </SubPanel>
        );
    }
}

export default Form.create({})(WebsiteConfig);