// 知识付费及插件有效验证
import React from 'react';
import { Sweetalert, Icon } from 'zent';
import get from 'lodash/get';

const prefix = window._global.url.www;
const pctStatusAppId = get(window._global, 'pctStatus.appId');
const pctValid = get(window._global, 'pctStatus.isValid');

export const showAppMarketConfirm = ({ msg = '', link = '', name = '知识付费', appId = pctStatusAppId } = {}) => {
  Sweetalert.confirm({
    title: '订购提醒',
    content: (
      <div>
        <Icon type="info-circle" style={{ marginRight: '5px' }} />
        {msg || `${name}服务已到期，如需正常使用，请先订购`}
      </div>
    ),
    confirmText: '去订购',
    onConfirm() {
      window.open(link || `${prefix}/appmarket/appdesc?id=${appId}`);
    },
  });
};

const showPluginConfirm = (pluginId, desc) => {
  Sweetalert.confirm({
    title: '订购提醒',
    content: (
      <div>
        <Icon type="info-circle" style={{ marginRight: '5px' }} />
        {desc || '插件服务已到期，如需正常使用，请先订购'}
      </div>
    ),
    confirmText: '去订购',
    onConfirm() {
      window.open(`${prefix}/appmarket/appdesc?id=${pluginId}`);
    },
  });
};

/**
 * 知识付费及插件有效验证
 *
 * @param {string} desc - 知识付费不可用的提示语
 * @param {Object} pluginStatus - 插件状态
 * @param {number} pluginStatus.appId - 插件 Id
 * @param {boolean} pluginStatus.isValid - 插件是否可用
 * @param {string} pluginDesc - 插件不可用提示语
 * @return {boolean}
 */
const validCheck = (desc, pluginStatus, pluginDesc) => {
  if (!pctValid) {
    showAppMarketConfirm(desc);
    return false;
  }
  if (get(pluginStatus, 'isValid') === false) {
    showPluginConfirm(pluginStatus.appId, pluginDesc);
    return false;
  }
  return true;
};

export default validCheck;
