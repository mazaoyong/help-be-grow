const BaseService = require('../base/BaseService');
const { CHANNELS, GOODS_TYPES, PCT_GROUPS } = require('../../constants/goods-selector');

class GoodsSelectorGroupService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.mall.item.api.ItemGroupService';
  }

  // 获取分组列表
  async getGroupList(req) {
    const { kdtId, channel, type, keyword, page, pageSize } = req;
    if (channel !== CHANNELS.online && type === GOODS_TYPES.knowledge) {
      return {
        items: [PCT_GROUPS.column],
        paginator: { page: 1, pageSize: 20, totalCount: 20 },
      };
    } else if (type === GOODS_TYPES.knowledge) {
      return {
        items: Object.values(PCT_GROUPS),
        paginator: { page: 1, pageSize: 20, totalCount: 20 },
      };
    }
    const result = await this.invoke('listGroupPaged', [
      {
        kdtId,
        title: keyword,
        page,
        pageSize,
      },
    ]);
    return result;
  }
}

module.exports = GoodsSelectorGroupService;
