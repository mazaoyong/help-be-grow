const BaseService = require('../base/BaseService');
class TencentVideoReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.material.materialcenter.api.service.general.video.TencentVideoReadService';
  }

  /**
   *  生成视频播放信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/236080
   *
   *  @param {Object} request - 视频播放信息生成请求
   *  @param {number} request.partnerBizType - 合作方业务类型
   *  @param {number} request.mediaId - 视频素材id
   *  @param {number} request.partnerBizId - 合作方业务实体id，如kdtId，userId
   *  @return {Promise}
   */
  async generateVideoPlayInfo(request) {
    return this.invoke('generateVideoPlayInfo', [request]);
  }
}

module.exports = TencentVideoReadService;
