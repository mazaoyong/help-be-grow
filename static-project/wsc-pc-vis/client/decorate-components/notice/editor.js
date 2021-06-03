import React from 'react';
import { Input } from 'zent';
import { DesignEditor } from '../editor-base/design-editor';
import { ComponentTitle, ControlGroup, ColorPicker } from '../common';
import { PLACEHOLDER, DEFAULT_BG_COLOR, DEFAULT_COLOR } from './constants';

const prefix = 'decorate-notice-editor';
export default class NoticeEditor extends DesignEditor {
  render() {
    const { value, showError, validation } = this.props;

    return (
      <div className={prefix}>
        <ComponentTitle name="公告" withMargin />

        <ControlGroup
          label="公告"
          labelColored
          required
          block
          showError={showError}
          error={validation.content}
        >
          <Input
            name="content"
            placeholder={PLACEHOLDER}
            value={value.content}
            onChange={this.onInputChange}
            onBlur={this.onInputBlur}
          />
        </ControlGroup>
        <ControlGroup label="背景颜色">
          <ColorPicker
            defaultColor={DEFAULT_BG_COLOR}
            color={value.bg_color}
            onChange={this.onCustomInputChange('bg_color')}
          />
        </ControlGroup>
        <ControlGroup label="文字颜色">
          <ColorPicker
            defaultColor={DEFAULT_COLOR}
            color={value.color}
            onChange={this.onCustomInputChange('color')}
          />
        </ControlGroup>
      </div>
    );
  }

  // 组件信息
  static info = {
    type: ['notice_weapp', 'notice'],
    name: '公告',
    description: '公告',
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/c52262f634e5fbba92f69abb8d7134ee.png',
    maxNum: 20,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      type: 'notice',
      content: '',
      bg_color: DEFAULT_BG_COLOR,
      color: DEFAULT_COLOR,
    };
  }

  static validate(value) {
    return new Promise(resolve => {
      const errors = {};
      const { content } = value;
      if (!content || !content.trim()) {
        errors.content = '请填写公告内容';
      }

      resolve(errors);
    });
  }
}
