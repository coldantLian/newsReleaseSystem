import React, { Component } from 'react';
import {
    Form, Input, DatePicker, Col, Spin, Button,
    Table, Icon, Layout, Modal
} from 'antd';
import { Link } from 'react-router';
import ajax from '../base/ajax';
import Modal_add from './content/modal_add_sort';
import Modal_edit from './content/modal_edit_sort';

import SubPanel from '../component/sub_view_panel';
import SubBar from '../component/sub_view_top_bar';
import { hashHistory } from 'react-router';
import moment from 'moment';


const ButtonGroup = Button.Group;
const { Header, Content } = Layout;

export default class extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            sort_list: [], //分类列表
            list: [], //内容列表
            showAdd: false,
            showEdit: false,
            editRecord: undefined,
            selectRecord: [],
            selectKeys: [],
            //分页 defaultCurrent={3} total={500}
            pageSize: 10,
            pageNumber: 1,
            recordCount: 0,
            //查询
            keyword: "",
            is_draft: false,
            //排序
            order_field: "createTime",
            order_direct: "descend",
            //筛选
            filters: {}
        };
    }

    componentDidMount() {
        this.handler_getSortList(this.handler_getList.bind(this));
    }
    //取得分类列表
    handler_getSortList(callback) {
        this.setState({ loading: true });
        ajax.get(
            ajax.url(ajax.ports.content.content_sort.list)
        ).then((xhr) => {
            this.setState({ sort_list: xhr.response.list });
            callback();
        }).complete(() => {
            this.setState({ loading: false });
        })
    }
    //得到列表
    handler_getList() {
        ajax.get(
            ajax.url(ajax.ports.content.getList),
            {
                // keyword, pageNum, pageSize, order_field, order_direct ,filters
                keyword: this.state.keyword,
                pageNumber: this.state.pageNumber,
                pageSize: this.state.pageSize,
                order_field: this.state.order_field,
                order_direct: this.state.order_direct,
                filters: JSON.stringify(this.state.filters)
            }
        ).before(() => {
            this.setState({ loading: true });
        }).then((xhr) => {
            this.setState({
                list: xhr.response.list,
                recordCount: xhr.response.count
            });
        }).complete(() => {
            this.setState({ loading: false });
        });
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
        this.setState({ selectRecord: records, selectKeys: keys });
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
                ajax.url(ajax.ports.content.remove),
                { "ids": ids }
            ).then(() => {
                this.handler_getList();
                this.setState({ selectRecord: [] });
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

    handler_table_change(pagination, filters, sorter) {
        let filter_obj = {};
        for (let key in filters) {
            if (filters[key].length) {
                filter_obj[key] = filters[key]
            }
        }
        this.setState({
            //设置排序
            order_field: sorter.field || "",
            order_direct: sorter.order || "",
            //页码 current: 1, pageSize: 10
            pageSize: pagination.pageSize,
            pageNumber: pagination.current,
            //过滤
            filters: filter_obj,
            loading: true
        });
        ajax.get(
            ajax.url(ajax.ports.content.getList),
            {
                // keyword, pageNum, pageSize, order_field, order_direct ,filters
                keyword: this.state.keyword,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                order_field: sorter.field || "",
                order_direct: sorter.order || "",
                filters: JSON.stringify(filter_obj)
            }
        ).then((xhr) => {
            this.setState({
                list: xhr.response.list,
                recordCount: xhr.response.count
            });
        }).complete(() => {
            this.setState({ loading: false });
        });
    }

    getSortName(sort_id) {
        for (let i = 0; i < this.state.sort_list.length; i++) {
            if (this.state.sort_list[i]._id == sort_id) {

                return this.state.sort_list[i].name;
            }
        }
        return false;
    }

    render() {
        const me = this;
        //定义表头
        const columns = [{
            title: '所属分类',
            dataIndex: 'sort_id',
            key: 'sort_id',
            filters: me.state.sort_list.map((v, k) => {
                return { text: v.name, value: v._id };
            }),
            render(record) {
                return me.getSortName(record);
            }
        }, {
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            sorter: true,
            width:"85",
            //'ascend' 'descend' false
            sortOrder: this.state.order_field == "createTime" &&this.state.order_direct,
            render(v, record) {
                return (
                    <div className="tableColumnTime">
                        <span className="date">{moment(v).format("YYYY/MM/DD")}</span>
                        <span className="time">{moment(v).format("HH:mm:ss")}</span>
                    </div>
                )
            }
        }, {
            title: '置顶',
            dataIndex: 'isTop',
            key: 'isTop',
            sorter: true,
            sortOrder: this.state.order_field == "isTop" && this.state.order_direct,
            width:"85",
            render(v, record) {
                const nowDate = new Date(Date.now()), outDate = new Date(v);
                return (
                    <div className={`tableColumnTime ${outDate > nowDate ? "active" : ""}`}>
                        <span className="date">{moment(v).format("YYYY/MM/DD")}</span>
                        <span className="time">{moment(v).format("HH:mm:ss")}</span>
                    </div>
                )
            }
        }, {
            title: '作者',
            dataIndex: 'author',
            key: 'author'
        }, {
            title: '显示',
            dataIndex: 'show',
            key: 'show',
            width: 80,
            filters: [
                { text: "显示", value: true },
                { text: "隐藏", value: false }
            ],
            render(value, record) {
                return (<span style={{ textAlign: "center", display: "block" }}>{value ? "是" : "否"}</span>)
            }
        }, {
            title: '评论',
            dataIndex: 'isComment',
            key: 'isComment',
            render(value, record) {
                return (<span style={{ textAlign: "center", display: "block" }}>{value ? "是" : "否"}</span>)
            }
        }, {
            title: '草稿',
            dataIndex: 'draft',
            key: 'draft',
            render(value, record) {
                return (<span style={{ textAlign: "center", display: "block" }}>{value ? "是" : "否"}</span>)
            }
        }, {
            title: '操作',
            key: '_id',
            render: (value, record) => (
                <span>
                    <Button.Group size={"small"}>
                        <Link className="ant-btn ant-btn-primary" to={{ pathname: "/content_edit", query: { content_id: record._id }, state: { content_id: record._id } }}>
                            <Icon type="edit" />编辑
                            </Link>
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
                        <Button type="primary"
                            onClick={() => hashHistory.push("/content_add")}
                        >
                            <Icon type="folder-add" />添加内容
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
                        <Table
                            columns={columns}
                            dataSource={this.state.list}
                            rowSelection={{ onChange: this.handler_select_change.bind(this), selectedRowKeys: this.state.selectKeys }}
                            bordered
                            pagination={{ defaultCurrent: this.state.pageNumber, total: this.state.recordCount, pageSize: this.state.pageSize }}
                            onChange={(pagination, filters, sorter) => { this.handler_table_change(pagination, filters, sorter) }}

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