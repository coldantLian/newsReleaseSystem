import React, { Component } from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal
} from 'antd';

import ajax from '../base/ajax';
import Modal_add from './ad/modal_add_ad';
import Modal_edit from './ad/modal_edit_ad';

import SubPanel from '../component/sub_view_panel';
import SubBar from '../component/sub_view_top_bar';
import moment from 'moment';
const ButtonGroup = Button.Group;
const { Header, Content } = Layout;


export default class extends Component {
    state = {
        loading: false,
        list: [],
        showAdd: false,
        showEdit: false,
        editRecord: undefined,
        selectRecord: []
    }
    //刷 新列表
    handler_getList() {
        this.setState({ loading: true });
        ajax.get(
            ajax.url(ajax.ports.ad.list)
        ).then((xhr) => {
            this.setState({ list: xhr.response });
        }).catch((error) => {

        }).complete(() => {
            this.setState({ loading: false });
        })
    }
    // 组件第一次加载完成
    componentDidMount() {
        this.handler_getList();
    }
    // 关闭添加窗口
    handler_close_add_modal() {
        this.setState({ showAdd: false });
    }
    // 打开编辑窗口
    handler_do_edit(record) {
        this.setState({
            showEdit: true,
            editRecord: record
        });
    }
    // 关闭编辑窗口
    handler_close_edit() {
        this.setState({
            showEdit: false,
            editRecord: undefined
        });
    }

    handler_select_change(keys, rows) {
        var records = [];
        for (var i = 0; i < rows.length; i++) {
            records.push(rows[i]._id);
        }
        this.setState({ selectRecord: records });
    }

    handler_remove(id) {
        let doRemove = () => {
            var ids = [];

            if (id) {
                ids.push(id)
            } else {

                ids = this.state.selectRecord
            }
            this.setState({ loading: true });
            ajax.post(
                ajax.url(ajax.ports.ad.remove),
                { "ids": ids }
            ).then(() => {
                this.handler_getList();
            }).catch((msg) => {

            }).complete(() => {
                this.setState({ loading: false });
            });
        }

        Modal.confirm({
            title: '请确认操作',
            content: '单页删除后将不可恢复，您确认要这样做吗？',
            onOk() {
                doRemove();
            },
            onCancel() {

            },
        });
    }

    //'success' 'warning' 'error' 'validating'
    render() {
        //定义表头
        const columns = [{
            title: '广告名称',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '类型',
            dataIndex: 'sort_key',
            key: 'sort_key'
        }, {
            title: '目标地址',
            dataIndex: 'url',
            key: 'url',
            render: (text, record) => {
                return (
                    <a href={record.url} target="_blank">{record.url}</a>
                );
            }
        }, {
            title: '图片',
            key: 'photo',
            render: (text, record) => {
                return (
                    <img
                        src={`/uploadfile/${record.photo}`}
                        style={{
                            height: '50px', width: 'auto', display: 'block'
                        }}
                    />
                );
            }
        }, {
            title: '显示',
            dataIndex: 'show',
            key: 'show',
            render: (text, record) => {
                return (
                    record.show ? "是" : "否"
                );
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, record) => {
                return (
                    moment(record.createTime).format("YYYY-MM-DD HH-mm-ss")
                );
            }
        }, {
            title: '操作',
            key: '_id',
            render: (text, record) => (
                <span>
                    <Button.Group size={"small"}>
                        <Button type="primary"
                            onClick={() => this.handler_do_edit(record)}
                        >
                            <Icon type="edit" />编辑
                        </Button>
                    </Button.Group>
                    &emsp;
                    <Button type="primary" size={"small"}
                        onClick={() => this.handler_remove(record._id)}
                    >
                        <Icon type="delete" />删除
                    </Button>
                </span>
            ),
        }];
        return (
            <SubPanel>
                <SubBar>
                    <ButtonGroup>
                        <Button type="primary" onClick={() => this.setState({ showAdd: true })}>
                            <Icon type="folder-add" />添加广告
                        </Button>
                        <Button type="primary"
                            disabled={(this.state.selectRecord.length == 0)}
                            onClick={() => this.handler_remove()}
                        >
                            <Icon type="delete" />删除广告
                        </Button>
                    </ButtonGroup>
                </SubBar>
                <Content>
                    <Spin spinning={this.state.loading} size={"large"} tip="正在加载">
                        <Table columns={columns}
                            dataSource={this.state.list}
                            rowSelection={{ onChange: this.handler_select_change.bind(this) }}
                            bordered
                            pagination={false}

                        />
                    </Spin>
                </Content>
                {
                    this.state.showAdd && <Modal_add
                        show={this.state.showAdd}
                        handler_close={this.handler_close_add_modal.bind(this)}
                        handler_getList={this.handler_getList.bind(this)}
                    />}
                {
                    this.state.showEdit && <Modal_edit
                        record={this.state.editRecord}
                        show={this.state.showEdit}
                        handler_close={this.handler_close_edit.bind(this)}
                        handler_getList={this.handler_getList.bind(this)}
                    />
                }
            </SubPanel>
        );
    }
}
