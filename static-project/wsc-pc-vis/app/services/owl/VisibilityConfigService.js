const BaseService = require('../base/BaseService');

/**
 */
class VisibilityConfigService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.VisibilityConfigService';
  }

  /**
   * 获取店铺指定开发可见性配置
   *
   * @param {*} kdtId
   * @param {*} switchFun
   */
  async getVisibility(kdtId, switchFun) {
    const result = await this.invoke('getVisibilityConfigForKdt', [{ kdtId, switchFun }]);
    return result;
  }

  /**
   * 全局店铺设置(首次)
   *
   * @param {*} kdtId
   * @param {*} switchFun
   * @param {*} showType
   * @param {*} itemFields
   * @param {*} operator
   */
  async createKdtVisibility(kdtId, switchFun, showType, itemFields, operator) {
    const result = await this.invoke('createKdtVisibilityConfig', [
      {
        kdtId,
        switchFun,
        showType,
        itemFields,
        operator,
      },
    ]);
    return result;
  }

  /**
   * 切换店铺可见性开关
   *
   * @param {*} kdtId
   * @param {*} switchFun
   * @param {*} showType
   * @param {*} operator
   */
  async putKdtVisibility(kdtId, switchFun, showType, operator) {
    const result = await this.invoke('switchKdtVisibilityConfig', [
      {
        kdtId,
        switchFun,
        showType,
        operator,
      },
    ]);
    return result;
  }

  /**
   * 获取直播所有可见性配置
   *
   * @param {*} kdtId
   * @param {*} alias
   */
  async getVisibilityConfigForLive(kdtId, alias) {
    const result = await this.invoke('getVisibilityConfigForLive', [
      {
        kdtId,
        alias,
      },
    ]);
    return result;
  }

  /**
   * 单商品可见性设置「首次」
   *
   * @param {*} singleVisibilityCreateReqDTOList
   */
  async createSingleVisibilityConfig(kdtId, singleVisibilityCreateReqDTOList) {
    const result = await this.invoke('setSingleVisibilityConfigV2', [kdtId,
      {
        singleVisibilityCreateReqDTOList,
      },
    ]);
    return result;
  }

  /**
   * 单商品可见性切换「单个商品」
   *
   * @param {*} singleVisibilityPutReqDTOList
   */
  async putSingleVisibilityConfig(kdtId, singleVisibilityPutReqDTOList) {
    const result = await this.invoke('switchSingleVisibilityConfigV2', [kdtId,
      {
        singleVisibilityPutReqDTOList,
      },
    ]);
    return result;
  }
}

module.exports = VisibilityConfigService;
