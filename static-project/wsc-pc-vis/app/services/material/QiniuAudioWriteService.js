const BaseService = require('../base/BaseService');

/* com.youzan.material.materialcenter.api.service.general.audio.QiniuAudioWriteService -  */
class QiniuAudioWriteService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.material.materialcenter.api.service.general.audio.QiniuAudioWriteService';
  }

  /**
    *  获取宽泛限制的七牛公开音频上传必须的授权令牌(定制化能力)
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/590274
    *
    *  @param {Object} request - {@link QiniuPublicAudioTokenGetRequest}
    *  @param {number} request.partnerBizType - 合作方业务类型
    *  @param {string} request.fromApp - 来源应用名称(调用方在ops平台登记的应用名)
    *  @param {string} request.ip - 操作入口来源ip地址
    *  @param {string} request.channel - 业务方接入时登记的来源描述
    *  @param {number} request.operatorType - 操作人帐号类型
        {@link OperatorTypeEnum}
    *  @param {number} request.operatorId - 操作人帐号id
    *  @param {number} request.partnerBizId - 合作方业务实体id，如kdtId，userId
    *  @return {Promise}
  */
  async getPublicBroadLimitAudioUploadToken(request) {
    return this.invoke('getPublicBroadLimitAudioUploadToken', [request]);
  }
}

module.exports = QiniuAudioWriteService;
