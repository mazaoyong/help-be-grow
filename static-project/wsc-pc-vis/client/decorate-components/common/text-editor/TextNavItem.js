import React, { PureComponent, Component } from 'react';
import { Input } from 'zent';
import get from 'lodash/get';
import ChooseMenu from '../choose-menu';
import { ControlGroup } from '@zent/design/es/editor/DesignEditor';
import HelpIcon from 'shared/components/help-icon';

import { getWeappNotSuppertedLinkMessage } from '../utils/weapp-not-supported-link';
import { getH5NotSuppertedLinkMessage } from '../utils/h5-not-supported-link';

export default class TextNavEditorItem extends (PureComponent || Component) {
  constructor(props) {
    super(props);
    const { itemData } = this.props;
    this.state = { data: itemData };
  }

  onMenuChoose = data => {
    const { onItemChange, index } = this.props;

    this.setState(
      {
        data,
      },
      () => {
        onItemChange(data, index);
      }
    );
  };

  onInputChange = e => {
    const { name, value } = e.target;
    const { onItemChange, index } = this.props;

    onItemChange(
      {
        [name]: value,
      },
      index
    );
  };

  render() {
    const { showError, error, title, globalConfig, settings, linkMenuItems } = this.props;

    const titleError = get(error, 'title', {});
    const typeError = get(error, 'type', {});
    const { data } = this.state;

    let help;
    let isWeappHelp = false;
    if (globalConfig.showDesignWeappNotice) {
      if (data && data.link_url) {
        // change: 增加对微信公众号文章链接的匹配
        const isVip = get(_global, 'has_order_weapp.isValid', false);
        if (isVip && data.link_url.match(/^(https||http):\/\/mp.weixin.qq.com\/s/)) {
          help = false;
        } else {
          help = getWeappNotSuppertedLinkMessage(data);
        }

        if (help) {
          isWeappHelp = true;
        } else {
          help = getH5NotSuppertedLinkMessage(data);
        }
      }
    }

    return (
      <div>
        <ControlGroup
          label="导航名称:"
          showError={showError && titleError.isShowError}
          error={titleError.text}
        >
          <Input name="title" value={title || ''} onChange={this.onInputChange} required />
        </ControlGroup>
        <ControlGroup
          label="链接到:"
          showError={showError && typeError.isShowError}
          error={typeError.text}
          labelAlign={help ? 'top' : null}
          helpDesc={
            help ? (
              <div className="text-nav-item-help">
                <HelpIcon help={help} type="error-circle" />{' '}
                {isWeappHelp ? '该链接在小程序内点击不跳转' : '该链接只在小程序点击可跳转'}
              </div>
            ) : null
          }
        >
          <ChooseMenu
            globalConfig={globalConfig}
            settings={settings}
            linkMenuItems={linkMenuItems}
            value={this.state.data}
            onChange={this.onMenuChoose}
          />
        </ControlGroup>
      </div>
    );
  }
}
