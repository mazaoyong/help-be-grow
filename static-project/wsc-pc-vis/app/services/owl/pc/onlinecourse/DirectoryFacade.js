const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.ic.foss.api.onlinecourse.DirectoryCourseFacade */
class DirectoryCourseFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.DirectoryFacade';
  }

  /**
   * 删除目录
   * @link http://zanapi.qima-inc.com/site/service/view/1029331
   * @param {number} kdtId -
   * @param {Object} deleteDTO -
   * @param {number} deleteDTO.id - 分类id
   * @param {string} deleteDTO.columnAlias - 专栏的别名
   * @return {Promise}
   */
  async delete(kdtId, deleteDTO) {
    return this.invoke('delete', [kdtId, deleteDTO]);
  }

  /**
   * 移动目录
   * @link http://zanapi.qima-inc.com/site/service/view/1025403
   * @param {number} kdtId -
   * @param {Object} moveDTO -
   * @param {number} moveDTO.targetId - 目标id
   *  当上下移动操作，targetId是要交换的id
   *  当移动操作，targetId是目标父id
   * @param {number} moveDTO.pid - 一级目录传0
   * @param {number} moveDTO.id - 当前目录id
   * @param {number} moveDTO.moveType - 1.上移 2.下移 3.移动
   * @param {string} moveDTO.columnAlias - 专栏的别名
   * @return {Promise}
   */
  async move(kdtId, moveDTO) {
    return this.invoke('move', [kdtId, moveDTO]);
  }

  /**
   * 查询目录树
   * @link http://zanapi.qima-inc.com/site/service/view/1025404
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} queryDTO -
   * @param {number} queryDTO.columnId - 专栏id
   * @param {number} queryDTO.pid - 父目录id
   * @param {string} queryDTO.columnAlias - 专栏的别名
   * @return {Promise}
   */
  async queryDirectoryList(kdtId, pageRequest, queryDTO) {
    return this.invoke('findDirectoryList', [kdtId, pageRequest, queryDTO]);
  }

  /**
   * 目录添加内容
   * @link http://zanapi.qima-inc.com/site/service/view/1025405
   * @param {number} kdtId -
   * @param {Object} addContentDTO -
   * @param {number} addContentDTO.pid - 父目录id，一级目录传0
   * @param {number} addContentDTO.id - 目录id
   * @param {Array} addContentDTO.contentList - 内容列表
   * @param {string} addContentDTO.columnAlias - 专栏的别名
   * @return {Promise}
   */
  async directoryAddContent(kdtId, addContentDTO) {
    return this.invoke('directoryAddContent', [kdtId, addContentDTO]);
  }

  /**
   * 目录移动内容
   * @link http://zanapi.qima-inc.com/site/service/view/1025406
   * @param {number} kdtId -
   * @param {Object} moveContentDTO -
   * @param {number} moveContentDTO.id - 目标目录id
   * @param {Array} moveContentDTO.contentList - 内容列表
   * @param {string} moveContentDTO.columnAlias - 专栏的别名
   * @return {Promise}
   */
  async directoryMoveContent(kdtId, moveContentDTO) {
    return this.invoke('directoryMoveContent', [kdtId, moveContentDTO]);
  }

  /**
   * 修改目录
   * @link http://zanapi.qima-inc.com/site/service/view/1025407
   * @param {number} kdtId -
   * @param {Object} updateDTO -
   * @param {string} updateDTO.name - 分类名称
   * @param {number} updateDTO.id - 当前分类id
   * @param {string} updateDTO.columnAlias - 专栏的别名
   * @return {Promise}
   */
  async update(kdtId, updateDTO) {
    return this.invoke('update', [kdtId, updateDTO]);
  }

  /**
   * 查询当前目录下的内容
   * @link http://zanapi.qima-inc.com/site/service/view/1025408
   * @param {number} kdtId -
   * @param {string} columnAlias -
   * @param {number} directoryId -
   * @return {Promise}
   */
  async queryContentByDirectoryId(kdtId, columnAlias, directoryId) {
    return this.invoke('queryContentByDirectoryId', [kdtId, columnAlias, directoryId]);
  }

  /**
   * 目录创建
   * @link http://zanapi.qima-inc.com/site/service/view/1025402
   * @param {number} kdtId -
   * @param {Object} createDirectoryDTO -
   * @param {string} createDirectoryDTO.name - 分类名称
   * @param {number} createDirectoryDTO.pid - 直属父分类id（如果是根节点，此字段传0）
   * @param {string} createDirectoryDTO.columnAlias - 专栏的别名
   * @return {Promise}
   */
  async create(kdtId, createDirectoryDTO) {
    return this.invoke('create', [kdtId, createDirectoryDTO]);
  }
}

module.exports = DirectoryCourseFacade;
