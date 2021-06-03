import React from 'react';
import { Router, Route, Redirect, hashHistory } from 'react-router';

import Create from './containers/create';
import Upgrade from './containers/upgrade';
import Loading from './containers/create-loading';
import Select from './containers/select';
import CreateChain from './containers/create-chain';
import Finish from './containers/finish';

import ABTestClient from '@youzan/client-abtest';
import ABCreate from './containers/create/ab-index';
import ABSelect from './containers/select/ab-index';

import { initAbTestClient } from './utils/log';
initAbTestClient();

let CreatePage = Create;
let SelectPage = Select;

// https://growth.qima-inc.com/abtest/d39/l195
const test = ABTestClient.getTest('create-edu-shop');
const { isValid, configurations = {} } = test;
if (isValid) {
  switch (configurations.value) {
    case 1: // 1：仅修改select页面文案
      SelectPage = ABSelect;
      break;
    case 2: // 2: 去除select页面，create页面增加单店连锁选择，优化地图和名称
      CreatePage = ABCreate;
      SelectPage = ABCreate;
      break;
    default: // 0：原创建逻辑
      break;
  }
}

const defaultRoute = _global.yzEduChainWhitelist ? 'select' : 'createsingle';

const Routes = (
  <div className="edu-shop-container">
    <Router history={hashHistory}>
      <Route path="createsingle" component={CreatePage} />
      {/* 商业化版本调整，临时禁用upgrade */}
      <Route path="upgrade" component={Upgrade} />
      <Route path="loading" component={Loading} />
      {/* 连锁创建新流程 */}
      <Route path="select" component={SelectPage} />
      <Route path="createchain" component={CreateChain} />
      <Route path="finish" component={Finish} />
      <Redirect from="*" to={defaultRoute} />
    </Router>
  </div>
);

export default Routes;
