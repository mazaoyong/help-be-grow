const BaseService = require('../base/BaseService');

class ItemGroupService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.mall.item.api.ItemGroupService';
  }

  /**
   * 获取商品分组
   * https://doc.qima-inc.com/pages/viewpage.action?pageId=48937174
   *
   * @param kdtId 店铺 ID
   * @param page 页码
   * @param pageSize 页数
   * @param keyword 分组标题
   * @returns {Promise<{items, count}>}
   */
  async listGroupPaged({ kdtId, page, pageSize, keyword }) {
    const req = {
      kdtId,
      page,
      pageSize,
    };

    if (keyword) {
      req.title = keyword;
    }

    const {
      items,
      paginator: { totalCount: count },
    } = await this.invoke('listGroupPaged', [req]);

    return { items, count };
  }
}

module.exports = ItemGroupService;
