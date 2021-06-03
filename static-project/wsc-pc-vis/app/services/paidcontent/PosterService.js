const BaseService = require('../base/BaseService');

class PosterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.PosterActivityApiService';
  }

  // 获取海报列表
  async lists(req) {
    const result = await this.invoke('listPosters', [req]);
    return result;
  }

  // 新建海报活动
  async create(req) {
    const result = await this.invoke('createPoster', [req]);
    return result;
  }

  // 删除海报活动
  async delete(req) {
    const result = await this.invoke('deletePosterById', req);
    return result;
  }

  // 查询海报活动详情
  async detail(req) {
    const result = await this.invoke('getPosterById', req);
    return result;
  }

  // 更新海报活动
  async update(req) {
    const result = await this.invoke('updatePosterById', [req]);
    return result;
  }

  // 推广海报活动
  async popularize(req) {
    const result = await this.invoke('popularizePosterById', req);
    return result;
  }

  // 结束海报活动
  async terminate(req) {
    const result = await this.invoke('terminatePosterById', req);
    return result;
  }
}

module.exports = PosterService;
