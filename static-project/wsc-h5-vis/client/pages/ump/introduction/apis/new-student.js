/**
 * 新学员接口
 */
import { ajax } from '@youzan/vis-ui';

export default {
  // 获取新学员活动信息
  getRefereeActivityInfo(data) {
    return ajax({
      url: '/wscvis/ump/introduction/getRefereeActivityDetail.json',
      data,
    });
  },

  // 点赞
  collectZan(data) {
    return ajax({
      url: '/wscvis/ump/introduction/collectZan.json',
      data,
    });
  },

  // 门槛为需分享时，生成分享记录
  refereeShareActivity(data) {
    return ajax({
      url: '/wscvis/ump/introduction/refereeShareActivity.json',
      data,
    });
  },

  // 领取奖励
  receiveAward(data) {
    return ajax({
      rawResponse: true,
      url: '/wscvis/ump/introduction/receiveAward.json',
      data,
    });
  },

  // 查询活动需要的资料项
  getIntroductionAttribute(data) {
    return ajax({
      url: '/wscvis/ump/introduction/getIntroductionAttribute.json',
      data,
    });
  },

  // 获取验证码
  sendVerifyCode(data) {
    return ajax({
      url: '/wscvis/ump/introduction/sendVerifyCode.json',
      data,
    });
  },

  // 提交资料项
  confirmIntroductionAttributeItem(data) {
    return ajax({
      method: 'POST',
      rawResponse: true,
      url: '/wscvis/ump/introduction/confirmIntroductionAttributeItem.json',
      data,
    });
  },

  // 获取助力海报
  getBoostPoster(data) {
    return ajax({
      url: '/wscvis/ump/poster/getBoostPoster.json',
      data,
    });
  },

  studentIdentityCheck(data) {
    return ajax({
      url: '/wscvis/ump/introduction/studentIdentityCheck.json',
      data,
    });
  },

  getHelperList(data) {
    return ajax({
      url: '/wscvis/ump/introduction/getHelperList.json',
      data,
    });
  },
};
