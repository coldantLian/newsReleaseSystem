import React from 'react';
import ReactDom from 'react-dom';
import ajax from '../base/ajax';

import SubPanel from '../component/sub_view_panel';
import {
    Form, Input, DatePicker, Col, Spin, Button, Select, Radio,
    Upload, message, Icon, Switch, Row
} from 'antd';

//临时方法，把echart对像引出来
const echarts = window.echarts;

export default class extends React.Component {

    componentDidMount() {
        //分类统计的饼图

        this.handler_getSortCount();

        this.handler_getSortHits();
    }

    handler_getSortCount() {
        ajax.get(
            ajax.url(ajax.ports.charts.content_sort_count)
        ).then((xhr) => {

            const list = xhr.response.chart;

            let domPieSortCount = ReactDom.findDOMNode(this.refs.pieSortCount);
            let pieSortCount = echarts.init(domPieSortCount);

            let legend_arr = [];
            for (let item of list) {
                legend_arr.push(item.name);
            }

            pieSortCount.setOption({
                title: {
                    text: '内容分类统计',
                    //subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: legend_arr
                },
                toolbox: {
                    show: true,
                    feature: {
                        //mark: { show: true },
                        //dataView: { show: true, readOnly: false },
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        //restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                series: [
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: [30, 110],
                        roseType: 'area',
                        max: 40,                // for funnel
                        sort: 'ascending',     // for funnel
                        data: list
                    }
                ]
            });
        });
    }

    handler_getSortHits() {

        ajax.get(
            ajax.url(ajax.ports.charts.content_sort_hits)
        ).then((xhr) => {

            const list = xhr.response.chart;

            let pieSortHits = echarts.init(ReactDom.findDOMNode(this.refs.pieSortHits));

            let legend_arr = [];
            for (let item of list) {
                legend_arr.push(item.name);
            }

            pieSortHits.setOption({
                title: {
                    text: '分类浏览量统计',
                    //subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: legend_arr
                },
                toolbox: {
                    show: true,
                    feature: {
                        //mark: { show: true },
                        //dataView: { show: true, readOnly: false },
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        //restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                series: [
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        roseType: 'area',
                        max: 40,                // for funnel
                        sort: 'ascending',     // for funnel                        
                        itemStyle: {
                            emphasis: {
                                color: [
                                    '#FF000', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                                    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
                                ]
                            }
                        },
                        data: list
                    }
                ]
            });
        });
    }

    render() {
        return (
            <SubPanel>
                <Row>
                    <Col span={12} ref={"pieSortCount"} style={{ height: 400 }}>col-12</Col>
                    <Col span={12} ref={"pieSortHits"} style={{ height: 400 }}>col-12</Col>
                </Row>

                <Row>
                    <Col span={24}>col-24</Col>
                </Row>
            </SubPanel>
        );
    }
}