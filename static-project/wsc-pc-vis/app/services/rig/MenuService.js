const BaseService = require('../base/BaseService');

class MenuService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.rig.front.api.service.MenuService';
  }

  /**
    *  获取菜单
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/491340
    *
    *  @param {Object} menuReqDTO -
    *  @param {string} menuReqDTO.thirdUserId - 外部用户id 店铺域为adminId值
    *  @param {string} menuReqDTO.thirdTenantId - 外部id 店铺域为kdtId值
    *  @param {string} menuReqDTO.bizCode - 业务身份标识
    *  @param {number} menuReqDTO.pageNo - 分页
    *  @param {string} menuReqDTO.namespace - 命名空间 namespace 店铺域namespace:np_yz_shop
    *  @param {number} menuReqDTO.pageSize - 分页大小
    *  @param {string} menuReqDTO.version - 菜单版本号 请求的当前版本 移动端就是当前发行版本
    *  @param {number} menuReqDTO.platform - 终端类型 0:common 1:pc : 2:pad  3:app
    *  @return {Promise}
  */
  async getMenuTree(menuReqDTO) {
    return this.invoke('getMenuTree', [menuReqDTO]);
  }
}

module.exports = MenuService;
