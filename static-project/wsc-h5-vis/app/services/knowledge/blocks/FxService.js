const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');
const KnowledgeBaseService = require('../KnowledgeBaseService');

class FxService extends KnowledgeBaseService {
  /**
   * 创建集赞
   */
  async buildZanSet({
    kdtId, zanId, targetAlias, fansId, fansType, yzFansId, buyerId,
  }) {
    if (yzFansId > 0) {
      fansId = yzFansId;
      fansType = 9;
    }
    const data = {
      kdtId,
      zanId,
      targetAlias,
      fansId: fansId > 0 ? fansId : 0,
      fansType: fansType > 0 ? fansType : 0,
      adminId: buyerId > 0 ? buyerId : 0,
    };
    let ret = await this.owlApiCall({
      url: '/collectzan/buildzanset',
      data,
    });
    return mapKeysToSnakeCase(ret);
  }

  async registerDistributor(data) {
    const {
      kdtId,
      adminId,
      phoneNum,
    } = data;
    const ret = await this.owlApiCall({
      url: `/${kdtId}/${adminId}/distribution/register`,
      data: {
        phoneNum,
      },
      method: 'POST',
    });
    return mapKeysToSnakeCase(ret);
  }
}

module.exports = FxService;
