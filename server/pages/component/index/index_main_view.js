import React from 'react';
import SubItem from './index_main_view_item';
import Link from 'next/link';


export default class extends React.Component {
    createList() {
        let results = [], count = 0;
        for (let item of this.props.list) {
            results.push(
                <SubItem item={item} />
            );
        }
        return results;
    }

    render() {
        return (
            < ul className="main_view_list" >
                {
                    this.createList()
                }
            </ul >

        );
    }
}