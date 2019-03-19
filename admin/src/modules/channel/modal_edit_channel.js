import React from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal, Radio, Cascader
} from 'antd';
import { connect, Provider } from 'react-redux';
import actionType from '../../redux/actionTypes';
import sysMsg from '../../base/message';
import ajax from '../../base/ajax';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
    // title:{type:String}, //标题
    // module:{type:String},
    // param:{type:String},
    // order_index:{type:Number},
    // show:{type:Boolean}   
    constructor(props) {
        super();
        this.state = {
            submiting: false,
            //form
            _id: props.record._id,
            title: props.record.title,
            module: props.record.module,
            param: [props.record.param],
            order_index: props.record.order_index,
            show: props.record.show,
            //下拉选项
            content_sort_list: [],
            simple_list: []
        }
        for (let item of props.content_sort_list) {
            this.state.content_sort_list.push({ value: item._id, label: item.name });
        }

        for (let item of props.simple_list) {
            this.state.simple_list.push({ value: item._id, label: item.title });
        }
    }

    componentDidMount() {
        this.refs.input_name.focus();
    }



    handler_ok() {
        this.setState({ submiting: true });
        ajax.post(
            ajax.url(ajax.ports.channel.update),
            {
                _id:this.state._id,
                title: this.state.title,
                module: this.state.module,
                param: this.state.param,
                order_index: this.state.order_index,
                show: this.state.show
            }
        ).then(() => {
            this.props.handler_getList();
            this.props.handler_close();
        }).complete(() => {
            this.setState({ submiting: false });
        });
    }

    handler_cancel() {
        this.props.handler_close();
    }

    handler_module_change(v) {
        this.setState({ module: v });
    }

    handler_param_change(v) {
        this.setState({ param: v });
    }
    render() {
        return (
            <Modal
                title="添加频道"
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
                        label="标题"
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
                        label="显示"
                        hasFeedback
                        validateStatus=""
                    >
                        <RadioGroup
                            value={this.state.module}
                            onChange={
                                (e) => this.handler_module_change(e.target.value)
                            }
                        >
                            <Radio value={"content"}>内容</Radio>
                            <Radio value={"simple"}>单页</Radio>
                            <Radio value={"url"}>外部地址</Radio>
                        </RadioGroup>
                    </FormItem>
                    {/* 按module_type区分输入方式 */}
                    {

                        (this.state.module == "content" || this.state.module == "simple") &&
                        (<FormItem
                            {...formItemLayout}
                            label="模块类型"
                            hasFeedback
                            validateStatus=""
                        >
                            <Cascader
                                options={
                                    (
                                        this.state.module == "content"
                                            ? this.state.content_sort_list
                                            : this.state.module == "simple"
                                                ? this.state.simple_list
                                                : []
                                    )
                                }
                                value={this.state.param}
                                onChange={(value) => this.handler_param_change(value)}
                                placeholder="请选择内部模块" />
                        </FormItem>)
                    }

                    {/* 非内部模块时使用的方式 */}
                    {
                        (this.state.module == "url") && (<FormItem
                            {...formItemLayout}
                            label="URL"
                            hasFeedback
                            validateStatus=""
                        >
                            <Input placeholder="URL"
                                value={this.state.param}
                                onChange={(e) => this.setState({ param: e.target.value })}
                                ref={"input_name"}
                            />
                        </FormItem>)
                    }
                    <FormItem
                        {...formItemLayout}
                        label="显示"
                        hasFeedback
                        validateStatus=""
                    >
                        <RadioGroup
                            value={this.state.show}
                            onChange={e => this.setState({ show: e.target.value })}
                        >
                            <Radio value={false}>否</Radio>
                            <Radio value={true}>是</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </Modal >
        );
    }
}

export default connect(state => {
    return { state };
})(AddSort);
