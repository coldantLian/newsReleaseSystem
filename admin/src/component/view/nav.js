import React from 'react';
import { Menu, Icon } from 'antd';

//引处路由组件
import { Link } from 'react-router';
import ajax from '../../base/ajax';



const Item = (v, key) => {
    return (<Menu.Item key={key}>
        <Link to={v.url}>
            <Icon type={v.icon} />
            <span>{v.title}</span>
        </Link>
    </Menu.Item>);
}


const SubMenu = (v, key) => {
    return (<Menu.SubMenu key={key} title={<span><Icon type={v.icon} /><span>{v.title}</span></span>} >
        {
            v.children.map((v, k) => {
                return Item(v, v.url);
            })
        }
    </Menu.SubMenu>);
}



export default class Nav extends React.Component {
    state = {
        loading: false,
        navList: []
    }

    componentWillMount() {
        this.getNavList();
    }

    getNavList() {
        ajax.get(
            ajax.url(ajax.ports.base.navList)
        ).before(() => {
            this.setState({ loading: true });
        }).complete(() => {
            this.setState({ loading: false });
        }).then((xhr) => {
            this.setState({
                navList: xhr.response
            });
        });
    }

    render() {
        let key = 0;

        var navItems = this.state.navList.map((v, k) => {
            if (v.children) {
                return SubMenu(v, `subMenu_${key++}`);
            } else {
                return Item(v, v.url);
            }
        });


        return (

            <Menu theme="dark" mode="inline" mode="inline" defaultOpenKeys={["subMenu_0", "subMenu_1"]} selectedKeys={[this.props.location.pathname]} >
                {navItems}
            </Menu>
        );
    }

}


// import React from 'react';
// import { Menu, Icon } from 'antd';

// //引处路由组件
// import { Link } from 'react-router';


// export default class Nav extends React.Component {
//     render() {
//         console.log("导航参数", this.props.location.pathname)
//         return (
//             <Menu theme="dark" mode="inline" defaultOpenKeys={["config", "content"]} selectedKeys={[this.props.location.pathname]}>
//                 <Menu.Item key={"/"} >
//                     <Link to={"/"}>
//                         <Icon type="user" />
//                         <span>总览</span>
//                     </Link>
//                 </Menu.Item>
//                 <Menu.Item key={"/content_add"}>
//                     <Link to={"/content_add"} >
//                         <Icon type="video-camera" />
//                         <span>发布内容</span>
//                     </Link>
//                 </Menu.Item>
//                 <Menu.SubMenu key={"content"} title={<span><Icon type="mail" /><span>内容管理</span></span>} >
//                     <Menu.Item key={"/content_list"}>
//                         <Link to={"/content_list"} >
//                             <Icon type="video-camera" />
//                             <span>内容列表</span>
//                         </Link>
//                     </Menu.Item>
//                     <Menu.Item key={"/test1"}>
//                         <Link to={"/test1"}>
//                             <Icon type="video-camera" />
//                             <span>专题管理</span>
//                         </Link>
//                     </Menu.Item>
//                 </Menu.SubMenu>
//                 <Menu.Item key={"/simple_page"}>
//                     <Link to="/simple_page">
//                         <Icon type="video-camera" />
//                         <span>单页管理</span>
//                     </Link>
//                 </Menu.Item>
//                 <Menu.Item key={"/ad"} >
//                     <Link to="/ad">
//                         <Icon type="upload" />
//                         <span>广告管理</span>
//                     </Link>
//                 </Menu.Item>
//                 <Menu.Item key={"/manager"} >
//                     <Link to="/manager" >
//                         <Icon type="upload" />
//                         <span>管理员设置</span>
//                     </Link>
//                 </Menu.Item>
//                 <Menu.Item key={""}>
//                     <Icon type="video-camera" />
//                     <span>用户管理</span>
//                 </Menu.Item>
//                 <Menu.SubMenu key={"config"} title={<span><Icon type="mail" /><span>网站配置</span></span>} >
//                     <Menu.Item key={"/channel"}>
//                         <Link to="/channel">
//                             <Icon type="video-camera" />
//                             <span>频道设置</span>
//                         </Link>
//                     </Menu.Item>
//                     <Menu.Item key={"/content_sort"}>
//                         <Link to="/content_sort">
//                             <Icon type="video-camera" />
//                             <span>内容分类管理</span>
//                         </Link>
//                     </Menu.Item>
//                     <Menu.Item key={"/websit_config"}>
//                         <Link to="/websit_config">
//                             <Icon type="video-camera" />
//                             <span>网站信息设置</span>
//                         </Link>
//                     </Menu.Item>
//                 </Menu.SubMenu>
//             </Menu>
//         );
//     }
// }

