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
        name: "",
        remark: "",
        _id:""
    }

    componentDidMount() {
        this.setState({
            name: this.props.record.name,
            remark: this.props.record.remark,
            _id:this.props.record._id
        });
    }

    handler_ok() {
        this.setState({ submiting: true });
        ajax.post(
            ajax.url(ajax.ports.content.content_sort.update),
            {
                name: this.state.name,
                remark: this.state.remark,
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
                title="Modal"
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
                        label="分类名称"
                        hasFeedback
                        validateStatus=""

                    >
                        <Input placeholder="分类名称"
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="分类说明"
                        hasFeedback
                        validateStatus=""
                    >
                        <Input placeholder="分类说明"
                            value={this.state.remark}
                            onChange={(e) => this.setState({ remark: e.target.value })}
                        />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}