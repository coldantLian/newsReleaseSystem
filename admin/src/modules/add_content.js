import React from 'react';
import ajax from '../base/ajax';

import SubPanel from '../component/sub_view_panel';
import {
    Form, Input, DatePicker, Col, Spin, Button, Select, Radio,
    Upload, message, Icon, Switch
} from 'antd';
import UE from '../component/ueditor';
import moment from 'moment';
import token from '../base/loginState';

import { browserHistory, hashHistory } from 'react-router';

import { validate, validateState, validation, validationResult } from '../base/validate';


const Option = Select.Option;
const RadioGroup = Radio.Group;
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

const timeFormat = "YYYY-MM-DD HH:mm:ss";

class AddContent extends React.Component {
    constructor(props) {
        super();
        this.state = this.getInitalState(props);
    }

    getInitalState(props) {
        return {//组件着态
            editMod: this.isEidt(props),
            loading: false,
            submiting: false,
            sort_list: [],
            //fromData
            content_id: this.isEidt(props) ? props.location.state.content_id : "", //编辑时有效
            contentText: ""

        }
    }

    isEidt(props) {
        if (props.location.pathname == "/content_edit") {
            return true;
        } else {
            return false;
        }
    }

    // 取编辑数据
    getEditRecord(content_id) {
        ajax.get(
            ajax.url(ajax.ports.content.getOne),
            { content_id }
        ).then((xhr) => {
            const response = xhr.response;
            //设置表单内容
            this.setState({
                sort_id: response.sort_id, //分类ID
                contentText: response.contentText
            });

            this.refs.content_editer.setContent(response.contentText);
            response.isTop = moment(response.isTop);
            response.beginTime = moment(response.beginTime);
            this.props.form.setFieldsValue(response);

        }).complete(() => {
            this.setState({
                loading: false,
                editLoaded: true
            });
        });
    }

    //第一次加载完成
    componentDidMount() {
        this.handler_get_sort();
        if (this.state.editMod) {
            this.getEditRecord(this.state.content_id);
        }
    }

    // 组件参数更新
    componentWillReceiveProps(nextProps) {
        if (!this.isEidt(nextProps)) {
            // 重置状态为添加模式
            if (this.state.editMod) {
                this.setState(this.getInitalState(nextProps));
                this.handler_get_sort();
            }
        }
    }


    handler_get_sort() {
        this.setState({ loading: true });
        ajax.get(
            ajax.url(ajax.ports.content.content_sort.list)
        ).then((xhr) => {
            this.setState({ sort_list: xhr.response.list });
        }).catch((error) => {

        }).complete(() => {
            this.setState({ loading: false });
        })
    }

    handler_getContentText() {
        // this.setState({ contentText: ueditor.getEditor("content_text").getContent() });
        this.state.contentText = this.refs.content_editer.getContent() || ""
    }

    handler_do_create() {
        this.handler_submit(false);
    }

    handler_do_draft() {
        this.handler_submit(true);
    }

