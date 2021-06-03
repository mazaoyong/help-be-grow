const BaseService = require('../../base/BaseService');

/* com.youzan.owl.pc.api.enrollmentposter.EnrollmentPosterFacade -  */
class EnrollmentPosterFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.enrollmentposter.EnrollmentPosterFacade';
  }

  /**
   *  分页查询海报活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/711406
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {number} query.id - 主键ID
   *  @param {string} query.title - 海报名称
   *  @return {Promise}
   */
  async findByConditionPage(kdtId, pageRequest, query) {
    return this.invoke('findByConditionPage', [kdtId, pageRequest, query]);
  }

  /**
   *  根据海报id获取海报详情（B端）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/711794
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} id - 海报活动ID
   *  @return {Promise}
   */
  async getById(kdtId, id) {
    return this.invoke('getById', [kdtId, id]);
  }

  /**
   *  创建海报
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707706
   *
   *  @param {number} kdtId - kdtId 店铺ID
   *  @param {Object} command - command
   *  @param {number} command.templateType - 模板类型0:自定义 1:固定主题
   *  @param {string} command.relevantContext - 关联内容 ：根据context_type（额外字段）
   *  @param {number} command.relevantContextType - 关联内容类型 0:体验课 1:报名表单 2:固定二维码 3：活码
   *  @param {string} command.designId - 设计ID (templateType=1:固定主题 必填 )
   *  @param {string} command.resourceAlias - 关联的资源唯一编号（比如关的是课程 报名表单及其他资源 由前端创建不能重复）
   *  @param {string} command.title - 海报名称
   *  @param {string} command.templatePicUrl - 模板图片（templateType 0:自定义 传入上传的图片ID 1:固定主题 保存在有赞CDN的创客贴地址）
   *  @param {string} command.qrcodeUrl - 二维码图片链接地址（CDN）地址
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
   *  根据海报id删除
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707709
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 海报活动 command
   *  @param {number} command.id - 主键ID
   *  @return {Promise}
   */
  async delete(kdtId, command) {
    return this.invoke('delete', [kdtId, command]);
  }

  /**
   *  编辑海报
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707707
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - command
   *  @param {number} command.templateType - 模板类型0:自定义 1:固定主题
   *  @param {string} command.relevantContext - 关联内容 关联的内容比较复杂：根据context_type定
   *  @param {number} command.relevantContextType - 关联内容类型 0:体验课 1:报名表单 2:固定二维码 3：活码
   *  @param {string} command.designId - 设计ID (templateType=1:固定主题 必填 )
   *  @param {number} command.id - 主键ID
   *  @param {string} command.title - 海报名称
   *  @param {string} command.templatePicUrl - 模板图片
   *  @param {string} command.qrcodeUrl - 二维码图片链接地址（CDN）地址
   *  @return {Promise}
   */
  async edit(kdtId, command) {
    return this.invoke('edit', [kdtId, command]);
  }
}

module.exports = EnrollmentPosterFacade;
