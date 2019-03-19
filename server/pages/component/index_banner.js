import React, { Component } from 'react';

export default class extends React.Component {
    render() {
        const { list } = this.props;
        return (
            <div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    {
                        list && list.map((v, k) => {
                            return (
                                <li
                                    data-target="#carousel-example-generic"
                                    key={k}
                                    data-slide-to={k}
                                    className={k === 0 ? "active" : ""}
                                >
                                </li>
                            );
                        })
                    }
                </ol>

                <div className="carousel-inner" role="listbox" style={{ height: "240px", overflow: "hidden" }}>
                    {
                        list && list.map((v, k) => {
                            return (
                                <div className={`item ${k === 0 ? "active" : ""}`}>
                                    <img className="top_ad_photo " src={`/uploadfile/${v.photo}`} alt={v.title} />
                                    <div className="carousel-caption">
                                        {v.title} 
						            </div>
                                </div>
                            )
                        })
                    }
                </div>

                <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>

        );
    }
}
