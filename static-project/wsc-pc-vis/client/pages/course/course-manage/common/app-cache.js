/**
 * 缓存中心
 */
let cacheData = {
  // 老师列表
  teacherList: null,
  // 上课地点列表
  places: null,
  // 商品页模版
  goodsTemplateList: null,
  // 商品分组
  goodsTag: null,
  // 是否切换到了酒店商品
  isHotelSku: false,
  // 富文本编辑器默认的数据
  hasInitRichtext: false,
  // 判断是否显示sku错误信息
  skuError: false,
  // 记录最近选择的规格名
  skuSelectedMap: {
    common: [], // 通用
    hotel: [], // 酒店商品
  },
  // 判断是否切换会员折扣勾选
  toggleLevelDiscount: false,
  // 是否是新版小程序
  isWeappSupportEcard: false,
  isWeappSupportIdcard: false,
  // 是否可以同步至微信卡包
  canSyncCard: null,
  // 保存的行为
  saveType: '',
};

export default {
  // 更新数据
  set(newData = {}) {
    cacheData = { ...cacheData, ...newData };
  },

  get(key) {
    return key ? cacheData[key] : cacheData;
  },
};
