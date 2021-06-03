const BaseService = require('../../base/BaseService');

/**
 * com.youzan.ump.voucher.front.api.service.activity.VoucherActivityReadService
 */
class VoucherActivityReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.voucher.front.api.service.activity.VoucherActivityReadService';
  }

  /**
   *  查询展示场景的活动列表【分页】
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/478762
   *
   *  @param {Object} activityShowScenePQRequest - 展示场景的活动分页请求
   *  @param {number} activityShowScenePQRequest.kdtId - 店铺kdtId
   *  @param {string} activityShowScenePQRequest.titleKeyword - 搜索的(活动名)关键词
   *  @param {number} activityShowScenePQRequest.pageSize - 页数
   *  @param {string} activityShowScenePQRequest.refActivityScene - 关联活动场景
   *  @param {number} activityShowScenePQRequest.pageNum - 页码
   *  @return {Promise}
   */
  async listActivityOnShowScene(activityShowScenePQRequest) {
    return this.invoke('listActivityOnShowScene', [activityShowScenePQRequest]);
  }
}

module.exports = VoucherActivityReadService;
