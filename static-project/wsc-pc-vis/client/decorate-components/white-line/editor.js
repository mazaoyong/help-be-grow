import React from 'react';
import { Slider } from 'zent';
import { DesignEditor } from '../editor-base/design-editor';
import { ComponentTitle, ControlGroup, Control, ColorPicker } from '../common';
import { SPLIT_TYPES, LINE_TYPES, HAS_PADDING, DEFAULT_LINE_COLOR } from './constants';

export default class extends DesignEditor {
  // 渲染辅助空白编辑器
  renderWhite() {
    const { height } = this.props.value;

    return (
      <>
        <ControlGroup label="空白高度" normalAlign>
          <Slider
            value={+height}
            min={10}
            max={100}
            onChange={this.onCustomInputChange('height')}
          />
        </ControlGroup>
      </>
    );
  }

  // 渲染辅助线编辑器
  renderLine() {
    const { lineType, color, hasPadding } = this.props.value;

    return (
      <>
        <Control
          label="选择样式"
          valueMap={LINE_TYPES}
          value={lineType}
          name="lineType"
          options={[
            { value: 'solid', icon: 'line-solid' },
            { value: 'dashed', icon: 'line-dashed' },
            { value: 'dotted', icon: 'line-dotted' },
          ]}
          onChange={this.onInputChange}
        />
        <Control
          label="左右边距"
          valueMap={HAS_PADDING}
          name="hasPadding"
          options={[{ value: 0, icon: 'line-no-padding' }, { value: 1, icon: 'line-padding' }]}
          value={+hasPadding}
          onChange={this.onInputChange}
        />
        <ControlGroup label="辅助线颜色" value={color}>
          <ColorPicker
            defaultColor={DEFAULT_LINE_COLOR}
            color={color}
            onChange={this.onCustomInputChange('color')}
          />
        </ControlGroup>
      </>
    );
  }

  render() {
    const { value } = this.props;
    const { type } = value;

    return (
      <div className="decorate-line-white-editor">
        <ComponentTitle name={type === 'white' ? '辅助空白' : '辅助线'} withMargin />
        <Control
          label="分割类型"
          valueMap={SPLIT_TYPES}
          name="type"
          value={type}
          options={[{ value: 'white', icon: 'white' }, { value: 'line', icon: 'line' }]}
          onChange={this.onInputChange}
        />
        {type === 'white' ? this.renderWhite() : this.renderLine()}
      </div>
    );
  }

  static info = {
    type: ['white', 'line', 'white_line'], // 匹配辅助空白和辅助线组件
    name: '辅助分割',
    description: '辅助分割',
    maxNum: 30,
    usedNum: 0,
    status: '',
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/eae47c9a22c8d49ecbe88b4e6ca689e6.png',
  };

  static getInitialValue() {
    return {
      type: 'white',

      // 辅助空白的属性
      height: 30,

      // 辅助线的属性
      // line_type: 'solid',
      lineType: 'solid',
      color: DEFAULT_LINE_COLOR,
      // has_padding: '0',
      hasPadding: 0,
    };
  }
}
