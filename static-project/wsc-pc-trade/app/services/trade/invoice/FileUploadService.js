const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.tool.FileUploadService
 */
class FileUploadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.tool.FileUploadService';
  }

  /**
   *  图片上传获取token接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6631
   *
   *  @param {number} kdtId -
   *  @return {Promise<any>}
   */
  async getPictureUploadTokenByKdtId(kdtId) {
    return this.invoke('getPictureUploadTokenByKdtId', [kdtId]);
  }

  /**
   *  文件上传获取token接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6628
   *
   *  @param {integer} kdtId -
   *  @return {Promise<any>}
   */
  async getFileUploadTokenByKdtId(kdtId) {
    return this.invoke('getFileUploadTokenByKdtId', [kdtId]);
  }
}

module.exports = FileUploadService;
