import React, { Component } from 'react';

import './index.scss';

export default class ComNotSupport extends Component {
  render() {
    return (
      <div className="wsc-decorate__not-support">
        <div className="wsc-decorate__not-support-title">组件暂不支持</div>
        <div className="wsc-decorate__not-support-text">
          该组件暂不支持新版编辑器，请切换至旧版编辑器中对该组件进行编辑
        </div>
      </div>
    );
  }
}
