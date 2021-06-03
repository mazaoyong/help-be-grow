import React from 'react';
import { hashHistory, Router, Route, IndexRedirect, Redirect } from 'react-router';
import { newURLReg, multipageReg } from 'fns/router';
import SessionStorage from '@youzan/utils/browser/session_storage';

import App from './App';

import { TabsConfig } from './config';

const {
  isYZEdu,
  url: { v4 },
} = window._global;

const goToProj = ({ location }) => {
  // 在信息采集组件中设置了sessionStorage，为了再次新建还是用storage的值，就在路由中删除该值
  SessionStorage.removeItem('tempInfoCollect');
  let { pathname } = location;
  const isUnderNewUrl = newURLReg.test(pathname);
  if (isYZEdu) {
    if (pathname === '/order') {
      pathname = '/record';
    }
    if (multipageReg.test(pathname)) {
      pathname = `${pathname}/list`;
    }
    window.location.replace(
      isUnderNewUrl
        ? `${v4}/vis/course${pathname}`
        : `${v4}/vis/pct/page${pathname}`
    );
  }
};

const Routes = (
  <Router history={hashHistory}>
    <Route path="/" component={App} onEnter={goToProj}>
      <IndexRedirect to="content" />

      {TabsConfig.map(({ path, component }) => {
        return <Route key={path} path={path} component={component} />;
      })}

      <Redirect from="*" to="content" />
    </Route>
  </Router>
);

export default Routes;
