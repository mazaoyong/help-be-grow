const yzlogInstance = window.yzlogInstance;
const miniprogram = _global.miniprogram || {};
const envName = (function() {
  let name = 'h5';
  if (miniprogram.isWeapp) {
    name = 'weapp';
  } else if (miniprogram.isSwanApp) {
    name = 'swan';
  }
  return name;
})();

export const logClickShare = () => {
  try {
    yzlogInstance.log({
      et: 'click', // 事件类型
      ei: 'click_share', // 事件标识
      en: '微信分享', // 事件名称
      params: {
        operator_source: envName,
      }, // 事件参数
    });
  } catch (error) {}
};

export const logClickHref = () => {
  try {
    yzlogInstance.log({
      et: 'click', // 事件类型
      ei: 'click_href', // 事件标识
      en: '分享链接', // 事件名称
      params: {
        operator_source: envName,
      }, // 事件参数
    });
  } catch (error) {}
};

export const logClickCard = () => {
  try {
    yzlogInstance.log({
      et: 'click', // 事件类型
      ei: 'click_card', // 事件标识
      en: '微信分享', // 事件名称
      params: {
        operator_source: envName,
      }, // 事件参数
    });
  } catch (error) {}
};
