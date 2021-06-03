const BaseService = require('../base/BaseService');

/* com.youzan.material.materialcenter.api.service.aggregation.QiniuAggregationWriteService -  */
class QiniuAggregationWriteService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.material.materialcenter.api.service.aggregation.QiniuAggregationWriteService';
  }

  /**
     *  获取上传token
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/474675
     *
     *  @param {Object} request
     *  @param {number} request.storeType - 存储维度(必填)
     *  @param {number} request.mediaAccessType - 媒体访问权限(必填)
     *  @param {number} request.partnerBizType - 合作方业务类型(当存储维度为"店铺/合作方维度"时必填)
     *  @param {Object} request.customSavePathExtParam - customAbility = 1，3有意义，存储路径(可选)
     *  @param {string} request.fromApp - 来源应用名称(调用方在ops平台登记的应用名)
     *  @param {string} request.ip - 操作入口来源ip地址
     *  @param {string} request.channel - 业务方接入时登记的来源描述(必填)
     *  @param {number} request.mediaType - 媒体类型(必填)
     *  @param {Object} request.imageUploadExtParam - 上传店铺公开图片裁剪策略(可选)
     *  @param {number} request.partnerBizId - 合作方业务实体id，如kdtId，userId(当存储维度为"店铺/合作方维度"时必填)
     *  @param {number} request.customAbility - 可选，默认为0
     *  @param {Object} request.scrmCustomChannelExtData - customAbility = 5 时有意义，上传渠道附加数据（可选）
     *  @param {number} request.operatorType - 操作人帐号类型
     *  @param {number} request.operatorId - 操作人帐号id
     *  @return {Promise}
  */
  async getUploadToken(request) {
    return this.invoke('getUploadToken', [request]);
  }
}

module.exports = QiniuAggregationWriteService;
