const BaseService = require('../base/BaseService');
/**
 */
class MenuService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.sam.service.MenuService';
  }

  /**
   *  获取sam配置的全部权限表
   *  @param {object} MenuTreeRequest
   *  @return {Promise<MenuItem[]>}
   */
  async getHoverMenuTree(checkWhiteListDTO) {
    return this.invoke('getHoverMenuTree', [checkWhiteListDTO]);
  }
}

module.exports = MenuService;
