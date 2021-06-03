const BaseService = require('../../../base/BaseService');

class CertificateTemplateFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.certificate.CertificateTemplateFacadeV2';
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/484656
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.sourceId - 来源 id
   *  @param {number} query.certType - 证书类型 1 入学证书 2 毕业证书
   *  @param {number} query.sourceType - 来源类型
   *  @param {string} query.title - 证书标题
   *  @return {Promise}
   */
  async find(kdtId, pageRequest, query) {
    return this.invoke('find', [kdtId, pageRequest, query]);
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/384620
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async get(kdtId, id) {
    return this.invoke('get', [kdtId, id]);
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/484652
   *
   *  @param {number} kdtId -
   *  @param {Object} createCommand -
   *  @param {string} createCommand.sourceId - 证书发放来源唯一 id
   *  @param {number} createCommand.showCourse - 展示 课程名称 1 展示  0 不展示
   *  @param {string} createCommand.qrUrl - 上传二维码 url
   *  @param {number} createCommand.kdtId -
   *  @param {string} createCommand.praiseText - 激励语
   *  @param {number} createCommand.bgNo - 背景图编号 0 自定义 1 背景 1 ...以此类推(默认第一个)
   *  @param {number} createCommand.showScore - 展示 课程分数 1 展示  0 不展示
   *  @param {number} createCommand.type - 证书类型 1 入学证书 2 毕业证书
   *  @param {string} createCommand.title - 证书标题
   *  @param {number} createCommand.showDuration - 展示 课程时长 1 展示  0 不展示
   *  @param {number} createCommand.showCheckinDays - 展示 签到天数 1 展示  0 不展示
   *  @param {number} createCommand.showSNo - 展示 学号 1 展示  0 不展示
   *  @param {number} createCommand.showConsumeCount - 展示 上课次数 1 展示  0 不展示
   *  @param {number} createCommand.issueType - 发放类型 0 无限制 1 课程到期前n天, 2"结班时间前n天", 3消课率达到
   *  @param {number} createCommand.sourceType - 证书发放来源类型 1 线下课
   *  @param {number} createCommand.issuePercentage - 发放课程消课率
   *  @param {number} createCommand.beforeDays - 发放时间 某节点n天之前
   *  @param {string} createCommand.name - 证书模板名称
   *  @param {string} createCommand.shareText - 分享语
   *  @param {number} createCommand.qrType - 二维码类型 0 商品二维码 1 自定义二维码
   *  @param {number} createCommand.showAvatar - 展示 头像 1 展示  0 不展示
   *  @param {number} createCommand.status - 证书模板状态 0 有效 （发放中） 1 失效（停止发放）
   *  @param {string} createCommand.bgUrl - 背景图 url
   *  @param {string} createCommand.signatureText - 证书落款文案
   *  @return {Promise}
   */
  async create(kdtId, createCommand) {
    return this.invoke('create', [kdtId, createCommand]);
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/484653
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.showCourse - 展示 课程名称
   *  @param {string} command.qrUrl - 上传二维码 url
   *  @param {number} command.kdtId - 证书模板状态 0 有效 （发放中） 1 失效（停止发放）
   *  @param {string} command.praiseText - 激励语
   *  @param {number} command.bgNo - 背景图编号 0 自定义 1 背景 1 ...以此类推(默认第一个)
   *  @param {number} command.showScore - 展示 课程分数
   *  @param {string} command.title - 证书标题
   *  @param {number} command.type - 证书类型 1 入学证书 2 毕业证书
   *  @param {number} command.showDuration - 展示 课程时长
   *  @param {number} command.showCheckinDays - 展示 签到天数
   *  @param {number} command.showSNo - 展示 学号
   *  @param {number} command.showConsumeCount - 展示 上课次数
   *  @param {string} command.name - 证书模板名称
   *  @param {string} command.shareText - 分享语
   *  @param {number} command.qrType - 二维码类型 0 商品二维码 1 自定义二维码
   *  @param {number} command.id -
   *  @param {number} command.showAvatar - 展示 头像
   *  @param {number} command.status -
   *  @param {string} command.bgUrl - 背景图 url
   *  @param {string} command.signatureText - 证书落款文案
   *  @return {Promise}
   */
  async update(kdtId, command) {
    return this.invoke('update', [kdtId, command]);
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/384619
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async delete(kdtId, id) {
    return this.invoke('delete', [kdtId, id]);
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/403765
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async invalid(kdtId, id) {
    return this.invoke('invalid', [kdtId, id]);
  }
}

module.exports = CertificateTemplateFacade;
