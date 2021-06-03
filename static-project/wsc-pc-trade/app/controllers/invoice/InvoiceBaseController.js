const BaseController = require('../base/BaseController');

class InvoiceBaseController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.serviceCache = {};
    // 电子发票插件Id
    this.APP_ID = 17457;
    this.ctx.biz = '电子发票';
  }

  /**
   * 创建并获取一个保存在缓存对象中的 service 实例
   *
   * @template T
   * @param {T} ServiceClass
   * @param {string} [name]
   * @returns {InstanceType<T>}
   * @memberof BaseController
   */
  getCacheService(ServiceClass, name) {
    const serviceName = name || ServiceClass.name;
    if (!this.serviceCache[serviceName]) {
      this.serviceCache[serviceName] = new ServiceClass(this.ctx);
    }
    return this.serviceCache[serviceName];
  }

  /**
   * 组合电子发票的商品查询参数
   * @param {*} params
   * @returns
   * @memberof InvoiceBaseController
   */
  mergeInvoiceListItemsPagedParam(params) {
    const ctx = this.ctx;
    const { kdtId } = ctx;
    // 店铺id
    params.kdtId = kdtId;
    // 查询选项
    params.queryOption = {
      withChannelExtra: true,
    };
    return params;
  }
}

module.exports = InvoiceBaseController;
