import UA from '@youzan/utils/browser/ua_browser';

const yzlogInstance = window.yzlogInstance;

const getFrom = () => {
  return UA.isWsc() ? 'app_wsc' : 'weapp';
};

export const logSignIn = (from = getFrom()) => {
  try {
    yzlogInstance.log({
      et: 'custom', // 事件类型
      ei: 'sign_in', // 事件标识
      en: '点击签到按钮', // 事件名称
      params: {
        from,
        operator_source: 'wsc-pc-vis-client',
      }, // 事件参数
    });
  } catch (error) {}
};
