// 推荐有奖
const BaseService = require('../../base/BaseService');

class ReferralService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.manage.api.specific.ReferralService';
  }

  // 新建
  async create(req) {
    const result = await this.invoke('createActivity', [req]);
    return result;
  }

  // 更新
  async update(req) {
    const result = await this.invoke('editActivity', [req]);
    return result;
  }

  // 查询详情
  async detail(req) {
    const result = await this.invoke('getActivity', req);
    return result;
  }

  // 删除
  async delete(req) {
    const result = await this.invoke('deleteActivity', req);
    return result;
  }

  // 结束活动
  async end(req) {
    const result = await this.invoke('endActivity', req);
    return result;
  }
}

module.exports = ReferralService;
