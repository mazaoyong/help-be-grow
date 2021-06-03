// 不同单页之间页面跳转
import React from 'react';
import { Button } from 'zent';
import { hashHistory, Link } from 'react-router';
const baseURL = window._global.url.v4 + '/vis/pct/page';
const reg = /^(\/*)(\w+)\/(.+)/;

/**
 * 不同页面之间跳转的方法
 *
 * @param {string} url - 要跳转的 url，项目名/hash 的字符串
 */
export const tabPush = url => {
  if (!reg.test(url)) {
    throw new Error('tabpush: path not correct.');
  }

  const urls = url.match(reg);

  if (window.location.pathname === `/v4/vis/pct/page/${urls[2]}`) {
    hashHistory.push(urls[3]);
  } else {
    window.location.href = `${baseURL}/${urls[2]}#/${urls[3]}`;
  }
};

/**
 * 跳转的高阶组件，会捕捉组件的 to 或者 href 属性，跳到对应的地址
 *
 * @param {React.Component} Cmpt - 包装端组件
 * @return {React.Component}
 */
export const tabWrap = Cmpt => {
  return props => {
    let propsCopy = { ...props };

    let url;
    // 捕获 to 属性
    if (props.to) {
      url = props.to;
      delete propsCopy.to;
    }

    // 捕获 href 属性
    if (props.href) {
      url = props.href;
      delete propsCopy.href;
    }

    if (!props.onClick) {
      propsCopy.onClick = () => {
        tabPush(url);
      };
    }

    return <Cmpt {...propsCopy} />;
  };
};

// 对 react-router Link 的封装
export const TabLink = tabWrap(Link);

// 对 zent Button 的封装
export const TabButton = tabWrap(Button);
