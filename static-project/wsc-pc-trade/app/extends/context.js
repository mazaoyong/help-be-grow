/**
 * 扩展 Koa Context 对象
 */
module.exports = {
  /**
   * 兼容多种类型店铺的根店铺 kdtId，若是单店（无 rootKdtId），则取自己的 kdtId，若是连锁，则取 rootKdtId。
   *
   * 功能：用于连锁接口中的 headKdtId 参数，将 headKdtId 从前端隐藏到 node 层，保证 headKdtId 参数的可信度
   *
   * @this Context
   * @returns {number}
   */
  get rootKdtId() {
    const ctx = this;
    const shopInfo = ctx.getState('shopInfo');
    const rootKdtId = shopInfo.rootKdtId || shopInfo.kdtId;
    return rootKdtId;
  },
};
