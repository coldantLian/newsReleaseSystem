import React from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal
} from 'antd';

import ajax from '../../base/ajax';
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
export default class extends React.Component {
    state = {
        submiting: false,
        title: "",
        url: "",
        _id:""
    }

    componentDidMount() {
        this.setState({
            title: this.props.record.title,
            url: this.props.record.url,
            _id:this.props.record._id
        });
    }

    handler_ok() {
        this.setState({ submiting: true });
        ajax.post(
            ajax.url(ajax.ports.simple_page.update),
            {
                title: this.state.title,
                url: this.state.url,
                _id: this.state._id
            }
        ).then(() => {
            this.props.handler_getList();
            this.props.handler_close();
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
                title="添加单页"
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
                        label="单页标题"
                        hasFeedback
                        validateStatus=""

                    >
                        <Input placeholder="标题"
                            value={this.state.title}
                            onChange={(e) => this.setState({ title: e.target.value })}
                            ref={"input_name"}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="资源地址"
                        hasFeedback
                        validateStatus=""
                    >
                        <Input placeholder="网址"
                            value={this.state.url}
                            onChange={(e) => this.setState({ url: e.target.value })}
                        />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}