import React from 'react';
import ReactDOM from 'react-dom';
import pageHelp from 'shared/components/page-help';
import SessionStorage from '@youzan/utils/browser/session_storage';
import List from './index';

const { isYZEdu } = window._global;

// 在信息采集组件中设置了sessionStorage，为了再次新建还是用storage的值，就在路由中删除该值
SessionStorage.removeItem('tempInfoCollect');
if (!isYZEdu) {
  window.location.replace(`${window._global.url.v4}/vis/pct/page/tabs#/column`);
}

pageHelp('ump_paidcontent');

ReactDOM.render(<List />, document.getElementById('js-react-container'));
