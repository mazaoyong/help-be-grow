/**
 * 店铺元数据说明（类型、角色、连锁、锁定）
 * https://doc.qima-inc.com/pages/viewpage.action?pageId=50301813
 * 上面的链接是后端文档, 需要保持一致
 */

// 店铺锁定状态
export const ShopLockStatus = {
  NORMAL: 0, // 正常
  LOCKED: 1, // 风控锁定
  DELETED: 9, // 删除
};

// 店铺类型
export const ShopType = {
  WSC: 0, // 微商城",
  WXD: 1, // 微小店",
  AXD: 2, // 爱学贷", //爱学贷公司（现在叫爱又米）在我们系统内创建的店铺，实际功能等同于微商城
  PF: 3, // 有赞批发",
  PFSC: 4, // 有赞批发商城",
  CATERING: 5, // 餐饮",
  BEAUTY: 6, // 美业",
  RETAIL: 7, // 零售", //通过shopRole区分单店、总部、门店，原来是PHYSICAL
  CASHIER: 8, // 收银",
  CASHIER_PLUS: 9, // 微商城 + 收银", //包含微商城和收银的功能，不能再新增，可以解绑收银
  RETAIL_HQ: 10, // 总部运营中心", //停止维护
  WAREHOUSE: 11, // 仓库",
  PLATFORM_SUPPLIER: 12, // 平台供货商", //2018-07-05发布
  EXTERNAL: 13, // 外部店铺", //2018-10-18添加，已发布
  GENERAL: 99, // 通用", //有赞云平台型应用所创建，如有赞会议
};

// 店铺主题
export const ShopTopic = {
  NONE: 0, // 无主题
  WSC_EDUCATION: 1, // 微商城教育版
};

// 店铺角色, 表示店铺的拓扑结构中的角色，在连锁里面，它可以是总部（根节点），也可以是门店（子节点），还可以是孤立的
export const ShopRole = {
  SINGLE_SHOP: 0, // 单店  //非连锁体系
  HEADQUARTERS: 1, // 总部  //连锁-总部
  SUB_SHOP: 2, // 门店  //连锁-门店
  WAREHOUSE: 3, // 仓库  //仓库，2018-09-26增加
  PARTNER: 4, // 合伙人  //连锁-合伙人，2018-09-26增加
};

// 店铺加盟类型（总部或单店没有加盟类型，为null）
export const JionType = {
  DIRECT: 1, // 直营
  JOIN: 2, // 加盟
  WAREHOUSING: 3, // 仓储
  ASSOCIATION: 4, // 联营 //2018-08-17增加
  PARTNER: 5, // 合伙人 //2018-09-26增加
};

// 连锁网店模式
export const ChainOnlineShopMode = {
  UNITED_ONLINE_SHOP: 1, // 大网店
  BRANCH_ONLINE_SHOP: 2, // 多网店
};
