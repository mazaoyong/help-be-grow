import React from 'react';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import App from './containers/App';
import ReserveList from '../appointment/containers/list/Index';
import ReservePanel from '../appointment/containers/panel/Index';
import navWrapper from '../appointment/containers/NavWrapper';
import { TAB_INDEX } from './constants';

// import { setNav } from './nav';

// 三级路由设置
const onRouteEnter = route => {
  // 全站导航优化：拿掉所有的三级tab导航
  // setNav(route.location);
};

const Routes = (
  <Router history={hashHistory}>
    <Route to="/" component={App}>
      <Route
        key="list"
        path="list"
        component={navWrapper(ReserveList, TAB_INDEX.LIST)}
        onEnter={onRouteEnter}
      />
      <Route
        key="panel"
        path="panel"
        component={navWrapper(ReservePanel, TAB_INDEX.PANEL)}
        onEnter={onRouteEnter}
      />
    </Route>
    <Redirect from="*" to="list" />
  </Router>
);

export default Routes;
