const BaseService = require('../base/BaseService');

class PunchBaseService extends BaseService {
  async invokeWithBuyerId(serviceName, methodName, query) {
    let q = {};
    if (Array.isArray(query)) {
      q = query[0];
    }

    if (q.buyerId && q.buyerId === 0) {
      q.buyerId = this.ctx.buyerId || 0;
    }

    const rst = await this.owlInvoke(serviceName, methodName, q);
    return rst;
  }
}

module.exports = PunchBaseService;
