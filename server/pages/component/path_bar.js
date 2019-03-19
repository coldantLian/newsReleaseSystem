import React from 'react';

/*
    [
        [url:"/",text:"首页"],
        [url:"/content/sort?id=aaaaaa",text:"首页"]
    ]
*/

export default class extends React.Component {
    render() {
        return (<div className="col-md-12">
            <ol className="breadcrumb">
                {
                    this.props.list.map((v, k) => {
                        if (!v.url) {
                            return <li key={k}>{v.text}</li>
                        } else {
                            return <li key={k}><a href={v.url}>{v.text}</a></li>
                        }
                    })
                }
            </ol>
        </div>);
    }
}