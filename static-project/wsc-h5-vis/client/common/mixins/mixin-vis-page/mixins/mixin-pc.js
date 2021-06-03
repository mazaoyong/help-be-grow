/**
 * 配置 PC 端的一些功能
 * ...
 * config: {
 *    pc: {
 *        //【可选】支持字符串，PC 端访问重定向至某个页面
 *        // TODO: 支持更多重定向的方式
 *        redirectTo: '',
 *        //【可选】支持布尔值，开启 PC 预览模式
 *        preview,
 *        //【可选】支持布尔值，开启 PC 预览模式后隐藏二维码
 *        hideQrcode: false,
 *        //【可选】支持字符串，开启 PC 预览模式后编辑按钮的 url
 *        editUrl: '',
 *        //【可选】支持布尔值，PC 端禁止右键菜单
 *        // TODO
 *        forbidRightKey: false,
 *        //【可选】支持对象形式，PC 端样式适配
 *        // TODO
 *        style: {}
 *    }
 * }
 * ...
 */
import Vue from 'vue';
import isString from 'lodash/isString';
import UA from 'zan-utils/browser/ua_browser';
import PreviewComponent from 'components/preview';
import * as SafeLink from '@youzan/safe-link';

const isMobile = UA.isMobile();
const isPC = !isMobile || navigator.userAgent.indexOf('windowswechat') > -1;
export default {
  beforeCreate() {
    if (isPC) return;
    const {
      $options: {
        config: {
          pc: {
            redirectTo = '',
            preview,
            hideQrcode = false,
            editUrl = '',
          } = {},
        },
      },
    } = this;

    // pc 模式下重定向
    if (redirectTo && isString(redirectTo)) {
      SafeLink.redirect({
        url: redirectTo,
        kdtId: window._global.kdt_id,
      });
    }

    // 开启 pc 预览
    const container = document.querySelector('.container') || '';
    if (!container) {
      return;
    }
    const appNode = container.children[0];
    if (preview) {
      appNode.style.position = 'relative';
      appNode.style.margin = '0 auto';
      appNode.style.width = '375px';
      const previewAnchor = document.createElement('div');
      previewAnchor.id = 'preview-anchor';
      appNode.appendChild(previewAnchor);

      // eslint-disable-next-line
      new Vue({
        el: '#preview-anchor',
        render: h => h(
          PreviewComponent,
          {
            props: {
              showQrcode: !hideQrcode,
              editUrl,
            },
          }
        ),
      });
    } else if (preview === false) {
      appNode.style.position = 'initial';
      appNode.style.margin = 'initial';
      appNode.style.width = 'initial';
    }
  },

  mounted() {
    if (isPC) return;
    const {
      $options: {
        config: {
          pc: {
            forbidRightKey = false,
            // style = {}
          } = {},
        },
      },
    } = this;

    // pc 禁止右键点击
    if (forbidRightKey) {
      if (isPC) {
        this.$el.addEventListener('contextmenu', (event) => event.preventDefault());
      }
    }
  },
};
