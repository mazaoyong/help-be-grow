const BaseService = require('../base/BaseService');

/**
 * com.youzan.retail.shop.api.hq.service.HQStoreSearchService
 */
class HQStoreSearchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.retail.shop.api.hq.service.HQStoreSearchService';
  }

  /**
   *  门店管理检索(ES）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/10554
   *
   *  @param {Object} request
   *  @param {Object} request.sortGeo - 根据地理位置排序,输入当前地理位置。
   *  @param {Array.<Array>} request.storeTypes[] - 检索:店铺类型
   *  @param {string} request.sortName - 排序字段
   *  @param {string} request.retailSource - 请求来源,系统名称或前端终端(替代source)
   *  @param {string} request.city - 城市
   *  @param {number} request.hqKdtId - 总部iD
   *  @param {boolean} request.isOnlineOpen - 是否开启网店 true 开启  false 关闭
   *  @param {number} request.pageSize - 分页大小
   *  @param {string} request.source - 请求来源,系统名称或前端终端。
   *  @param {Array.<Array>} request.storeStatuses[] - 检索:店铺状态
   *  @param {string} request.storeStatus - 检索:店铺状态,优先 storeStatuses 生效
   *  @param {boolean} request.hasPartnerKdtId - 是否绑定合伙人
   *  @param {string} request.province - 省份
   *  @param {number} request.pageNo - 分页号
   *  @param {number} request.adminId - 操作人id
   *  @param {string} request.storeName - 检索:门店名称（支持模糊）
   *  @param {number} request.targetAdminId - 目标员工
   *  @param {number} request.storeType - 检索:店铺类型，优先storeTypes生效
   *  @param {string} request.storeNameOrAddress - 检索:门店名称与地址搜索（支持模糊）
   *  @param {number} request.kdtId -
   *  @param {number} request.shopRole - 店铺角色 0：单店（非连锁体系）， 1：总部， 2：门店， 3：仓库
   *  @param {Array.<Array>} request.subKdtIdList - 门店列表
   *  @param {string} request.storeManagerPhoneOrName - 检索:店长账号or名称（支持模糊）
   *  @param {number} request.sortType - 1 升序 2 降序，如果有地理位置排序，需要传该字段
   *  @param {boolean} request.isStoreStatusForceMode - 店铺生命周期是否强制模式(走db查询)
   *  @param {Array.<Array>} request.shopRoleList -
   *  @param {boolean} request.isAllForceMode - 是否强制模式(走db查询)
   *  @return {Promise<any>}
   */
  async search(request) {
    return this.invoke('search', [request]);
  }

  /**
   * 门店管理检索(ES），根据数据权限过滤
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/366747
   *
   *  @param {Object} request
   *  @param {Object} request.sortGeo - 根据地理位置排序,输入当前地理位置。
   *  @param {Array.<Array>} request.storeTypes[] - 检索:店铺类型
   *  @param {string} request.sortName - 排序字段
   *  @param {string} request.retailSource - 请求来源,系统名称或前端终端(替代source)
   *  @param {string} request.city - 城市
   *  @param {number} request.hqKdtId - 总部iD
   *  @param {boolean} request.isOnlineOpen - 是否开启网店 true 开启  false 关闭
   *  @param {number} request.pageSize - 分页大小
   *  @param {string} request.source - 请求来源,系统名称或前端终端。
   *  @param {Array.<Array>} request.storeStatuses[] - 检索:店铺状态
   *  @param {string} request.storeStatus - 检索:店铺状态,优先 storeStatuses 生效
   *  @param {boolean} request.hasPartnerKdtId - 是否绑定合伙人
   *  @param {string} request.province - 省份
   *  @param {number} request.pageNo - 分页号
   *  @param {number} request.adminId - 操作人id
   *  @param {string} request.storeName - 检索:门店名称（支持模糊）
   *  @param {number} request.targetAdminId - 目标员工
   *  @param {number} request.storeType - 检索:店铺类型，优先storeTypes生效
   *  @param {string} request.storeNameOrAddress - 检索:门店名称与地址搜索（支持模糊）
   *  @param {number} request.kdtId -
   *  @param {Array.<Array>} request.subKdtIdList - 门店列表
   *  @param {string} request.storeManagerPhoneOrName - 检索:店长账号or名称（支持模糊）
   *  @param {number} request.sortType - 1 升序 2 降序，如果有地理位置排序，需要传该字段
   *  @param {boolean} request.isStoreStatusForceMode - 店铺生命周期是否强制模式(走db查询)
   *  @param {Array.<Array>} request.shopRoleList - 店铺角色 0：单店（非连锁体系）， 1：总部， 2：门店， 3：仓库
   *  @param {boolean} request.isAllForceMode - 是否强制模式(走db查询)
   *  @return {Promise<any>}
   */
  async searchWithDataPermission(request) {
    return this.invoke('searchWithDataPermission', [request]);
  }

  /**
  *  分页查询组织机构
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1060246 
  *
    *  @param {Object} request - OrganizationPageRequest
    *  @param {string} request.orgName - 组织名称
    *  @param {string} request.retailSource - 请求来源,系统名称或前端终端(替代source)
    *  @param {number} request.kdtId - 
    *  @param {string} request.orgManagerPhoneOrName - 负责人姓名或者电话
    *  @param {number} request.orgOperateModel - 1: "直营店", 2: "加盟店", 4: "联营店"

  组织经营模式
    *  @param {number} request.pageSize - 分页大小
    *  @param {string} request.source - 请求来源,系统名称或前端终端。
    *  @param {string} request.orgStatus - "try": "试用期", "valid": "有效期", "protect": "保护期", pause": "歇业", "close": "打烊"

  组织状态
    *  @param {number} request.orgType - 101: "门店", 102: "网店", 103: "lite", 104: "合伙人", 105: "前置仓", 106: "供货"

  组织类型
    *  @param {boolean} request.orgIsolationStatus - 组织隔离状态 true: 已隔离， false：未隔离
    *  @param {number} request.pageNo - 分页号
    *  @param {number} request.orgOperateStatus - 店铺经营状态 OPEN(2, "营业"),   CLOSED(3, "休息"),
    *  @param {number} request.adminId - 操作人id
    *  @return {Promise}
  */
  async pageOrganization(request) {
    return this.invoke('pageOrganization', [request]);
  }
}

module.exports = HQStoreSearchService;
