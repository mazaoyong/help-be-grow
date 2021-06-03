import get from 'lodash/get';
import args from '@youzan/utils/url/args.js';

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

export const logClickShare = (params = {}) => {
  try {
    const mediaType = get(params, 'data.extraContents[0].contentType');

    yzlogInstance.log({
      et: 'click', // 事件类型
      ei: 'click_share', // 事件标识
      en: '点击分享按钮', // 事件名称
      params: {
        operator_source: envName,
        reviewed_num: params.reviewedNum,
        visibility: params.visibility || -1,
        image_num: mediaType === 0 ? params.imageNum : 0,
        post_id: params.postId,
        video_num: mediaType === 2 ? params.videoNum : 0,
      }, // 事件参数
    });
  } catch (error) {}
};

export const logClickMakePoster = (params = {}) => {
  try {
    const mediaType = get(params, 'data.extraContents[0].contentType');
    yzlogInstance.log({
      et: 'click', // 事件类型
      ei: 'click_make_poster', // 事件标识
      en: '点击生成海报按钮', // 事件名称
      params: {
        operator_source: envName,
        reviewed_num: params.reviewedNum,
        visibility: params.visibility || -1,
        image_num: mediaType === 0 ? params.imageNum : 0,
        post_id: params.postId,
        video_num: mediaType === 2 ? params.videoNum : 0,
      }, // 事件参数
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
        operator_source: envName,
      }, // 事件参数
    });
  } catch (error) {}
};

export const logVisitMomentDetail = (params = {}) => {
  try {
    const nameMap = {
      '0': '普通',
      '1': '消息推送',
      '2': '链接分享',
      '3': '海报分享',
    };
    const logFromName = args.get('logfrom') || 0;
    const fromName = nameMap[logFromName];

    const mediaType = get(params, 'data.extraContents[0].contentType');
    yzlogInstance.log({
      et: 'custom', // 事件类型
      ei: 'vis_moments_detail', // 事件标识
      en: '访问点评详情页', // 事件名称
      params: {
        operator_source: envName,
        reviewed_num: params.reviewedNum,
        visibility: params.visibility || -1,
        image_num: mediaType === 0 ? params.imageNum : 0,
        post_id: params.postId,
        video_num: mediaType === 2 ? params.videoNum : 0,
        front_page: fromName,
      }, // 事件参数
    });
  } catch (error) {}
};

export const logSubmitMoment = () => {
  try {
    yzlogInstance.log({
      et: 'click',
      ei: 'submit_moment',
      en: '点击发布动态按钮',
      params: {
        operator_source: envName,
      },
    });
  } catch (error) {}
};
