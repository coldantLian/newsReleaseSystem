import React from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal, Upload, message,Switch
} from 'antd';
import { connect, Provider } from 'react-redux';
import actionType from '../../redux/actionTypes';
import sysMsg from '../../base/message';
import ajax from '../../base/ajax';
import token from '../../base/loginState';
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
class AddSort extends React.Component {
    state = {
        submiting: false,
        title: "",
        url: "",
        photo: "",
        show: true,
        sort_key:""
    }

    componentDidMount() {
        this.refs.input_name.focus();
    }

    handler_ok() {
        this.setState({ submiting: true });
        ajax.post(
            ajax.url(ajax.ports.ad.create),
            {
                title: this.state.title,
                url: this.state.url,
                photo: this.state.photo,
                show: this.state.show,
                sort_key:this.state.sort_key

            }
        ).then(() => {
            this.props.handler_getList();
            this.props.handler_close();
            this.props.dispatch(actionType.create(actionType.ADD_MESSAGE, new sysMsg("添加完成", sysMsg.types.success)))
        }).catch((msg) => {
            alert(msg);
        }).complete(() => {
            this.setState({ submiting: false });
        });
    }
    handler_cancel() {
        this.props.handler_close();
    }

    render() {
        return (
            <Modal
                title="添加广告"
                visible={this.props.show}
                onOk={this.handler_ok.bind(this)}
                onCancel={this.handler_cancel.bind(this)}
                okText="确认"
                cancelText="取消"
                confirmLoading={this.state.submiting}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="广告名称"
                        hasFeedback
                        validateStatus=""

                    >
                        <Input placeholder="广告名称"
                            value={this.state.title}
                            onChange={(e) => this.setState({ title: e.target.value })}
                            ref={"input_name"}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="类型关键字"
                        hasFeedback
                        validateStatus=""

                    >
                        <Input placeholder="广告名称"
                            value={this.state.sort_key}
                            onChange={(e) => this.setState({ sort_key: e.target.value })}
                            ref={"input_name"}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="链接地址"
                        hasFeedback
                        validateStatus=""
                    >
                        <Input placeholder="网址"
                            value={this.state.url}
                            onChange={(e) => this.setState({ url: e.target.value })}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="广告图"
                        hasFeedback
                        validateStatus=""
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
                                        this.setState({ photo: info.file.response.fileName });
                                    } else if (info.file.status === 'error') {
                                        message.error(`${info.file.name} file upload failed.`);
                                    }
                                }
                            }
                        >
                            {
                                this.state.photo ?
                                    <img src={`${ajax.url("/uploadfile/")}${this.state.photo}`} alt="" className="uploadedOneFile" /> :
                                    <Icon type="plus" className="selectOneFile" />
                            }

                        </Upload>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否显示"
                        hasFeedback
                        validateStatus=""
                    >
                        <Switch checked={this.state.show} onChange={checked => this.setState({ show: checked })} />
                    </FormItem>


                </Form>
            </Modal>
        );
    }
}

export default connect(state => {
    return { state };
})(AddSort);
