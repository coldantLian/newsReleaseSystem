import React from 'react';
export default class extends React.Component {

    createPagingNum(num, totalPage) {
        let arrLeft = [],
            arrRight = [],
            arrMiddle = [num];
        //					页码左边超过3个页的情况 
        if (num > 4) {
            arrLeft.push(1);
        }
        if (num > 5) {
            arrLeft.push(0);
        }


        //				页码左3
        let left = num - 3;
        while (left != num) {
            if (left > 0) {
                arrLeft.push(left);
            }
            left++
        }
        //				页码的右3
        let right = num + 1;
        while (right <= totalPage && right < num + 4) {
            arrRight.push(right++);
        }
        //				页码右边超过3的情况
        if (totalPage - num >= 5) {
            arrRight.push(0);
        }

        if (totalPage - num >= 4) {
            arrRight.push(totalPage);
        }

        return Array.prototype.concat(arrLeft, arrMiddle, arrRight);
    }

    render() {
        const { url, pageNum, pageSize, total } = this.props;
        let totalPage = parseInt(total / pageSize) + ((total % pageSize) > 0 ? 1 : 0)

        let numList = this.createPagingNum(Number(pageNum), Number(totalPage));

        return (
            <nav aria-label="Page navigation ">
                <ul className="pagination pagination-lg">
                    {
                        Number(pageNum) > 1 &&
                        <li>
                            <a href={`${url}&page=${Number(pageNum) - 1}`} aria-label="Previous" >
                                <span aria-hidden="true">上一页</span>
                            </a>
                        </li>
                    }
                    {
                        numList.map((v, k) => {
                            if (v != 0) {
                                return (
                                    <li>
                                        <a href={`${url}&page=${v}`}>{v}</a>
                                    </li>
                                );
                            } else {
                                return (<li class="disabled">
                                    <a class="disabled" href="javascript:void(0);">...</a>
                                </li>);
                            }
                        })
                    }
                    {
                        Number(pageNum) < totalPage &&
                        <li>
                            <a href={`${url}&page=${Number(pageNum) + 1}`} aria-label="Next">
                                <span aria-hidden="true">下一页</span>
                            </a>
                        </li>
                    }
                </ul>
            </nav>
        );
    }
}