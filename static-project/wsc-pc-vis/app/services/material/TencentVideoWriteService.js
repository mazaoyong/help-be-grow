const BaseService = require('../base/BaseService');

/**
 * 视频上传
 */
class MaterialCenterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.material.materialcenter.api.service.general.video.TencentVideoWriteService';
  }

  /**
   *  获取腾讯视频上传必须的授权令牌
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217009
   *
   *  @param {Object} request - 腾讯视频上传Token获取请求
   *  @param {string} request.fileName - 要上传的视频文件名
   *  @param {boolean} request.useHLS - 是否使用HLS协议(默认为false,使用hls上传会生成分片视频)
   *  @param {number} request.partnerBizType - 合作方业务类型
   *  @param {string} request.fromApp - 来源应用名称(调用方在ops平台登记的应用名)
   *  @param {string} request.ip - 操作入口来源ip地址
   *  @param {string} request.channel - 业务方接入时登记的来源描述
   *  @param {number} request.operatorType - 操作人帐号类型
   *  @param {number} request.operatorId - 操作人帐号id
   *  @param {number} request.partnerBizId - 合作方业务实体id，如kdtId，userId
   *  @return {Promise}
   */
  async videoUploadToken(request) {
    return this.invoke('getVideoUploadToken', [request]);
  }

  /**
   *  创建腾讯视频
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217010
   *
   *  @param {Object} request - 腾讯视频创建请求
   *  @param {boolean} request.useHLS - 是否使用HLS协议,须和获取token保持一致(默认为false,使用hls上传会生成分片视频)
   *  @param {number} request.partnerBizType - 合作方业务类型
   *  @param {string} request.fromApp - 来源应用名称(调用方在ops平台登记的应用名)
   *  @param {string} request.filePath - 上传的视频文件路径
   *  @param {string} request.ip - 操作入口来源ip地址
   *  @param {number} request.maxSize - 允许上传的单文件大小限制(单位:字节)
   *  @param {number} request.operatorType - 操作人帐号类型
   *  @param {number} request.operatorId - 操作人帐号id
   *  @param {number} request.partnerBizId - 合作方业务实体id，如kdtId，userId
   *  @return {Promise}
   */
  async confirmVideoUpload(request) {
    return this.invoke('createVideo', [request]);
  }

  /**
             *  发布腾讯视频
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225399
*
             *  @param {Object} request - 腾讯视频发布请求
             *  @param {string} request.coverUrl - 封面url(可选,需是完整的有赞系图片url,eg:https://img.yzcdn.cn/xxx.jpg)
             *  @param {number} request.coverHeight - 封面高(可选)
             *  @param {number} request.partnerBizType - 合作方业务类型
             *  @param {string} request.fromApp - 来源应用名称(调用方在ops平台登记的应用名)
             *  @param {string} request.videoName - 保存的视频名称
             *  @param {string} request.filePath - 上传的视频文件路径
             *  @param {string} request.ip - 操作入口来源ip地址
             *  @param {number} request.coverWidth - 封面宽(可选)
             *  @param {number} request.operatorType - 操作人帐号类型
 {@link OperatorTypeEnum}
 *  @param {number} request.operatorId - 操作人帐号id
 *  @param {number} request.categoryId - 分组id（为null则加入未分组)
 *  @param {number} request.partnerBizId - 合作方业务实体id，如kdtId，userId
 *  @return {Promise}
 */
  async publishVideo(request) {
    return this.invoke('publishVideo', [request]);
  }
}

module.exports = MaterialCenterService;
