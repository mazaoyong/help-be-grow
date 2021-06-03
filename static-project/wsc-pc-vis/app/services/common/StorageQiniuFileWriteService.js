const BaseService = require('../base/BaseService');

/* com.youzan.material.materialcenter.api.service.storage.file.StorageQiniuFileWriteService -  */
class StorageQiniuFileWriteService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.material.materialcenter.api.service.storage.file.StorageQiniuFileWriteService';
  }

  /**
    *  获取通用存储七牛私有文件上传必须的授权令牌
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/168925
    *
    *  @param {Object} request - {@link StorageQiniuPrivateFileTokenGetRequest}
    *  @param {string} request.fromApp - 来源应用名称(调用方在ops平台登记的应用名)
    *  @param {string} request.ip - 操作入口来源ip地址
    *  @param {string} request.channel - 业务方接入时登记的来源描述
    *  @param {number} request.maxSize - 允许上传的单文件大小限制(单位:字节) {@link OperatorTypeEnum}
    *  @param {number} request.operatorId - 操作人帐号id
    *  @return {Promise}
    */
  async getPrivateFileUploadToken(request) {
    return this.invoke('getPrivateFileUploadToken', [request]);
  }
}

module.exports = StorageQiniuFileWriteService;
