/**
 * 通用环境判断
 */
import editConfig from './edit-config';
import Model from './model';
// import Constants from '../constants';

const extraItemKeys = ['PIAOFUTONG', 'TIANSHITONGCHENG'];

export default {
  // 是否编辑商品（白名单内的商家可以修改商品类型，供货/分销商品不支持）
  isEdit() {
    return +Model.get('goods_type') === 10 || +Model.get('goods_platform') === 10;
  },

  isPureEdit() {
    return Model.get('id') > 0;
  },

  // 是否实物商品
  isReal() {
    return +Model.get('shipment') === 0 || +Model.get('shipment') === 7;
  },

  // 是否虚拟商品
  isVirtual() {
    return +Model.get('shipment') === 2;
  },

  // 是否电子卡券商品
  isEcard() {
    return +Model.get('shipment') === 3;
  },

  // 是否酒店商品
  isHotel() {
    return +Model.get('goods_type') === 35 || +Model.get('shipment') === 4;
  },

  // 是否蛋糕烘焙
  isCake() {
    return +Model.get('shipment') === 5;
  },

  // 是否餐饮商品
  isCanyin() {
    return +Model.get('shipment') === 6;
  },

  // 是否生鲜果蔬商品
  isFresh() {
    return +Model.get('shipment') === 7;
  },

  // 是否分销
  isFenxiao() {
    return +Model.get('goods_type') === 10;
  },

  // 是否周期购商品
  isPeriodBuy() {
    return +Model.get('goods_type') === 24;
  },

  // 是否来自供货商品
  isSupplier() {
    return +Model.get('goods_platform') === 10;
  },

  // 是否外部购买
  isOuter() {
    return +Model.get('shop_method') === 0;
  },

  // 是否折叠商品类型
  isDetailFold() {
    return +Model.get('detailInfoExtra') === 0;
  },

  // 是否折叠基本信息
  isBaseFold() {
    return +Model.get('basicInfoExtra') === 0;
  },

  isBaseChildFold() {
    return +Model.get('basicChildInfoExtra') === 0;
  },

  // 是否折叠价格信息
  isPriceFold() {
    return +Model.get('priceInfoExtra') === 0;
  },

  // 是否折叠其他信息
  isOtherFold() {
    return +Model.get('otherInfoExtra') === 0;
  },

  isReadOnly(key) {
    return editConfig.get(key).readonly;
  },

  lockedMsg(key) {
    return editConfig.get(key).message;
  },

  isNeedConfirm(key) {
    return editConfig.get(key).confirm;
  },

  getConfirmMsg(key) {
    return editConfig.get(key).confirm_message;
  },

  isEditLock() {
    return +Model.get('is_edit_lock');
  },

  // CP后台锁
  isCPLock() {
    return +Model.get('is_lock') === 1;
  },

  // 分销活动锁
  isFenxiaoLock() {
    return +Model.get('is_lock') === 2;
  },

  // 多人成团商品锁
  isGrouponLock() {
    return +Model.get('is_lock') === 3;
  },

  // 积分商城商品锁
  isPointsstoreLock() {
    return +Model.get('is_lock') === 4;
  },

  // 有赞微信公众号推广活动
  isActivityLock() {
    let lockItems = Model.get('item_lock_types') || [];
    return !!(lockItems && lockItems.length > 0 && lockItems.includes(101));
  },

  // 是否为票付通商品
  isPiaoFuTong() {
    return extraItemKeys.includes(Model.get('extra_item_type'));
  },

  // 是否为票付通商品且开启对接
  isPiaoFuTongOpen() {
    return (
      extraItemKeys.includes(Model.get('extra_item_type')) &&
      +Model.get('extra_item_status') === 1
    );
  },

  // 是否为定金预售
  isPartPreSale() {
    return +Model.get('pre_sale_type') === 1;
  },

  // 是否参加会员折扣
  isJoinLevelDiscount() {
    return +Model.get('join_level_discount') === 1;
  },

  // 是否同步至微信卡包
  syncWechatBag() {
    return Model.get('update_we_chat_bag');
  },

  // 是否为长期有效的电子卡券
  isLongPeriodCard() {
    return +Model.get('validity_type') === 0 || +Model.get('validity_type') === 1;
  },

  // 商品是否已经设置为广点通推广商品
  isTxAdsGood() {
    return Model.get('locked_by_ad');
  },
};
