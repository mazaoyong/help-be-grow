/**
 * 配置页面 display 埋点信息
 * ...
 * config: {
 *    // 【可选】开启需要提供 log 对象
 *    log: {
 *        // 【可选】默认开启自动埋点（目前仅限enterpage）
 *        auto: true,
 *        // 【可选】埋点类型
 *        type: 'fake',
 *        // 【可选】埋点页面 id，比如商品的 goodsId
 *        // 支持数字字符串还有函数类型
 *        // 函数可以返回动态计算值或者 Promise
 *        id: window._global.kdt_id,
 *        // 【可选】根据预设来更方便地触发埋点，enterpage内置无需声明
 *        presets: {
 *          [key]: {
 *            et: 'click'
 *            ei: 'buy',
 *            en: '点击购买',
 *          },
 *          // ...
 *        }
 *    }
 * }
 * ...
 */
import isFunction from 'lodash/isFunction';
import { log as logFn } from '../setters/set-log';

export default {
  mounted() {
    const { $options: { config: { log = {} } } } = this;

    const {
      auto = true,
      type = 'fake',
    } = log;
    let { id = window._global.kdt_id } = log;

    if (auto) {
      if (isFunction(id)) id = id.apply(this);
      logFn({ type, id });
    }
  },
};
