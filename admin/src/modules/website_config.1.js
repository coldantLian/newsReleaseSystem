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
        name: "",
        domain: "",
        keyword: "",
        copyright: "",
        websit_code: "",
        logo: "",
        email: "",
        phone_number: ""
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
            }
            ).complete(
            () => this.setState({ loading: false })
            )
    }

    handler_submit() {
        let formData = this.state;
        delete formData.loading;
        ajax.post(
            ajax.url(ajax.ports.base.getConfig),
            formData
        ).before(() => {
            this.setState({ loading: true });
        }).then(
            (xhr) => {
                this.setState(xhr.response);
            }
            ).complete(
            () => this.setState({ loading: false })
            )
    }

    //'success' 'warning' 'error' 'validating'
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <SubPanel>
                <Spin spinning={this.state.loading} size={"large"} tip="正在加载">
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="网站标题"
                            hasFeedback
                        >
                            <Input placeholder="请输入标题"
                                value={this.state.name}
                                onChange={e => this.setState({ name: e.target.value })}
                            />
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="网站域名"
                            hasFeedback
                        >
                            <Input placeholder="网站域名"
                                value={this.state.domain}
                                onChange={e => this.setState({ domain: e.target.value })}
                            />
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="全站关键字"
                            hasFeedback
                        >
                            <Input placeholder="请输入关键字并用“,”分开"
                                value={this.state.keyword}
                                onChange={e => this.setState({ keyword: e.target.value })}
                            />
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="版权声明文字"
                            hasFeedback
                        >
                            <Input placeholder="版权声明文字"
                                value={this.state.copyright}
                                onChange={e => this.setState({ copyright: e.target.value })}
                            />
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="网站备案号"
                            hasFeedback
                        >
                            <Input placeholder="网站备案号"
                                value={this.state.websit_code}
                                onChange={e => this.setState({ websit_code: e.target.value })}
                            />
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="联系邮件"
                            hasFeedback
                        >
                            <Input placeholder="请输入邮件地址"
                                value={this.state.email}
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="电话号码"
                            hasFeedback
                        >
                            <Input placeholder="请输入联系电话"
                                value={this.state.phone_number}
                                onChange={e => this.setState({ phone_number: e.target.value })}
                            />
                        </FormItem>
                    </Form>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="logo图片"
                            hasFeedback
                        >
                            <Upload
                                name={"file"}
                                headers={
                                    { token: token.get() }
                                }
                                showUploadList={false}
                                action={ajax.url(ajax.ports.base.upload)}
                                onChange={
                                    (info) => {
                                        if (info.file.status !== 'uploading') {

                                        }
                                        if (info.file.status === 'done') {
                                            message.success(`${info.file.name}上传完成`);
                                            this.setState({ logo: info.file.response.fileName });
                                        } else if (info.file.status === 'error') {
                                            message.error(`${info.file.name} file upload failed.`);
                                        }
                                    }
                                }
                            >
                                {
                                    this.state.logo ?
                                        <img src={`${ajax.url("/uploadfile/")}${this.state.logo}`} alt="" className="uploadedOneFile" /> :
                                        <Icon type="plus" className="selectOneFile" />
                                }

                            </Upload>
                        </FormItem>
                        <FormItem >
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 14, offset: 2 }}>
                                <Button type="primary" htmlType="submit" loading={this.state.submiting}
                                    onClick={() => this.handler_submit()}
                                >保存</Button>
                                &emsp;
                            <Button type="danger" htmlType="submit" loading={this.state.submiting}>重置</Button>
                            </Col>
                        </FormItem>
                    </Form>
                </Spin>

            </SubPanel>
        );
    }
}

export default Form.create({})(WebsiteConfig);