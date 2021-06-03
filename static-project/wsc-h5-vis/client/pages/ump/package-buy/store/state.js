const { _global } = window;
const state = {
  activityEnd: false,
  fetched: false,
  skuVisible: false,
  isMatchPackage: false, // 是否是搭配套餐
  isSeletedSku: false, // 是否选完了规格

  packageIndex: null, // 当前套餐索引
  goodsIndex: null, // 当前商品索引
  packagePrice: 0, // 套餐价
  savePrice: 0, // 节省价

  mainGoods: null, // 搭配套餐主商品

  sku: {}, // 当前商品sku
  currentGoods: {}, // 当前商品
  currentActivity: {}, // 当前活动
  goodsSkus: {}, // 商品sku数据
  selectedGoodsData: {}, // 选中的商品数据
  skuPrices: { // sku价格
    originPrice: 0,
    activityPrice: 0,
  },
  btnPrices: { // 底部按钮价格
    totalPrice: 0,
    savePrice: 0,
  },

  packages: [], // 优惠套餐
  checkedList: [], // 复现框选中的值
  goodsList: [], // 商品列表
  payGoodsList: [], // 下单商品组
  kdtId: _global.kdt_id,
  isCanSelectSolidPackage: true,
};

export default state;
