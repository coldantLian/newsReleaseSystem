import React from 'react';
import Link from 'next/link';

import Head from './component/head';
import Header from './component/index_header';
import IndexBanner from './component/index_banner';
import ScriptImport from './component/script_import';
import IndexMainView from './component/index/index_main_view';
import RecommendList from './component/index/recommend_list';
import Paging from './component/content_paging';
import Footer from './component/index_footer';
import PathBar from './component/path_bar';

import sp from './db/service_path';
import fq from './db/fetchQuery';


export default class extends React.Component {
    static async getInitialProps({ pathname, req, query }) {
        // 主表分页
        let id = query.id,
            pageNum = query.page || 1,
            pageSize = 10;
        //导航条
        let nav_list = await fq.find(
            sp(req).find,
            "channel",
            { show: true },
            { order_index: 1 }
        );
        //主视图列表
        let content_main_list = await fq.find(
            sp(req).find,
            "content",
            {
                show: true,
                draft: false,
                beginTime: { $lt: new Date(Date.now()) },
                sort_id: id
            },
            {
                isTop: -1, createTime: -1
            },
            pageNum,
            pageSize
        );
        // 推荐内容
        let recommend = await fq.find(
            sp(req).find,
            "content",
            {
                show: true,
                draft: false,
                beginTime: { $lt: new Date(Date.now()) },
                isRecommend: true
            },
            {
                createTime: -1
            },
            1,
            10
        );
        //对应分类的数据
        let sort_info = await fq.findOne(sp(req).findOne, "content_sort", id);
        return {
            nav_list: nav_list.list,
            main_view_list: content_main_list,
            recommend_list: recommend.list,
            sort_info: sort_info
        };
    }
    render() {
        const { url } = this.props;
        return (
            <div>
                <Head title={this.props.sort_info.name} />
                <IndexBanner />
                <Header channel_list={this.props.nav_list} />
                <div className="container">
                    <PathBar
                        list={
                            [
                                { url: "/", text: "首页" },
                                { text: this.props.sort_info.name }
                            ]
                        }
                    />
                    <div className="col-md-8" id="main_view">
                        <IndexMainView list={this.props.main_view_list.list} />
                        <Paging
                            pageNum={this.props.main_view_list.pageNum}
                            pageSize={this.props.main_view_list.pageSize}
                            total={this.props.main_view_list.count}
                            url={`/content/sort?id=${url.query.id}`}
                        />
                    </div>
                    {/* <!--右边栏--> */}
                    <div className="col-md-4" id="sidebar">
                        <div className="panel panel-default">
                            <div className="panel-heading">热门内容</div>
                            <div className="panel-body">
                                asdfasdf
					        </div>
                        </div>
                        <RecommendList list={this.props.recommend_list} />
                    </div>
                </div>
                <Footer />
                <ScriptImport />
            </div>
        );
    }
}