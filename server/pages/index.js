import React from 'react';
import Link from 'next/link';

import Head from './component/head';
import Header from './component/index_header';
import IndexBanner from './component/index_banner';
import ScriptImport from './component/script_import';
import IndexMainView from './component/index/index_main_view';
import RecommendList from './component/index/recommend_list';
import Footer from './component/index_footer';

import sp from './db/service_path';
import fq from './db/fetchQuery';


export default class extends React.Component {
    static async getInitialProps(arg) {
        const { pathname, query, asPath, req, res, jsonPageRes, err } = arg;
        //导航条11
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
                beginTime: { $lt: new Date(Date.now()) }
            },
            {
                isTop: -1, createTime: -1
            },
            1,
            10
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

        //beginTime
        let top_ads = await fq.find(
            sp(req).find,
            "ad",
            {
                show: true,
                sort_key: "top"
            },
            {
                createTime: -1
            },
            1,
            10
        );
        // 热门统计
        let content_hits = await fq.find(
            sp(req).find,
            "content_hits",
            {
            },
            {
                create_date: -1, hits: -1
            },
            1,
            10
        );
        let hotArray = content_hits.list.map((v, k) => {
            return v.content_id
        });
        let hot_list = await fq.find(
            sp(req).find,
            "content",
            {
                _id: { $in: hotArray }
            },
            {

            },
            1,
            10
        );

        hot_list = hotArray.map((v, k) => {
            for (let item of hot_list.list) {
                if (item._id === v) {
                    return item;
                }
            }
        });
        //去重
        let tempArr = [];
        hot_list=hot_list.filter((v, k, obj) => {
            if (tempArr.indexOf(v) >= 0) {
                return false;
            } else {
                tempArr.push(v);
                return v;
            }
        });





        return {
            nav_list: nav_list.list,
            main_view_list: content_main_list.list,
            recommend_list: recommend.list,
            top_ads: top_ads.list,
            hot_list
        };
    }
    render() {
        return (
            <div>
                <Head />
                <IndexBanner list={this.props.top_ads} />
                <Header channel_list={this.props.nav_list} />
                <div className="container">
                    {/* 左边的主视图 */}
                    <div className="col-md-8" id="main_view">
                        <IndexMainView list={this.props.main_view_list} />
                    </div>
                    {/* <!--右边栏--> */}
                    <div className="col-md-4" id="sidebar">
                        <RecommendList list={this.props.hot_list} title="热门排行" />
                        <RecommendList list={this.props.recommend_list} title="推荐阅读" />
                    </div>
                </div>
                <Footer />
                <ScriptImport />

            </div>
        );
    }
}