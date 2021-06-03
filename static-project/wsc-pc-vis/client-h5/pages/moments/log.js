const yzlogInstance = window.yzlogInstance;

export const logSubmitMoment = () => {
  try {
    yzlogInstance.log({
      et: 'click',
      ei: 'submit_moment',
      en: '点击发布动态按钮',
      params: {
        operator_source: 'wsc-pc-vis-client',
      },
    });
  } catch (error) {}
};

export const logVisitMoment = () => {
  try {
    yzlogInstance.log({
      et: 'custom', // 事件类型
      ei: 'vis_moments', // 事件标识
      en: '访问家校圈', // 事件名称
      params: {
      }, // 事件参数
    });
  } catch (error) {}
};
