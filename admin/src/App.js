import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { store } from './redux/store';


import './App.css';
//引处路由组件
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';

import View from './component/view';
//引入功能模块
import Test1 from './modules/test_1';
import Test2 from './modules/test_2';

import Websit_config_base from './modules/website_config';
import Content_sort from './modules/content_sort';
import Content_list from './modules/content_list';
import AddContent from './modules/add_content';
import SimplePage from './modules/simple_page';
import Channel from './modules/channel';
import Ad from './modules/ad_list';
import Manager from './modules/manager';
import  AdminIndex from './modules/admin_index';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory} >
          {/*引入容器组件*/}
          <Route path="/" component={View}>
            <IndexRoute component={AdminIndex} />
            <Router path="/websit_config" component={Websit_config_base} />
            <Router path="/content_add" component={AddContent} />
            <Router path="/content_edit" component={AddContent} />
            <Router path="/content_sort" component={Content_sort} />
            <Router path="/Content_list" component={Content_list} />
            <Router path="/simple_page" component={SimplePage} />
            <Router path="/Channel" component={Channel} />
            <Router path="/ad" component={Ad} />
            <Router path="/manager" component={Manager} />
          </Route>
        </Router>
      </Provider>
    );
  }
}

