import Vue from 'vue';
import SkuModal from './index.vue';

let instance;
// const _global = window._global;
// const kdtId = _global.kdt_id;

const initInstance = () => {
  instance = new (Vue.extend(SkuModal))({
    el: document.createElement('div'),
  });

  document.body.appendChild(instance.$el);
};

const showSkuModal = data => {
  if (!instance) {
    initInstance();
  }

  Object.assign(instance, {
    kdtId: data.kdtId,
    imgUrl: data.imgUrl,
    price: data.price,
    isVip: data.isVip,
    stock: data.stock,
    storeIds: data.storeIds,
    servicePledge: data.servicePledge,
    serviceMessage: data.serviceMessage,
    goodsId: data.goodsId,
    value: true,
    status: data.status,
    sku: data.sku,
    selectedSku: data.selectedSku,
    goods: data.goods,
    type: data.type,
    courseActivityType: data.courseActivityType,
    courseType: data.courseType,
    courseTime: data.courseTime,
    courseSellType: data.courseSellType,
    campusName: data.campusName,
    shopDetailInfo: data.shopDetailInfo,
    promotionInfo: data.promotionInfo || [],
    activityType: data.activityType,
    hideStock: data.hideStock,
    ladderPrice: data.ladderPrice || {},
    groupAlias: data.groupAlias,
  });
};

export default showSkuModal;