    handler_submit(draft) {
        let url = ""
        if (this.state.editMod) {
            url = ajax.url(ajax.ports.content.update);
        } else {
            url = ajax.url(ajax.ports.content.create);
        }

        this.handler_getContentText();

        this.props.form.validateFields((err, values) => {
            if (!err && this.state.contentText.length > 0) {

                let formData = values;
                //取得data
                formData.contentText = this.state.contentText

                //编辑取ID
                if (this.state.editMod) {
                    formData.content_id = this.state.content_id;
                }
                //决定是否使用草稿模式
                formData.draft = draft;

                this.setState({ submiting: true });
                ajax.post(
                    url,
                    formData
                ).then((xhr) => {
                    //跳转到内容列表
                    hashHistory.push("/content_list")
                }).complete(() => {
                    this.setState({ submiting: false });
                });
            } else {
                if (this.state.contentText.length == 0) {
                    message.error("文章必需输入内容");
                } else {
                    message.error("表单中有未完成的项");
                }
            }
        });


    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        return (
            <SubPanel>
                <Spin spinning={this.state.loading}>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="所属分类"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("sort_id", {
                                    rules: [{
                                        required: true,
                                        message: "请输入分类"
                                    }]
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="输入分类"
                                        optionFilterProp="children"

                                    >
                                        {
                                            this.state.sort_list.map((v, k) => {
                                                return (
                                                    <Option value={v._id}>{v.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    )
                            }

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="标题"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("title", {
                                    rules: [{
                                        required: true,
                                        message: "请输入标题"
                                    }]
                                })(<Input placeholder="请输入标题" />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="子标题"
                            hasFeedback

                        >
                            {
                                getFieldDecorator("subTitle", {
                                    rules: [{
                                        required: true,
                                        message: "请输入子标题"
                                    }]
                                })(<Input placeholder="请输入子标题" />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="关键字"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("keyword", {
                                })(<Input placeholder='请输入网站关键字，并用","分割' />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="做者"
                            hasFeedback

                        >
                            {
                                getFieldDecorator("author", {
                                })(<Input placeholder='请输入做者名字' style={{ maxWidth: 200 }} />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="来源"
                            hasFeedback
                            validateStatus=""
                        >
                            {
                                getFieldDecorator("origin", {
                                })(<Input placeholder='输入来源' style={{ maxWidth: 200 }} />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="置顶有效期"
                            hasFeedback
                            validateStatus=""
                        >
                            {
                                getFieldDecorator('isTop', {
                                    rules: [{ type: 'object', required: true, message: 'Please select time!' }]
                                })(
                                    <DatePicker
                                        showTime
                                        placeholder="置顶日期之前为有效"
                                        format={timeFormat}
                                    />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="文章生效时间"
                            hasFeedback

                        >
                            {
                                getFieldDecorator('beginTime', {
                                    rules: [{ type: 'object', required: true, message: 'Please select time!' }]
                                })(
                                    <DatePicker
                                        showTime
                                        placeholder="请选择生效日期和时间"
                                        format={timeFormat}
                                    />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="可以评论"
                            hasFeedback
                        >
                            {
                                getFieldDecorator("isComment", {
                                    getVialueFromEvent(checked) {
                                        return checked;
                                    }
                                })(
                                    <Switch />
                                    )
                            }

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="是否隐藏"
                            hasFeedback
                            validateStatus=""
                        >
                            {
                                getFieldDecorator("show", {
                                    getVialueFromEvent(checked) {
                                        return checked;
                                    }
                                })(
                                    <Switch />
                                    )
                            }

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="是否显示"
                            hasFeedback
                            validateStatus=""
                        >
                            {
                                getFieldDecorator("isRecommend", {
                                    getVialueFromEvent(checked) {
                                        return checked;
                                    }
                                })(
                                    <Switch defaultChecked={true} />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="草稿状态"
                            hasFeedback
                            validateStatus=""
                        >
                            {
                                getFieldDecorator("draft", {
                                    getVialueFromEvent(checked) {
                                        return checked;
                                    }
                                })(
                                    <Switch />
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="封面图片"
                            hasFeedback
                            validateStatus=""
                        >
                            {
                                getFieldDecorator('titleImage', {
                                    valuePropName: 'file',
                                    getValueFromEvent: (e) => {
                                        if (e.file.status == "done") {
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
                                            this.props.form.getFieldValue("titleImage") ?
                                                <img src={`${ajax.url("/uploadfile/")}${this.props.form.getFieldValue("titleImage")}`} alt="" className="uploadedOneFile" /> :
                                                <Icon type="plus" className="selectOneFile" />
                                        }
                                    </Upload>
                                    )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="内容"
                            hasFeedback
                        >
                            <UE id="content_text" ref={"content_editer"} height={500} />
                        </FormItem>

                        <FormItem >
                            <Col xs={{ span: 24, offset: 0 }} sm={{ span: 14, offset: 2 }}>
                                <Button type="primary" htmlType="submit" loading={this.state.submiting}
                                    onClick={this.handler_do_create.bind(this)}
                                >保存</Button>
                                &emsp;
                            <Button type="dashed" htmlType="submit" loading={this.state.submiting}
                                    onClick={this.handler_do_draft.bind(this)}
                                >保存为草稿</Button>
                                &emsp;
                            <Button type="danger" htmlType="submit" loading={this.state.submiting}>重置</Button>
                            </Col>
                        </FormItem>
                    </Form>
                </Spin>
            </SubPanel >
        );
    }
}

export default Form.create({})(AddContent);