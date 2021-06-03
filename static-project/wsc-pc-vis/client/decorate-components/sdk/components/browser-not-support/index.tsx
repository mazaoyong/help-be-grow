import React, { Component } from 'react';

import './index.scss';

export default class BrowserNotSupport extends Component {
  render() {
    return (
      <div className="wsc-decorate-updgrade">
        <img
          src="//img.yzcdn.cn/public_files/2019/04/02/7913a3c36d82593f090d3473eda82d87.png"
          alt=""
          className="wsc-decorate-updgrade-img"
        />
        <div className="wsc-decorate-updgrade-text">
          当前浏览器不支持装修，请使用Chrome浏览器进行装修
        </div>
        <div className="wsc-decorate-updgrade-download">
          <a
            href="https://www.google.com/chrome/browser/desktop/index.html"
            className="btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            下载Chrome
          </a>
        </div>
      </div>
    );
  }
}
