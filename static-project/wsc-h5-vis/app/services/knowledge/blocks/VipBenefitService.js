const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');
const { formatOwlDateTimeStr } = require('../../../utils');
const KnowledgeBaseService = require('../KnowledgeBaseService');

class VipBenefitService extends KnowledgeBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.VipBenefitService';
  }
  /**
   * 查询权益包详情
   */
  async getBenefitPkg(kdtId, alias, buyerId) {
    let ret = await this.owlApiCall({
      url: `/${kdtId}/benefitPackages/detail/${alias}`,
      data: { buyerId },
    });
    return mapKeysToSnakeCase(ret);
  }

  /**
   * 查询权益包专栏列表
   */
  async getBenefitPkgColumnList(kdtId, alias, page, pageSize) {
    let ret = await this.owlApiCall({
      url: `/${kdtId}/benefitPackages/${alias}/columns`,
      data: { page, pageSize },
    });
    return {
      list: ret.items.map(item => {
        item = mapKeysToSnakeCase(item);
        if (item.publish_at) {
          item.publish_at = formatOwlDateTimeStr(item.publish_at);
        }
        item.cover = item.picture && item.picture.cover;
        return item;
      }),
      page_no: ret.paginator.page,
      total: ret.paginator.totalCount,
    };
  }

  /**
   * 查询权益包内容列表
   */
  async getBenefitPkgContentList(kdtId, alias, page, pageSize) {
    let ret = await this.owlApiCall({
      url: `/${kdtId}/benefitPackages/${alias}/contents`,
      data: { page, pageSize },
    });
    return {
      list: ret.items.map(item => {
        item = mapKeysToSnakeCase(item);
        if (item.publish_at) {
          item.publish_at = formatOwlDateTimeStr(item.publish_at);
        }
        return item;
      }),
      page_no: ret.paginator.page,
      total: ret.paginator.totalCount,
    };
  }

  /**
   * 查询订购的权益包内容
   */
  async getSubscriptionBenefitList(kdtId, buyerId) {
    let ret = await this.owlApiCall({
      url: `/${kdtId}/benefitPackages/userId/${buyerId}`,
    });
    return mapKeysToSnakeCase(ret);
  }

  /**
   * 获取店铺权益包，包含内容数
   */
  async getBenefitsWithCount(kdtId, page, pageSize) {
    let ret = await this.owlApiCall({
      url: `/${kdtId}/benefitPackages/withCount`,
      data: { page, pageSize },
    });
    return {
      items: mapKeysToSnakeCase(ret.items),
      paginator: mapKeysToSnakeCase(ret.paginator),
    };
  }

  /**
   * 获取权益列表
   */
  async getBenefitList(kdtId, page, pageSize) {
    let ret = await this.owlApiCall({
      url: `/${kdtId}/benefitPackages`,
      data: { page, pageSize },
    });
    return {
      items: mapKeysToSnakeCase(ret.items),
      paginator: mapKeysToSnakeCase(ret.paginator),
    };
  }

  // ===

  /**
   * 查询内容&专栏会员权益信息
   */
  async getVipCardInfo(kdtId, buyerId, alias, type) {
    let ret = await this.owlApiCall({
      url: `/${buyerId}/benefitPackage/${kdtId}/${type}/${alias}`,
    });
    return mapKeysToSnakeCase(ret);
  }

  // 获取已购内容和直播
  async getVipUserAllBenefitPkg(dto) {
    const result = await this.invoke(this.SERVICE_NAME, 'getVipUserAllBenefitPkg', dto);
    return result;
  }
}

module.exports = VipBenefitService;
