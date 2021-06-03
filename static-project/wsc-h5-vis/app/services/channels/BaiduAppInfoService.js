const BaseService = require('../base/BaseService');

class BaiduAppInfoService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.channels.apps.service.BaiduAppInfoService';
  }

  /**
   *  获取小程序二维码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/429890
   *  @deprecated 这个接口已经被后端标注为已废弃
   *  @param {Object} dto - 内部参数都是非必填
   *  @param {string} dto.path - 自定义打开路径
   *  @param {number} dto.kdtId - 店铺id
   *  @param {string} dto.packageId - 可指定代码包id(只支持审核、开发、线上版本)，不传默认线上版本
   *  @param {number} dto.width - 默认200px，最大1280px，最小200px
   *  @param {number} dto.businessType - 业务类型
   *  @return {Promise}
   */
  async getBaiduAppQrCode(dto) {
    const result = await this.invoke('getBaiduAppQrCode', [dto]);
    return result;
  }
}

module.exports = BaiduAppInfoService;
