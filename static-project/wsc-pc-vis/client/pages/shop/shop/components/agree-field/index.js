
import { Form } from '@zent/compat';
/**
 * 服务协议组件
 */
import React, { Component } from 'react';
import { Checkbox } from 'zent';

class AgreeField extends Component {
  render() {
    const isChain = this.props.isChain;
    return (
      <Checkbox
        className="zent-form__checkbox"
        checked={this.props.value === true}
        onChange={this.props.handleChange}
      >
        {isChain ? (
          <>
            我已阅读并同意
            <a
              href={`${window._global.url.base}/intro/rule/detail?alias=le39pf6u&pageType=rules`}
              target="_blank"
              rel="noopener noreferrer"
            >
              《有赞教育多校区产品订购及服务协议》
            </a>
          </>
        ) : (
          <>
            我已阅读并同意
            <a
              href={`${window._global.url.base}/intro/rule/detail?alias=1df5cjc89&pageType=rules`}
              target="_blank"
              rel="noopener noreferrer"
            >
              《有赞教育软件产品订购及服务协议》
            </a>
          </>
        )}
        <>
          和
          <a
            href={`${window._global.url.base}/intro/rule/detail?alias=4bgnblbj&pageType=rules`}
            target="_blank"
            rel="noopener noreferrer"
          >
            《微商城扩展包订购及服务协议》
          </a>

          {/* 暂时隐藏掉《有赞精选入驻协议》 */}
          {/* <a
            href={`${window._global.url.base}/intro/rule/detail?alias=1c4u0h51m&pageType=rules`}
            target="_blank"
            rel="noopener noreferrer"
          >
            《有赞精选入驻协议》
          </a> */}
        </>
      </Checkbox>
    );
  }
}

export default Form.getControlGroup(AgreeField);
