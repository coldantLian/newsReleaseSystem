import React from 'react';

export default class ViewMask extends React.Component{
    render(){
        return (
            <div className="view_mask">
                <div className="mask_bg"></div>
                <div className="mask_view"></div>
            </div>
        );
    }
}