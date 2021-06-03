import UA from '@youzan/utils/browser/ua_browser';

const yzlogInstance = window.yzlogInstance;

const getFrom = () => {
  return UA.isWsc() ? 'app_wsc' : 'weapp';
};

export const logCreateBatchMoments = () => {
  try {
    yzlogInstance.log({
      et: 'click',
      ei: 'create_batch_moments',
      en: '点击批量点评按钮',
      params: {
        operator_source: 'wsc-pc-vis-client',
      },
    });
  } catch (error) {}
};

export const logCreateMoments = () => {
  try {
    yzlogInstance.log({
      et: 'click',
      ei: 'create_moment',
      en: '点击点评按钮',
      params: {
        operator_source: 'wsc-pc-vis-client',
      },
    });
  } catch (error) {}
};

export const logVisitSchedualDetail = () => {
  try {
    yzlogInstance.log({
      et: 'custom', // 事件类型
      ei: 'vis_schedule_detail', // 事件标识
      en: '访问日程详情页', // 事件名称
      params: {
        operator_source: 'wsc-pc-vis-client',
      }, // 事件参数
    });
  } catch (error) {}
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
