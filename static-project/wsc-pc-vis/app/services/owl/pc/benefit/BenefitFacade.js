const BaseService = require('../../../base/BaseService');

class BenefitFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.benefit.BenefitFacade';
  }

  /**
   *  创建权益包
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431805
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} command - 创建命令
   *  @param {string} command.summary - 简介
   *  @param {string} command.cover - 封面图
   *  @param {number} command.kdtId - 店铺ID
   *  @param {number} command.cardId - 会员卡ID
   *  @param {string} command.name - 名称
   *  @param {string} command.description - 描述
   *  @return {Promise}
   */
  async createBenefitPackage(operatorKdtId, command) {
    return this.invoke('createBenefitPackage', [operatorKdtId, command]);
  }

  /**
   *  编辑权益项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/432236
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} command - 编辑命令
   *  @param {number} command.kdtId -
   *  @param {number} command.packageAlias -
   *  @param {number} command.id -
   *  @param {number} command.type -
   *  @param {number} command.serialNo -
   *  @return {Promise}
   */
  async editBenefitItem(operatorKdtId, command) {
    return this.invoke('editBenefitItem', [operatorKdtId, command]);
  }

  /**
   *  获取权益包详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440021
   *
   *  @param {number} operationId -
   *  @param {Object} query -
   *  @param {number} query.kdtId -
   *  @param {Object} query.options - 查询选项
   *  @param {boolean} query.options.withCount -
   *  @param {string} query.alias -
   *  @return {Promise}
   */
  async getBenefitPackageDetail(operationId, query) {
    return this.invoke('getBenefitPackageDetail', [operationId, query]);
  }

  /**
   *  分页条件查询权益包项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431821
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} pageRequest - 分页请求
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.kdtId - 店铺ID
   *  @param {number} query.packageId - 权益包ID
   *  @return {Promise}
   */
  async findBenefitItemDetailPage(operatorKdtId, pageRequest, query) {
    return this.invoke('findBenefitItemDetailPage', [
      operatorKdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  编辑权益包
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431806
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} command - 编辑命令
   *  @param {string} command.summary - 简介
   *  @param {string} command.cover - 封面图
   *  @param {number} command.kdtId - 店铺ID
   *  @param {number} command.cardId - 会员卡ID
   *  @param {string} command.name - 名称
   *  @param {string} command.description - 描述
   *  @param {number} command.id - 需要更新的权益包ID
   *  @return {Promise}
   */
  async editBenefitPackage(operatorKdtId, command) {
    return this.invoke('editBenefitPackage', [operatorKdtId, command]);
  }

  /**
   *  分页查询权益包
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431808
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {Array.<Array>} query.aliases[] -
   *  @param {number} query.kdtId -
   *  @param {Array.<Array>} query.ids[] -
   *  @return {Promise}
   */
  async findBenefitPackagePage(operatorKdtId, pageRequest, query) {
    return this.invoke('findBenefitPackagePage', [
      operatorKdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  权益包是否存在
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/439291
   *
   *  @param {number} operationId - 操作店铺ID
   *  @param {Object} query -
   *  @param {number} query.kdtId -
   *  @param {string} query.alias -
   *  @return {Promise}
   */
  async checkBenefitPackageStatus(operationId, query) {
    return this.invoke('checkBenefitPackageStatus', [operationId, query]);
  }

  /**
   *  删除权益包
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431807
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} command - 删除命令
   *  @param {number} command.kdtId - 店铺ID
   *  @param {number} command.id - 需要删除的权益包ID
   *  @return {Promise}
   */
  async deleteBenefitPackage(operatorKdtId, command) {
    return this.invoke('deleteBenefitPackage', [operatorKdtId, command]);
  }

  /**
   *  添加权益包项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431810
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} command - 添加命令
   *  @param {number} command.kdtId -
   *  @param {number} command.packageId - 权益包ID
   *  @param {Array.<Array>} command.ids[] - 待添加的内容/专栏ID
   *  @param {Array} command.ids[] -
   *  @param {number} command.type - 类型，0：内容，1：专栏
   *  @return {Promise}
   */
  async addBenefitItems(operatorKdtId, command) {
    return this.invoke('addBenefitItems', [operatorKdtId, command]);
  }

  /**
   *  删除权益包项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431811
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} command - 删除命令
   *  @param {number} command.kdtId -
   *  @param {number} command.packageId - 权益包ID
   *  @param {Array.<Array>} command.ids[] - 待删除的内容/专栏ID
   *  @param {Array} command.ids[] -
   *  @param {number} command.type - 类型，0：内容，1：专栏
   *  @return {Promise}
   */
  async removeBenefitItems(operatorKdtId, command) {
    return this.invoke('removeBenefitItems', [operatorKdtId, command]);
  }

  /**
   *  分页查询可选的权益卡列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/432418
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} query -
   *  @param {number} query.kdtId - 店铺ID
   *  @return {Promise}
   */
  async findSelectableBenefitCardPage(operatorKdtId, pageRequest, query) {
    return this.invoke('findSelectableBenefitCardPage', [
      operatorKdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  分页查询可选的权益项列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/432419
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {number} query.kdtId -
   *  @param {number} query.type -
   *  @param {string} query.packageAlias - 权益包别名
   *  @return {Promise}
   */
  async findSelectableBenefitItemPage(operatorKdtId, pageRequest, query) {
    return this.invoke('findSelectableBenefitItemPage', [
      operatorKdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  分页查询已关联权益卡的权益包
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {Array.<Array>} query.aliases[] -
   *  @param {number} query.kdtId -
   *  @param {Array.<Array>} query.ids[] -
   *  @return {Promise}
   */
  async findAvailableBenefitPackagePage(operatorKdtId, pageRequest, query) {
    return this.invoke('findAvailableBenefitPackagePage', [
      operatorKdtId,
      pageRequest,
      query,
    ]);
  }
}

module.exports = BenefitFacade;
