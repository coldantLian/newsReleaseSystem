import React from 'react';
import Link from 'next/link';

import Head from './component/head';
import Header from './component/index_header';
import IndexBanner from './component/index_banner';
import ScriptImport from './component/script_import';
import IndexMainView from './component/index/index_main_view';
import RecommendList from './component/index/recommend_list';
import Footer from './component/index_footer';
import PathBar from './component/path_bar';


import moment from 'moment';
import sp from './db/service_path';
import fq from './db/fetchQuery';


export default class extends React.Component {
    static async getInitialProps({ pathname, req, query }) {
        //导航条
        let nav_list = await fq.find(
            sp(req).find,
            "channel",
            { show: true },
            { order_index: 1 }
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
        //取文章内容
        let content = await fq.findOne(sp(req).findOne, "content", query.id);


        //对应分类的数据
        let sort_info = await fq.findOne(sp(req).findOne, "content_sort", content.sort_id);

        //提交一个请求记录文章浏览
        let PostHits = await fq.postNoResult(sp(req).content_hit, { id: content._id, sort_id: content.sort_id });
        return {
            nav_list: nav_list.list,
            recommend_list: recommend.list,
            content: content,
            sort_info: sort_info
        };

    }
    render() {
        const { content, sort_info } = this.props;
        return (
            <div>
                <Head title={content.title} />
                <IndexBanner />
                <Header channel_list={this.props.nav_list} />
                <div className="container">
                    <PathBar
                        list={
                            [
                                { url: "/", text: "首页" },
                                { url: `/content/sort?id=${sort_info._id}`, text: sort_info.name },
                                { text: content.title }
                            ]
                        }
                    />
                    <div className="col-md-8" id="main_view">
                        <h1 className="title">{content.title}</h1>
                        <div className="info">
                            <span className="author">{content.author}</span>
                            <span className="begin_time">{moment(content.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                        </div>
                        <p className="sub_title">
                            {content.subTitle}
                        </p>
                        <hr />
                        <div className="content_text" dangerouslySetInnerHTML={{ __html: content.contentText }}>
                        </div>
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