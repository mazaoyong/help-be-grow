const BaseService = require('../../base/BaseService');
const formatDate = require('zan-utils/date/formatDate');

/**
 * 公共操作接口
 */
class OwlCommonService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.biz.service.OwlCommonService';
  }

  /**
   * 知识付费下内容和专栏的 隐藏/显示
   *
   * @param {Object} req
   * @param {number} req.kedId - 店铺 Id
   * @param {string} req.channel - 商品类型
   * @param {string} req.alias - 商品别名
   * @return {Promise<any>}
   */
  async hideOwl(req) {
    const result = await this.invoke('hideOwl', [req]);
    return result;
  }

  /**
   * 对知识付费下内容,直播,专栏,专栏下的内容,专栏下的直播进行排序
   *
   * @param {Object} req
   * @param {number} req.kedId - 店铺 Id
   * @param {string} req.channel - 商品类型
   * @param {string} req.alias - 商品别名
   * @param {number} req.serialNo - 序号
   * @return {Promise<any>}
   */
  async sortOwl(req) {
    const result = await this.invoke('sortOwl', [req]);
    return result;
  }

  /**
   * @param {*} kdtId
   * @param {*} owlList
   * @param {*} columnAlias
   */
  async addContentToColumn(kdtId, owlList = [], columnAlias = '') {
    const result = await this.invoke('addOwl2Column', [{ kdtId, owlList, columnAlias }]);
    return result;
  }

  /**
   * 专栏停止更新
   *
   * @param {*} kdtId
   * @param {*} columnAlias
   */
  async stopUpdateColumn(kdtId, columnAlias = '') {
    const result = await this.invoke('stopUpdateColumn', [{ kdtId, columnAlias }]);
    return result;
  }

  /**
   * TODO 专栏批量添加内容，暂时不能用
   *
   * @param {*} kdtId
   * @param {*} contents
   */
  async batchAdd(kdtId, contents) {
    let success = true;
    const userInfo = this.ctx.getLocalSession('userInfo');

    const requests = contents.map(content => {
      const data = Object.assign({}, content, {
        publishAt: formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ssZ'),
        operator: JSON.stringify({
          user_id: userInfo.id,
          nick_name: userInfo.nickName,
          client_ip: this.ctx.ip,
          source: 'wsc-pc-vis',
        }),
      });

      return this.ajax({
        url: `/${kdtId}/contents/`,
        data,
        method: 'POST',
        domain: 'owl',
        contentType: 'application/json',
      }).catch(e => {
        success = false;
        return {
          data: content,
          error: e.errorContent || 'error',
        };
      });
    });
    const results = await Promise.all(requests);
    return { success, results };
  }

  /**
   * 根据url获取qrcode
   *
   * @see http://zanapi.qima-inc.com/site/service/view/120835
   * @param {*} qrCodeDTO
   * @return {Object}
   * @memberof OwlCommonService
   */
  async createQrCode(qrCodeDTO) {
    const result = await this.invoke('createQrCode', [qrCodeDTO]);
    return result;
  }
}

module.exports = OwlCommonService;
