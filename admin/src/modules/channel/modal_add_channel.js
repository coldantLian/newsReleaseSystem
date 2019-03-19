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
            module_loading: false,
            submiting: false,
            module: "content",
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

    }

    handler_ok() {
        this.props.form.validateFields((err, values) => {

            if (!err) {
                this.setState({ submiting: true });
                ajax.post(
                    ajax.url(ajax.ports.channel.create),
                    values
                ).then(() => {
                    this.props.handler_getList();
                    this.props.handler_close();
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
                    >
                        {
                            getFieldDecorator("title", {
                                rules: [{
                                    required: true,
                                    message: "请输入频道标题"
                                }]
                            })(<Input placeholder="请输入标题" />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="类型"
                        hasFeedback
                    >
                        {
                            getFieldDecorator("module", {
                                rules: [{
                                    required: true,
                                    message: "请选择频道类型"
                                }]
                            })(
                                <RadioGroup
                                    onChange={(e) => this.setState({ module: e.target.value })}
                                >
                                    <Radio value={"content"}>内容</Radio>
                                    <Radio value={"simple"}>单页</Radio>
                                    <Radio value={"url"}>外部地址</Radio>
                                </RadioGroup>
                                )
                        }

                    </FormItem>
                    {/* 按module_type区分输入方式 */}
                    {


                        <FormItem
                            {...formItemLayout}
                            label="模块"
                            hasFeedback
                            
                            style={(this.state.module == "url") ? { display: "none" } : {}}
                        >
                            {

                                getFieldDecorator("param", {
                                    rules: [{
                                        required: true,
                                        message: "请选择内部模块"
                                    }]
                                })(
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
                                        placeholder="请选择内部模块" />
                                    )
                            }
                        </FormItem>
                    }

                    {/* 非内部模块时使用的方式 */}
                    {

                        <FormItem
                            {...formItemLayout}
                            label="URL"
                            hasFeedback
                            style={(this.state.module != "url") ? { display: "none" } : {}}
                        >
                            {
                                getFieldDecorator("param", {
                                    rules: [{
                                        required: true,
                                        message: "请输URL"
                                    }]
                                })(<Input placeholder="URL"  />)
                            }

                        </FormItem>

                    }
                    <FormItem
                        {...formItemLayout}
                        label="显示"
                        hasFeedback
                    >
                        {
                            getFieldDecorator("show", {
                                rules: [{
                                    required: true,
                                    message: "请设置状态"
                                }]
                            })(
                                <RadioGroup >
                                    <Radio value={false}>否</Radio>
                                    <Radio value={true}>是</Radio>
                                </RadioGroup>
                                )
                        }

                    </FormItem>
                </Form>
            </Modal >
        );
    }
}

AddSort = Form.create({})(AddSort);

export default connect(state => {
    return { state };
})(AddSort);
