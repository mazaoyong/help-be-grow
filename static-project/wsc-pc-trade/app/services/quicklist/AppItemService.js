const BaseService = require('@youzan/wsc-pc-base/app/services/base/PCBaseService');

/**
 * 有赞云相关接口
 */
class AppItemService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.cloud.appstore.api.service.item.AppItemService';
  }

  /**
   *  根据appIdList批量查询应用,提供给cms使用
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/393341
*
    *  @param {Object} appItemQueryRequest -
    *  @param {number} appItemQueryRequest.pageNo - 查询时当前的页数
（分页查询接口必填）
    *  @param {Array.<Array>} appItemQueryRequest.appIdList[] - 应用编号list
（批量查询时必填）
    *  @param {Array} appItemQueryRequest.appIdList[] -
    *  @param {number} appItemQueryRequest.pageSize - 每页展示的行数
（分页查询接口必填）
    *  @param {string} appItemQueryRequest.title - app名称,模糊查询
    *  @return {Promise}
    */
  async getAppItemListByIds(appItemQueryRequest) {
    return this.invoke('getAppItemListByIds', [appItemQueryRequest]);
  }

  /**
   *  baymax获取应用详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/461843
   *
   *  @param {number} appId -
   *  @return {Promise}
   */
  async getAppItemOptDetail(appId) {
    return this.invoke('getAppItemOptDetail', [appId]);
  }
}

module.exports = AppItemService;
