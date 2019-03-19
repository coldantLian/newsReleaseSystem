import React from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal, Radio, Cascader,
    Switch
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
class AddManager extends React.Component {
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

        }
    }

    componentDidMount() {

    }

    handler_ok() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ submiting: true });
                ajax.post(
                    ajax.url(ajax.ports.manager.create),
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
                        label="用户ID"
                        hasFeedback
                    >
                        {
                            getFieldDecorator("user_id", {
                                rules: [{
                                    required: true,
                                    message: "请输用户ID"
                                },{
                                    pattern:new RegExp("^[a-zA-Z0-9_@.]{2,30}$") ,
                                    message:"由英文字母、数字、下划、@ 和 . 线组成,长度为2到30个"
                                }]
                            })(<Input placeholder="由英文字母、数字、下划、@ 和 . 线组成" />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                        hasFeedback
                    >
                        {
                            getFieldDecorator("password", {
                                rules: [{
                                    required: true,
                                    message: "请输密码"
                                },{
                                    min:5,
                                    message:"密码最短不能少于5个字符"
                                },{
                                    max:128,
                                    message:"密码长度最大不要超过128个字符"
                                }]
                            })(<Input type="password" placeholder="由英文字母、数字、下划、@ 和 . 线组成" />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="昵称"
                        hasFeedback
                    >
                        {
                            getFieldDecorator("name", {
                                rules: [{
                                    required: true,
                                    message: "请输入管理员名字或称呼"
                                }]
                            })(<Input placeholder="" />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="锁定状态"
                        hasFeedback
                    >
                        {
                            getFieldDecorator("locked", {
                                
                            })(<Switch defaultChecked={false}/>)
                        }
                    </FormItem>
                </Form>
            </Modal >
        );
    }
}

AddManager = Form.create({})(AddManager);

export default connect(state => {
    return { state };
})(AddManager);
