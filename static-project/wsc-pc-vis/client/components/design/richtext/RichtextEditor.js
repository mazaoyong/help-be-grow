import React from 'react';
import { ColorPicker, Button, Checkbox } from 'zent';
import { Richtext } from '@youzan/react-components';
import {
  DesignEditor,
  ControlGroup,
} from '@zent/design/es/editor/DesignEditor';
import cloneDeep from 'lodash/cloneDeep';
import { IS_WEAPP_SETTING } from '../common/config';
import ComponentTitle from '../common/component-title';

const reserColor = '#fff';

const toolBarArray = [
  'emotion',
  'uploadimage',
  'removeformat',
  '|',
  'rowspacingtop',
  'rowspacingbottom',
  'lineheight',
  'paragraph',
  'fontsize',
];

export default class RichtextEditor extends DesignEditor {
  static defaultProps = {
    richTextConfig: {},
  };

  handleResetBackground = () => {
    this.onCustomInputChange('color')(reserColor);
  };

  onColorChange = color => {
    this.onCustomInputChange('color')(color);
  };

  onFullscreenChange = e => {
    let isFullscreen = Number(e.target.checked);
    this.onCustomInputChange('fullscreen')(isFullscreen);
  };

  onEditorChange = val => {
    this.onCustomInputChange('content')(val);
  };

  getToolBarArray = globalConfig => {
    let toolbar = cloneDeep(toolBarArray);
    if (
      globalConfig.is_weapp_setting !== IS_WEAPP_SETTING &&
      toolbar.indexOf('link') === -1
    ) {
      toolbar.splice(2, 0, 'insertvideo', 'link');
    }
    return toolbar;
  };

  render() {
    const { value, globalConfig, richTextConfig } = this.props;
    const toolbar = this.getToolBarArray(globalConfig);
    return (
      <div className="rc-design-component-richtext-editor">
        <ComponentTitle
          name="富文本"
          url="https://help.youzan.com/qa?cat_sys=K#/menu/2211/detail/528?_k=8jertg"
        />

        <ControlGroup focusOnLabelClick={false} label="背景颜色：">
          <div className="input-append">
            <ColorPicker
              className="richtext-editor__color-picker-popover"
              color={value.color}
              onChange={this.onColorChange}
            />
            <Button onClick={this.handleResetBackground}>重置</Button>
          </div>

          <label htmlFor="fullscreen" className="control-label">
            是否全屏：
          </label>
          <Checkbox
            className="richtext-checkbox-wrap"
            name="fullscreen"
            checked={value.fullscreen}
            onChange={this.onFullscreenChange}
          >
            全屏显示
          </Checkbox>
        </ControlGroup>

        <div className="richtext-group">
          <Richtext
            value={value.content}
            onChange={this.onEditorChange}
            editorConfig={{
              initialFrameWidth: 386,
              initialFrameHeight: 600,
              toolbars: [
                [
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  'forecolor',
                  'backcolor',
                  'justifyleft',
                  'justifycenter',
                  'justifyright',
                  '|',
                  'insertunorderedlist',
                  'insertorderedlist',
                  'blockquote',
                ],
                toolbar,
                [
                  'inserttable',
                  'deletetable',
                  'insertparagraphbeforetable',
                  'insertrow',
                  'deleterow',
                  'insertcol',
                  'deletecol',
                  'mergecells',
                  'mergeright',
                  'mergedown',
                  'splittocells',
                  'splittorows',
                  'splittocols',
                ],
              ],
            }}
            qiniuCdnUrl={
              globalConfig.url &&
              (globalConfig.url.imgcdn || globalConfig.url.imgqn)
            }
            showWeappNotice={!!globalConfig.showDesignWeappNotice}
            {...richTextConfig}
          />
        </div>

        {globalConfig.showDesignWeappNotice && (
          <div className="editor-bottom-help-desc">
            小程序富文本展示以实际效果为准，左侧预览仅供参考
          </div>
        )}
      </div>
    );
  }

  static designType = ['rich_text_weapp', 'rich_text'];
  static designDescription = '富文本';

  static getInitialValue() {
    return {
      color: reserColor,
      content: '',
      fullscreen: 0,
      emptyRichtext: '',
    };
  }
}
