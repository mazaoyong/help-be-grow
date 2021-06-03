import React from 'react';
import { Input } from 'zent';
import { ControlGroup, ComponentTitle } from '../common/';
import { DesignEditor } from '../editor-base/design-editor';
import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';

const MAX_LENGTH = 7;

export default class StoreEditor extends DesignEditor {
  render() {
    const { value, showError, validation, globalConfig } = this.props;
    const { action_text: actionText } = value;

    const noticeMsg =
      globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（需要小程序 v${WEAPP_VERSION_MAP.store} 版本及以上）`
        : '';

    return (
      <div className="rc-design-component-store-editor">
        <ComponentTitle name="进入店铺" noticeMsg={noticeMsg} />
        <ControlGroup
          label="文案"
          block
          showError={showError || this.getMetaProperty('action_text', 'touched')}
          error={validation.actionText}
        >
          <Input
            name="action_text"
            value={actionText}
            onChange={this.onInputChange}
            onBlur={this.onInputBlur}
            maxLength={MAX_LENGTH}
          />
        </ControlGroup>
      </div>
    );
  }

  // 组件的类型
  static designType = 'store';

  // 组件的描述
  static designDescription = (
    <span>
      进入
      <br />
      店铺
    </span>
  );

  static info = {
    type: 'store',
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/6e4c6d423febf05ef147d4a3421e6b66.png',
    name: '进入店铺',
    description: '进入店铺',
    maxNum: 1,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      action_text: '进入店铺',
      type: 'store',
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { action_text: actionText } = value;

      if (actionText.length > MAX_LENGTH) {
        errors.actionText = `文案长度不能多于${MAX_LENGTH}个字`;
      }

      resolve(errors);
    });
  }
}
