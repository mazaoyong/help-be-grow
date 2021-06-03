const BaseService = require('@youzan/wsc-pc-base/app/services/base/PCBaseService');

/* com.youzan.cloud.appstore.api.service.manager.cclient.AppSubscribeQueryService -  */
/**
 * 有赞云相关接口
 */
class AppSubscribeQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.cloud.appstore.api.service.manager.cclient.AppSubscribeQueryService';
  }

  /**
             *  查询店铺下用户订阅的app列表
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417689 
*
             *  @param {Object} request - 
             *  @param {number} request.kdtId - 店铺ID
             *  @param {number} request.pageNo - 查询时当前的页数
 （分页查询接口必填）
             *  @param {number} request.pageSize - 每页展示的行数
 （分页查询接口必填）
             *  @param {number} request.categoryId - 类目id（非必传）
             *  @return {Promise}
             */
  async queryAppSubscribeList(request) {
    return this.invoke('queryAppSubscribeList', [request]);
  }
}

module.exports = AppSubscribeQueryService;
