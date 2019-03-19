import React, { Component } from 'react';
import Link from 'next/link';


export default class extends Component {

    createNavList() {
        let items = [];
        let url, count = 0;
        for (let item of this.props.channel_list) {
            if (item.module == "content" || item.module == "simple") {
                url = `/${item.module}/sort?id=${item.param}`;
            } else {
                url = item.param;
            }

            items.push(
                <li key={count++}>
                    <a href={url}>{item.title}</a>
                </li>
            );
        }
        return items;
    }

    render() {
        return (
            <nav className="navbar navbar-inverse ">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">二组练习网站</a>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            {
                                this.props.channel_list && this.props.channel_list.length && this.createNavList()
                            }

                        </ul>

                    </div>
                </div>
            </nav>
        );
    }
} 