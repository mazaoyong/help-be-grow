const BaseService = require('../../../base/BaseService');
/**
 * com.youzan.trade.business.qrcode.api.operate.QrCodeLabelService
 */
class QrCodeLabelService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.qrcode.api.operate.QrCodeLabelService';
  }

  /**
   *  新建二维码标签
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/480192
   *
   *  @param {Object} qrCodeLabelCreateRequestDTO - 新建二维码标签入参模型
   *  @param {number} qrCodeLabelCreateRequestDTO.kdtId - 店铺id
   *  @param {number} qrCodeLabelCreateRequestDTO.shopId - shopId
   *  @param {number} qrCodeLabelCreateRequestDTO.shopType - 店铺类型
   *  @param {string} qrCodeLabelCreateRequestDTO.labelName - 标签名称
   *  @param {number} qrCodeLabelCreateRequestDTO.userId - 操作人id
   *  @return {Promise}
   */
  async addQrLabel(qrCodeLabelCreateRequestDTO) {
    return this.invoke('addQrLabel', [qrCodeLabelCreateRequestDTO]);
  }

  /**
   *  编辑二维码标签
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/480193
   *
   *  @param {Object} qrCodeLabelUpdateRequestDTO - 编辑二维码标签入参模型
   *  @param {number} qrCodeLabelUpdateRequestDTO.kdtId - 店铺id
   *  @param {number} qrCodeLabelUpdateRequestDTO.id - 标签id
   *  @param {string} qrCodeLabelUpdateRequestDTO.labelName - 标签名称
   *  @param {boolean} qrCodeLabelUpdateRequestDTO.delete - 删除标识
   *  @param {number} qrCodeLabelUpdateRequestDTO.userId - 操作人id
   *  @return {Promise}
   */
  async updateQrLabel(qrCodeLabelUpdateRequestDTO) {
    return this.invoke('updateQrLabel', [qrCodeLabelUpdateRequestDTO]);
  }

  /**
   *  二维码标签列表查询(分页)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/480194
   *
   *  @param {Object} qrCodeLabelListQueryOption - 二维码标签列表入参模型
   *  @param {number} qrCodeLabelListQueryOption.kdtId - 店铺id
   *  @param {number} qrCodeLabelListQueryOption.pageSize - 每页条数
   *  @param {number} qrCodeLabelListQueryOption.shopId - 网点id
   *  @param {number} qrCodeLabelListQueryOption.page - 当前页(默认从0开始)
   *  @return {Promise}
   */
  async qrLabelList(qrCodeLabelListQueryOption) {
    return this.invoke('qrLabelList', [qrCodeLabelListQueryOption]);
  }

  /**
   *  二维码标签列表查询(不分页)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/480432
   *
   *  @param {Object} qrCodeLabelListQuery - 二维码标签列表入参模型
   *  @param {number} qrCodeLabelListQuery.kdtId - 店铺id
   *  @param {number} qrCodeLabelListQuery.shopId - 网点id
   *  @return {Promise}
   */
  async labelItems(qrCodeLabelListQuery) {
    return this.invoke('labelItems', [qrCodeLabelListQuery]);
  }

  /**
   *  删除二维码标签
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532496
   *
   *  @param {Object} qrCodeLabelUpdateRequestDTO - 编辑二维码标签入参模型
   *  @param {number} qrCodeLabelUpdateRequestDTO.kdtId - 店铺id
   *  @param {number} qrCodeLabelUpdateRequestDTO.id - 标签id
   *  @param {string} qrCodeLabelUpdateRequestDTO.labelName - 标签名称
   *  @param {boolean} qrCodeLabelUpdateRequestDTO.delete - 删除标识
   *  @param {number} qrCodeLabelUpdateRequestDTO.userId - 操作人id
   *  @return {Promise}
   */
  async deleteQrLabel(qrCodeLabelUpdateRequestDTO) {
    return this.invoke('deleteQrLabel', [qrCodeLabelUpdateRequestDTO]);
  }
}

module.exports = QrCodeLabelService;
