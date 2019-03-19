import React, { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default class extends Component {
    constructor(props) {
        super();

    }

    render() {
        return (
            <Head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
                <meta name="Description" content={`二组学习网站开发的练习站点`} />
                <meta name="Keywords" content="二组 学习 练习" />
                <link rel="stylesheet" type="text/css" href="/bootstrap/css/bootstrap.min.css" />
                <link rel="stylesheet" type="text/css" href="/css/website.css" />
                <title>{this.props.title} 二组练习项目-首页</title>
            </Head>
        );
    }
} 