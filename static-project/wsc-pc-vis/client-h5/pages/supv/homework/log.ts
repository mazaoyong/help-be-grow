const yzlogInstance = window.yzlogInstance;
const kdtId = window._global.kdtId;

export const shareHomeworkLog = () => {
  try {
    yzlogInstance.log({
      et: 'click', // 事件类型
      ei: 'share_homework', // 事件标识
      en: '分享作业', // 事件名称
      pt: 'homeworkReview', // 页面类型
      params: {
        kdt_id: kdtId
      }, // 事件参数
    });
  } catch (error) {}
};

export const submitCorrectLog = (data: {
  video_number: number,
  audio_number: number,
  image_number: number,
}) => {
  const {
    video_number,
    audio_number,
    image_number,
  } = data;
  try {
    yzlogInstance.log({
      et: 'custom', // 事件类型
      ei: 'submit_correct', // 事件标识
      en: '提交作业', // 事件名称
      pt: 'homeworkReview', // 页面类型
      params: { 
        im_n: image_number,
        ad_n: audio_number,
        vd_n: video_number,
        kdt_id: kdtId
      } // 事件参数
    });
  } catch (error) {}
}

export const quickCommentUseLog = () => {
  try {
    yzlogInstance.log({
      et: 'custom', // 事件类型
      ei: 'use_quick_comment', // 事件标识
      en: '使用快捷评语', // 事件名称
      pt: 'homeworkReview', // 页面类型
      params: {
        kdt_id: kdtId
      }, // 事件参数
    });
  } catch (error) {}
};