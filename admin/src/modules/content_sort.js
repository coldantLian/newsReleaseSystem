import React, { Component } from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal
} from 'antd';

import ajax from '../base/ajax';
import Modal_add from './content/modal_add_sort';
import Modal_edit from './content/modal_edit_sort';

import SubPanel from '../component/sub_view_panel';
import SubBar from '../component/sub_view_top_bar';

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
            ajax.url(ajax.ports.content.content_sort.list)
        ).then((xhr) => {
            this.setState({ list: xhr.response.list });
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
                ajax.url(ajax.ports.content.content_sort.remove),
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
            content: '分类删除后将不可恢复，您确认要这样做吗？',
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
            title: '分类名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            render: (text, record) => {
                return (
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal", width: "100%" }} title={record.remark}>
                        {
                            record.remark.substring(0, 40) + (record.remark.length > 40 ? "..." : "")
                        }
                    </div>
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
                        <Button type="primary">
                            <Icon type="arrow-up" />上移
                </Button>
                        <Button type="primary">
                            <Icon type="arrow-down" />下移
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
                            <Icon type="folder-add" />添加分类
                        </Button>
                        <Button type="primary"
                            disabled={(this.state.selectRecord.length==0)}
                            onClick={() => this.handler_remove()}
                        >
                            <Icon type="delete" />删除分类
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
