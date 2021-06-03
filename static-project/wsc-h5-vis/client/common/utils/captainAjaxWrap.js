/**
 * 1) 推荐使用vis-ui的ajax请求
 * 2) 此方法只是修复涉及比较多的老业务captain-ajax，由于出参不一致，减少业务侵入
 */
import captainAjax from 'captain-ajax';

const _global = window._global || {};

export default (args) => {
  const { data = {} } = args;
  data['kdt_id'] = _global.kdt_id || _global.kdtId;
  return captainAjax({
    ...args,
    data,
  });
};
