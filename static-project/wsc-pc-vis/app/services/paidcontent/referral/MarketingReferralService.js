const BaseService = require('../../base/BaseService');

class MarketingReferralService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.marketing.api.referral.service.ReferralService';
  }

  // 获取列表
  async list(req) {
    const { activities: datasets, count } = await this.invoke('findActivities', [req]);

    datasets.forEach(item => {
      const date = new Date().getTime();
      if (item.status === 2) {
        // 已失效
        item.life = 4;
      } else if (item.startAt > date) {
        // 活动未开始
        item.life = 1;
      } else if (item.startAt < date && date < item.endAt) {
        // 活动进行中
        item.life = 2;
      } else if (item.endAt < date) {
        // 活动已结束
        item.life = 3;
      }
    });

    return { datasets, count };
  }

  // 数据列表
  async effectList(req) {
    const result = await this.invoke('referralEffectList', [req]);
    return result;
  }
}

module.exports = MarketingReferralService;
