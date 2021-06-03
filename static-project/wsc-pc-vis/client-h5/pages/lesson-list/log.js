import UA from '@youzan/utils/browser/ua_browser';

const yzlogInstance = window.yzlogInstance;

const getFrom = () => {
  return UA.isWsc() ? 'app_wsc' : 'weapp';
};

export const logVisLessonList = (from = getFrom()) => {
  try {
    yzlogInstance.log({
      et: 'custom', // 事件类型
      ei: 'vis_lesson_list', // 事件标识
      en: '访问课表页', // 事件名称
      params: {
        from,
        operator_source: 'wsc-pc-vis-client',
      }, // 事件参数
    });
  } catch (error) {}
};
