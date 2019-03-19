import React from 'react';
import Link from 'next/link';
export default class extends React.Component {
    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">{this.props.title || "推荐阅读"}</div>
                <div className="panel-body">
                    <ul className="sidebar_list_ul">
                        {this.props.list.map((v, k) => {
                            return (
                                <li>
                                    <Link className="link" href={`/content/full_text?id=${v._id}`} title={v.title} target="_blank">{v.title}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}