import React from 'react';
import { Checkbox } from 'zent';
import { Richtext } from '@youzan/react-components';
import { ComponentTitle, ControlGroup, ColorPicker } from '../common';
import { DesignEditor } from '../editor-base/design-editor';

import cloneDeep from 'lodash/cloneDeep';
import throttle from 'lodash/throttle';
import { IS_WEAPP_SETTING } from '../common/config';
import { checkYibanToken } from './api';
import args from '@youzan/utils/url/args';

const reserColor = '#f9f9f9';
const prefix = 'decorate-richtext-editor';
const SCROLL_HEADER_HEIGHT = 164;

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

  componentDidMount() {
    const scrollNode = document.getElementsByClassName('decorate-editor-wrap')[0];
    scrollNode.addEventListener('scroll', throttle(this.scrollHandler.bind(this)), 150);
    // 意瓣编辑器接入
    if (window.UE && window.YIBAN_EDITOR && !window.YIBAN_EDITOR.decoratorFunction) {
      window.YIBAN_EDITOR.decoratorFunction = async () => {
        const req = {
          appId: 43645,
          userId: window._global.userId,
          appkey: '',
          kdtId: window._global.kdtId,
        };
        const res = await checkYibanToken(req);
        const userToken = args.get('userToken', res.useAppUrl);
        return new Promise((resolve, reject) => {
          // 获取用户的授权信息,检测用户是否对有赞商城进行了授权
          // TODO userToken
          if (userToken) {
            window.YIBAN_EDITOR.extraUrlParams = {
              userToken: userToken,
            };
          } else {
            // 跳转到壹伴应用的授权页面
            window.open('https://app.youzanyun.com/cloud-app-detail/43645');
          }
          resolve();
        });
      };
    }
  }

  scrollHandler(event) {
    const richTextEditNode = document.querySelector('.edui-editor-toolbarbox');

    if (!richTextEditNode || !richTextEditNode.style) {
      return;
    }

    if (event.target && event.target.scrollTop) {
      const scrollTop = event.target.scrollTop;
      if (scrollTop > SCROLL_HEADER_HEIGHT) {
        richTextEditNode.style.width = '344px';
        richTextEditNode.style.position = 'fixed';
        richTextEditNode.style.zIndex = 2;
        richTextEditNode.style.top = '70px';
      } else {
        richTextEditNode.style.position = 'relative';
        richTextEditNode.style.top = '0px';
      }
    }

    // hack 去除掉回车换行的时候 产生的div元素
    // 产生这个的原因是ueditor里做了特殊处理，为了滚动时能够置顶
    if (richTextEditNode.previousSibling) {
      const removeNode = richTextEditNode.previousSibling;
      richTextEditNode.parentNode.removeChild(removeNode);
    }
  }
  handleResetBackground = () => {
    this.onCustomInputChange('color')(reserColor);
  };

  onColorChange = color => {
    this.onCustomInputChange('color')(color);
  };

  onFullscreenChange = e => {
    const isFullscreen = Number(e.target.checked);
    this.onCustomInputChange('fullscreen')(isFullscreen);
  };

  onEditorChange = val => {
    this.onCustomInputChange('content')(val);
  };

  getToolBarArray = globalConfig => {
    const toolbar = cloneDeep(toolBarArray);
    if (globalConfig.is_weapp_setting !== IS_WEAPP_SETTING && toolbar.indexOf('link') === -1) {
      toolbar.splice(2, 0, 'insertvideo', 'link');
    }
    return toolbar;
  };

  render() {
    const { value, globalConfig, richTextConfig } = this.props;
    const toolbar = this.getToolBarArray(globalConfig);

    return (
      <div className={prefix}>
        <ComponentTitle
          withMargin
          name="富文本"
          url="https://help.youzan.com/qa?cat_sys=K#/menu/2211/detail/528?_k=8jertg"
          noticeMsg="小程序富文本展示以实际效果为准，左侧预览仅供参考"
        />

        <ControlGroup label="背景颜色">
          <ColorPicker
            defaultColor={reserColor}
            color={value.color}
            onChange={this.onCustomInputChange('color')}
          />
        </ControlGroup>

        <ControlGroup label="是否全屏显示" value={value.fullscreen ? '全屏显示' : '不全屏显示'}>
          <Checkbox
            name="fullscreen"
            checked={value.fullscreen}
            onChange={this.onFullscreenChange}
          />
        </ControlGroup>

        <div className="richtext-group">
          <Richtext
            value={value.content}
            onChange={this.onEditorChange}
            editorConfig={{
              initialFrameWidth: 344,
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
            qiniuCdnUrl={globalConfig.url && (globalConfig.url.imgcdn || globalConfig.url.imgqn)}
            showWeappNotice={!!globalConfig.showDesignWeappNotice}
            {...richTextConfig}
          />
        </div>
      </div>
    );
  }

  // 组件信息
  static info = {
    type: ['rich_text_weapp', 'rich_text'],
    name: '富文本',
    description: '富文本',
    icon: 'https://img.yzcdn.cn/public_files/2019/02/12/d93ed6186c2ade5c8ad0b0057e787c5b.png',
    maxNum: 10,
    usedNum: 0,
    status: '',
  };

  static getInitialValue() {
    return {
      color: reserColor,
      content: '',
      fullscreen: 0,
      type: 'rich_text',
    };
  }
}
