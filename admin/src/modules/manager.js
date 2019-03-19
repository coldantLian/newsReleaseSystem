import React, { Component } from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal, message
} from 'antd';

import ajax from '../base/ajax';
import Modal_add from './manager/modal_add_manager';
import Modal_edit from './manager/modal_edit_manager';

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
            ajax.url(ajax.ports.manager.list)
        ).then((xhr) => {
            this.setState({
                list: xhr.response
            });
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
                ajax.url(ajax.ports.manager.remove),
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

    isFirstOrLast(id) {
        const list = this.state.list;
        for (let index in list) {
            if (list[index]._id == id) {
                //检查是不两头
                if (index == 0) {
                    return "first";
                } else if (index == list.length - 1) {
                    return "last";
                }
            }
        }
        return null;
    }

    handler_order(id, direct) {
        const list = this.state.list;
        let id_a, id_b, find;
        for (let index in list) {

            if (list[index]._id == id) {
                //检查是不两头
                if (Number(index) == 0 && direct == -1) {
                    message.warning("第一行不能再上移");
                    return;
                } else if ((Number(index) == (list.length - 1)) && (direct == 1)) {
                    message.warning("最后一行不能再下移");
                    return;
                }

                //分上下移动
                id_a = list[Number(index)]._id;
                id_b = list[Number(index) + direct]._id;
                find = true;
            }
        }
        //如果找到
        if (find) {
            ajax.post(
                ajax.url(ajax.ports.channel.order),
                { id_a, id_b }
            ).before(() => {
                this.setState({ loading: true });
            }).then((xhr) => {
                this.handler_getList();
            }).complete(() => {
                this.setState({ loading: false });
            })
        }
    }

    render() {
        const me = this;
        //定义表头
        const columns = [{
            title: '用户名',
            dataIndex: 'user_id',
            key: 'user_id'
        }, {
            title: '昵称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '超级用户',
            dataIndex: 'is_admin',
            key: 'is_admin',
            render: (v) => {
                return (<span style={v ? { color: "#F00" } : { color: "#999" }}>{v ? "是" : "否"}</span>);
            }
        }, {
            title: '状态',
            dataIndex: 'locked',
            key: 'locked',
            render: (v) => {
                return (<span style={v ? { color: "#F00" } : { color: "#999" }}>{v ? "不可用" : "可用"}</span>);
            }
        }, {
            title: '操作',
            dataIndex: '_id',
            key: '_id',
            render: (id, record) => (
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
                            <Icon type="folder-add" />添加管理员
                        </Button>
                        <Button type="primary"
                            disabled={(this.state.selectRecord.length == 0)}
                            onClick={() => this.handler_remove()}
                        >
                            <Icon type="delete" />删除
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
