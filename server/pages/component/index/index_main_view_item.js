import React from 'react';
import moment from 'moment';
export default class extends React.Component {
    render() {
        const { item } = this.props
        return (
            <li className="main_view_list_item panel panel-default"> 
                <div className="panel-body">
                    <h2 className="title">{item.title}</h2>
                    <div className="info">
                        <span className="author">{item.author}</span>
                        <span className="begin_time">{moment(item.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                    </div>
                    {
                        item.titleImage && <div className="item_title_image">
                            <img src={`/uploadfile/${item.titleImage}`} />
                        </div>
                    }
                    <p className="sub_title">
                        {item.subTitle}
                    </p>
                    <hr />
                    <a className="btn btn-default" href={`/content/full_text?id=${item._id}`}
                    >阅读全文</a>
                </div>
            </li>
        );
    }
}