const BaseService = require('../../../base/BaseService');

/**
 * 班级管理
 */
class EduClassFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.educlass.EduClassFacade';
  }

  /**
   *  分页查询班级信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347519
   *
   *  @param {number} kdtId -
   *  @param {Object} page -
   *  @param {number} page.pageNumber -
   *  @param {boolean} page.countEnabled - 是否开启count，默认为开启
   *  @param {number} page.pageSize -
   *  @param {Object} page.sort -
   *  @param {Object} query -
   *  @param {string} query.eduClassName - 班级名称
   *  @param {number} query.classStatus - 班级状态
   *  @param {number} query.eduCourseId - 课程id
   *  @param {number} query.kdtId - 校区 ID
   *  @return {Promise}
   */
  async findEduClassByCondition(kdtId, page, query) {
    return this.invoke('findEduClassByCondition', [kdtId, page, query]);
  }

  /**
   *  创建班级
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347512
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.eduClassName - 班级名称
   *  @param {string} command.startTime - 开班时间
   *  @param {number} command.maxStuNum - 班级容量
   *  @param {number} command.eduCourseId - 关联的课程id
   *  @param {string} command.endTime - 结班时间
   *  @return {Promise}
   */
  async createEduClass(kdtId, command) {
    return this.invoke('createEduClass', [kdtId, command]);
  }

  /**
   *  更新班级
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347513
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.eduClassName - 班级名称
   *  @param {number} command.maxStuNum - 班级容量
   *  @param {number} command.id - 班级id
   *  @param {string} command.endTime - 结班时间 不能小于创建的时候选择的结班时间
   *  @return {Promise}
   */
  async updateEduClass(kdtId, command) {
    return this.invoke('updateEduClass', [kdtId, command]);
  }

  /**
   *  删除班级
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347514
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async deleteEduClass(kdtId, id) {
    return this.invoke('deleteEduClass', [kdtId, id]);
  }

  /**
   *  删除班级
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425226
   *
   *  @param {number} operatorKdtId - 操作者店铺id
   *  @param {Object} eduClassIdCommand - 班级id操作参数
   *  @param {number} eduClassIdCommand.kdtId - 校区店铺id
   *  @param {number} eduClassIdCommand.eduClassId - 班级id
   *  @return {Promise}
   */
  async deleteEduClassV2(operatorKdtId, eduClassIdCommand) {
    return this.invoke('deleteEduClassV2', [operatorKdtId, eduClassIdCommand]);
  }

  /**
   *  通过id查询班级基础信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347517
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async getEduClassById(kdtId, id) {
    return this.invoke('getEduClassById', [kdtId, id]);
  }

  /**
   *  通过id查询班级基础信息，数据比上面的丰富
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347518
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async getEduClassDetailById(kdtId, id) {
    return this.invoke('getEduClassDetailById', [kdtId, id]);
  }

  /**
   *  通过No查询班级基础信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/662585
   *
   *  @param {number} operatorKdtId - 当前店铺kdtId
   *  @param {Object} command - 班级id操作参数
   *  @param {number} command.kdtId - 校区店铺id
   *  @param {string} command.classNo - 班级编号
   *  @return {Promise}
   */
  async getEduClassByNo(operatorKdtId, command) {
    return this.invoke('getEduClassByNo', [operatorKdtId, command]);
  }

  /**
   *  通过id查询班级基础信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425231
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} eduClassIdCommand - 班级id操作参数
   *  @param {number} eduClassIdCommand.kdtId - 校区店铺id
   *  @param {number} eduClassIdCommand.eduClassId - 班级id
   *  @return {Promise}
   */
  async getEduClassDetailByIdV2(operatorKdtId, eduClassIdCommand) {
    return this.invoke('getEduClassDetailByIdV2', [operatorKdtId, eduClassIdCommand]);
  }

  /**
   *  添加学员
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347515
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.eduClassId - 添加到的班级id
   *  @param {Array.<Object>} command.addStudents[] - 添加到班级的学员
   *  @param {integer} command.addStudents[].studentId - 被添加的学员id
   *  @param {string} command.addStudents[].assetNo - 添加学员时所选择的课时编号
   *  @return {Promise}
   */
  async addStuToEduClass(kdtId, command) {
    return this.invoke('addStuToEduClassV2', [kdtId, command]);
  }

  /**
   *  调班
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347516
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.studentId - 被调学员id
   *  @param {number} command.toEduClassId - 调到的班级id
   *  @param {Object} command.operator - 操作人
   *  @param {number} command.fromEduClassId - 从哪个班调到哪个班
   *  @param {remark} command.remark - 备注
   *  @return {Promise}
   */
  async changeStuEduClass(kdtId, command) {
    return this.invoke('changeStuEduClass', [kdtId, command]);
  }

  /**
   *  移除学员
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/386111
   *
   *  @param {number} kdtId - 店铺 id
   *  @param {number} eduClassId - 班级 id
   *  @param {number} stuId - 学员 id
   *  @return {Promise}
   */
  async removeClassStu(kdtId, eduClassId, stuId) {
    return this.invoke('removeClassStu', [kdtId, eduClassId, stuId]);
  }

  /**
   *  班级下移除学员接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425385
   *
   *  @param {number} operatorKdtId - 店铺id
   *  @param {Object} eduClassRemoveStuCommand - 移除学员请求参数
   *  @param {number} eduClassRemoveStuCommand.stuId - 学员id
   *  @param {number} eduClassRemoveStuCommand.kdtId - 校区店铺id
   *  @param {number} eduClassRemoveStuCommand.eduClassId - 班级id
   *  @return {Promise}
   */
  async removeClassStuV2(operatorKdtId, eduClassRemoveStuCommand) {
    return this.invoke('removeClassStuV2', [operatorKdtId, eduClassRemoveStuCommand]);
  }

  /**
   *  根据 goodsId 和 skuId 查询班级信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425163
   *
   *  @param {number} kdtId -
   *  @param {number} goodsId -
   *  @param {number} skuId -
   *  @return {Promise}
   */
  async getEduClassBySkuIdAndGoodsId(kdtId, goodsId, skuId) {
    return this.invoke('getEduClassBySkuIdAndGoodsId', [kdtId, goodsId, skuId]);
  }

  // 分页查询班级（根据班级名）
  async findPageByName(kdtId, pageRequest, eduClassNameQuery) {
    return this.invoke('findPageByName', [kdtId, pageRequest, eduClassNameQuery]);
  }
}

module.exports = EduClassFacade;
