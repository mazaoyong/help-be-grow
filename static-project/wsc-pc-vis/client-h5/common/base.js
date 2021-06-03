/**
 * 所有页面进入后的初始化脚本
 */
import { WebLogger } from '@youzan/client-log-sdk';
// 基础库

// 基础样式
import 'styles/normalize.scss';
import 'styles/mixins/match_iphonex.css';
import 'styles/vant-icon.scss'; // 临时方案

// 基础组件
// import 'components';

(function() {
  try {
    const _global = window._global || {};
    const Logger = new WebLogger({
      plat: {
        yai: 'wsc_b'
      },
      autoHashDisplay: true,
      user: {
        li: _global.userId || '',
        m: _global.mobile || ''
      },
      event: {
        si: _global.kdtId || ''
      },
      autoView: true,
      baseUrl: 'https://tj1.youzanyun.com/v3/js/log'
    });
    Logger.init();
    window.yzlogInstance = Logger;
  } catch (e) {
    console.log(e);
  } finally {
    if (!window.yzlogInstance || typeof window.yzlogInstance.log !== 'function') {
      window.yzlogInstance = {
        log: function() {}
      };
    }
  }
})();
