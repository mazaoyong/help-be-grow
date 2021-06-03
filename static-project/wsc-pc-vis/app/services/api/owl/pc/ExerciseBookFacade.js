const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.exercisebook.ExerciseBookFacade */
class ExerciseBookFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.exercisebook.ExerciseBookFacade';
  }

  /**
   * 获取作业本详情
   * @link http://zanapi.qima-inc.com/site/service/view/1003608
   * @param {number} kdtId -
   * @param {number} id -
   * @return {Promise}
   */

  async getExerciseBookDetail(kdtId, id) {
    return this.invoke('getExerciseBookDetail', [kdtId, id]);
  }

  /**
   * 创建作业本
   * @link http://zanapi.qima-inc.com/site/service/view/1008729
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {number} command.studentViewOtherWorkType - 学员查看其他人作业的方式
   *  1：作业提交后可查看他人作业
   *  2：作业被批阅后可查看他人作业
   * @param {number} command.studentViewWorkScope - 学员查看作业的范围
   *  1： 用户可查看其他人提交的所有作业
   *  2： 用户仅能查看被选为优秀作业的作业
   * @param {Object} command.joinSetting - 加入方式设置
   * @param {Array} command.teacherList - 关联的老师
   * @param {string} command.title - 作业本标题
   * @param {Object} command.infoCollect - 信息采集
   * @param {Object} command.operator - 操作人
   * @return {Promise}
   */

  async createExerciseBook(kdtId, command) {
    return this.invoke('createExerciseBook', [kdtId, command]);
  }

  /**
   * 更新作业本
   * @link http://zanapi.qima-inc.com/site/service/view/1008730
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {number} command.studentViewOtherWorkType - 学员查看其他人作业的方式
   *  1：作业提交后可查看他人作业
   *  2：作业被批阅后可查看他人作业
   * @param {number} command.studentViewWorkScope - 学员查看作业的范围
   *  1： 用户可查看其他人提交的所有作业
   *  2： 用户仅能查看被选为优秀作业的作业
   * @param {Object} command.joinSetting - 加入方式设置
   * @param {Array} command.teacherList - 关联的老师
   * @param {number} command.id - 作业本id
   * @param {string} command.title - 作业本标题
   * @param {Object} command.infoCollect - 信息采集
   * @param {Object} command.operator - 操作人
   * @return {Promise}
   */

  async updateExerciseBook(kdtId, command) {
    return this.invoke('updateExerciseBook', [kdtId, command]);
  }

  /**
   * 删除作业本
   * @link http://zanapi.qima-inc.com/site/service/view/1008731
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {number} command.id - 联系本的id
   * @param {Object} command.operator - 操作人
   * @return {Promise}
   */

  async deleteExerciseBook(kdtId, command) {
    return this.invoke('deleteExerciseBook', [kdtId, command]);
  }

  /**
   * 分页查询班级关联的作业本列表
   * @link http://zanapi.qima-inc.com/site/service/view/1008736
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {number} query.classId - 班级id
   * @param {number} query.targetKdtId - 校区kdtId
   * @return {Promise}
   */

  async findExerciseRelClassPage(kdtId, pageRequest, query) {
    return this.invoke('findExerciseRelClassPage', [kdtId, pageRequest, query]);
  }

  /**
   * 分页查询可选班级列表
   * @link http://zanapi.qima-inc.com/site/service/view/1020365
   * @param {number} kdtId -
   * @param {Object} request - 分页请求
   * @param {number} request.pageNumber -
   * @param {boolean} request.countEnabled - 是否开启count，默认为开启
   * @param {number} request.pageSize -
   * @param {Object} request.sort -
   * @param {Object} query -
   * @param {string} query.eduClassName - 班级名称
   * @return {Promise}
   */

  async findClassPageByCondition(kdtId, request, query) {
    return this.invoke('findClassPageByCondition', [kdtId, request, query]);
  }

  /**
   * 作业本上/下架
   * @link http://zanapi.qima-inc.com/site/service/view/1023904
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {number} command.id - 练习集id
   * @param {Object} command.operator - 操作人
   * @param {number} command.status - 练习集状态：(1,上架),(2,下架)
   * @return {Promise}
   */

  async updateExerciseBookSoldStatus(kdtId, command) {
    return this.invoke('updateExerciseBookSoldStatus', [kdtId, command]);
  }

  /**
   * 商家小程序端，查询作业本列表
   * @link http://zanapi.qima-inc.com/site/service/view/1024847
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {string} query.title - 作业的标题
   * @param {number} query.userId - 用户名称
   * @return {Promise}
   */
  async findPageByUserId(kdtId, pageRequest, query) {
    return this.invoke('findPageByUserId', [kdtId, pageRequest, query]);
  }

  /**
   * 分页查询商家后台作业本列表
   * @link http://zanapi.qima-inc.com/site/service/view/1008735
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {Array} query.bookIds - 作业本ids
   * @param {Object} query.createAtDateRange - 创建时间间隔
   * @param {string} query.title - 作业标题
   *  支持模糊查询
   * @param {number} query.status - 作业本状态
   *  0：查询所有
   *  1：已上架
   *  2：下架
   * @return {Promise}
   */
  async findPageByCondition(kdtId, pageRequest, query) {
    return this.invoke('findPageByCondition', [kdtId, pageRequest, query]);
  }
}

module.exports = ExerciseBookFacade;
