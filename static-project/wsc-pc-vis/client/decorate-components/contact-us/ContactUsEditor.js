import React from 'react';
import { Input } from 'zent';
import { DesignEditor } from '../editor-base/design-editor';
import { ControlGroup, ComponentTitle } from '../common/';

import { WEAPP_VERSION_MAP, IS_WEAPP_SETTING } from '../common/config';

const prefix = 'decorate-contact-us-editor';

export default class ContactUsEditor extends DesignEditor {
  render() {
    const { value, showError, validation, globalConfig } = this.props;
    const { content } = value;
    const noticeMsg =
      globalConfig.is_weapp_setting === IS_WEAPP_SETTING
        ? `（需要小程序 v${WEAPP_VERSION_MAP.contact_us} 版本及以上）`
        : '';

    return (
      <div className={`${prefix}`}>
        <ComponentTitle
          name="在线客服"
          noticeMsg={noticeMsg}
          url="https://help.youzan.com/qa?cat_sys=K#/menu/2211/detail/547?_k=nh9c2c"
        />

        <ControlGroup block label="文案:" showError={showError} error={validation.content}>
          <Input onChange={this.onInputChange} value={content} name="content" maxLength="4" />
          <span className={`${prefix}__desc`}>文案建议4个字</span>
        </ControlGroup>
      </div>
    );
  }

  static info = {
    type: 'contact_us',
    name: '在线客服',
    description: '在线客服',
    icon: 'https://img.yzcdn.cn/public_files/2019/03/19/a9d0aa02480277a3f4377d12eaf68259.png',
    maxNum: 1,
    usedNum: 0,
    status: '',
  };

  static designDescription = (
    <span>
      在线
      <br />
      客服
    </span>
  );

  static getInitialValue() {
    return {
      content: '在线咨询',
      type: 'contact_us',
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const error = {};

      if (!value.content) {
        error.content = '文案不能为空。';
      }

      resolve(error);
    });
  }
}
