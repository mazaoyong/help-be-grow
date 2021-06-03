const BaseService = require('../base/BaseService');

/* com.youzan.material.materialcenter.api.service.general.image.QiniuImageWriteService -  */
class QiniuImageWriteService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.material.materialcenter.api.service.general.image.QiniuImageWriteService';
  }

  /**
    *  抓取远程地址保存为七牛公开图片
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/156014
    *
    *  @param {Object} request - {@link QiniuPublicImageFetchRequest}
    *  @param {number} request.partnerBizType - 合作方业务类型
    *  @param {string} request.fromApp - 来源应用名称(调用方在ops平台登记的应用名)
    *  @param {string} request.fetchUrl - 要抓取的远程资源url
    *  @param {string} request.ip - 操作入口来源ip地址
    *  @param {string} request.channel - 业务方接入时登记的来源描述
    *  @param {number} request.maxSize - 允许上传的单文件大小限制(单位:字节)
    *  @param {number} request.operatorType - 操作人帐号类型
{@link OperatorTypeEnum}
    *  @param {string} request.title - 图片名称(可选,需在3~50个字符之间才有效)
    *  @param {number} request.operatorId - 操作人帐号id
    *  @param {number} request.categoryId - 分组id
    *  @param {number} request.partnerBizId - 合作方业务实体id，如kdtId，userId
    *  @return {Promise}
    */
  async fetchPublicImage(request) {
    return this.invoke('fetchPublicImage', [request]);
  }
}

module.exports = QiniuImageWriteService;
