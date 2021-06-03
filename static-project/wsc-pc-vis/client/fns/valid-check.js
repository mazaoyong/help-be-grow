import React from 'react';
import { Sweetalert, Icon } from 'zent';
import get from 'lodash/get';

const prefix = window._global.url.www;

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
 * 插件状态提示
 *
 * @param {Object} pluginStatus - 应用状态，包括 appid 和 isValid
 * @param {string} pluginDesc - 提示内容
 * @return {boolean}
 */
export default (pluginStatus, pluginDesc) => {
  if (get(pluginStatus, 'isValid')) {
    return true;
  }
  showPluginConfirm(get(pluginStatus, 'appId'), pluginDesc);
  return false;
};
