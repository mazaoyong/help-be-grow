import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { cloneDeep, each, isEmpty, pick, get, map } from 'lodash';
import { getOriginSku } from './api';
import mapKeysToSnakeCase from '@youzan/utils/string/mapKeysToSnakeCase';

import { redirect } from '@/common/utils/custom-safe-link';
import getUserPosition from '@/common/utils/get-user-position';

import { COURSE_EFFECTIVE_TYPE } from '@/constants/course/course-effective-type';
import { VALID_PERIOD_TYPE, VALID_PERIOD_UNIT_DESC } from '@/constants/course/validity-period';
import { COURSE_TYPE } from '@/constants/course/course-type';
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';
import { SERVICE_PLEDGE } from '@/constants/course/service-pledge';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

Vue.use(Vuex);

interface IProps {
  alias: String;
  activityType: Number;
  activitySku: Object;
  originSku: Object;
  selectedSku: null;
  picture: String;
  priceTag: String;
  goodsData: Object;
};

const store: StoreOptions<any> = {
  state: {
    alias: '',
    picture: '',
    priceTag: '',
    activityType: 0,
    activitySku: {},
    originSku: {},
    goodsData: {},
    selectedSku: null,
    formatSku: {},
    formatSelectedSku: {},
    skuButtonsMap: {},
  },
  mutations: {
    setInitData(state, payload) {
      const { alias, activityType, activitySku, originSku, selectedSku, picture, priceTag, goodsData } = payload;
      state.alias = alias;
      state.activityType = activityType;
      state.activitySku = activitySku;
      // 优先取外部传入的选中的sku信息
      state.selectedSku = selectedSku || state.selectedSku;
      state.originSku = originSku;
      state.picture = picture;
      state.priceTag = priceTag;
      state.goodsData = goodsData;
    },

    initButtons(state) {
      const { activityType } = state;
      let button = [];
      if (activityType === ACTIVITY_TYPE.GROUP_BUY || activityType === ACTIVITY_TYPE.LADDER_GROUP) {
        button.push({
          text: '立即报名',
          type: activityType,
        });
      }

      state.skuButtonsMap[activityType] = button;
    },

    formatSku(state) {
      const { originSku, activitySku, activityType } = state;
      const list = cloneDeep(originSku.list);
      if (activityType && activitySku) {
        each(list, item => {
          if (activitySku[item.id]) {
            item.activityPrice = activitySku[item.id];
          }
        });
      }
      state.formatSku = {
        ...originSku,
        tree: mapKeysToSnakeCase(originSku.tree, true),
        list: mapKeysToSnakeCase(list, true),
      };
    },

    formatSelectedSku(state) {
      const { selectedSku, formatSku } = state;
      let initialSku = {};
      if (selectedSku) {
        formatSku.list.forEach((sku: { id: any; stock_num: any; }) => {
          if (sku.id === selectedSku.id && sku.stock_num) {
            initialSku = pick(selectedSku, ['s1', 's2', 's3', 's4', 's5']);
          }
        });
      }
      state.formatSelectedSku = initialSku;
    },

    setSelectedSku(state, sku) {
      state.selectedSku = sku;
    },
  },

  getters: {
    // 用于 sku-block 和 sku-popup
    timeStr(state) {
      function formatTime(time: string | number | Date) {
        const date = new Date(time);
        const year = date.getFullYear();
        const month = date.getMonth() >= 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
        const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
        return `${year}.${month}.${day}`;
      }

      const goodsData = get(state, 'goodsData', {});
      const courseType = get(goodsData, 'courseType', 0);
      const courseSellType = get(goodsData, 'courseSellType', 1);
      const validityPeriodType = get(goodsData, 'validityPeriodType', 1);
      const validityPeriodRange = get(goodsData, 'validityPeriodRange', 0);
      const validityPeriodUnit = get(goodsData, 'validityPeriodUnit', 1);
      const courseEffectiveType = get(goodsData, 'courseEffectiveType', 1);
      const courseEffectiveDelayDays = get(goodsData, 'courseEffectiveDelayDays', 0);
      const courseStartAt = get(goodsData, 'courseStartAt', 0);
      const courseEndAt = get(goodsData, 'courseEndAt', 0);

      const courseEffectiveType2String = {
        [COURSE_EFFECTIVE_TYPE.AFTER_SIGN]() {
          return '首次上课签到后生效';
        },
        [COURSE_EFFECTIVE_TYPE.AFTER_BUY_PERIOD](num: number) {
          return `付款${num}天后生效`;
        },
        [COURSE_EFFECTIVE_TYPE.AFTER_BUY]() {
          return '付款后生效';
        },
      };

      const validPeriodType2String = {
        [VALID_PERIOD_TYPE.FOREVER]() {
          return '';
        },
        [VALID_PERIOD_TYPE.VALID_AFTER_COURSE](num: number, unit: number) {
          return `生效起${num}${VALID_PERIOD_UNIT_DESC[unit] || ''}内可用`;
        },
      };

      // 生效时间描述
      const validStartDesc =
      courseEffectiveType2String[courseEffectiveType] &&
      courseEffectiveType2String[courseEffectiveType](courseEffectiveDelayDays);
      // 有效期描述
      const validPeriodDesc =
      validPeriodType2String[validityPeriodType] &&
      validPeriodType2String[validityPeriodType](validityPeriodRange, validityPeriodUnit);

      if (courseType === COURSE_TYPE.CASUAL || courseSellType === COURSE_SELL_TYPE.DIY) {
        if (courseStartAt && courseEndAt) {
          if (courseStartAt === courseEndAt) {
            return formatTime(courseStartAt);
          } else {
            return `${formatTime(courseStartAt)}-${formatTime(courseEndAt)}`;
          }
        }
        if (courseStartAt) {
          return formatTime(courseStartAt);
        }
      } else if (validityPeriodType === VALID_PERIOD_TYPE.FOREVER && courseSellType !== COURSE_SELL_TYPE.DURATION) {
        return '';
      } else if (courseSellType === COURSE_SELL_TYPE.COUNT) {
        return `${validStartDesc},${validPeriodDesc}`;
      } else if (courseSellType === COURSE_SELL_TYPE.DURATION) {
        return validStartDesc;
      } else if (courseSellType === COURSE_SELL_TYPE.SESSION) {
        return '';
      }
      return '';
    },

    choose(state) {
      const goodsData = get(state, 'goodsData', {});
      const addressIdList = get(goodsData, 'addressIdList', []);
      const shopDetailInfo = get(goodsData, 'shopDetailInfo', {});
      const sku = get(state, 'originSku', {});
      const selectedSku = state.selectedSku;

      let show = false; // 是否展示选择区域
      let title = ''; // 选择区域左侧标题
      let content = ''; // 选择区域右侧内容
      let action = ''; // 选择区域点击操作
      let skuContent = ''; // sku弹窗中地址区域左侧标题
      let skuRightContent = ''; // sku弹窗中地址区域右侧内容
      let skuAction = ''; // sku弹窗中地址区域点击操作

      if (sku.hasSku && sku.stockNum) { // 有可售sku
        show = true;
        title = '选择';
        content = '课程';
        action = 'showSkuPop';
        if (addressIdList.length) { // 有上课地点
          content = '课程及查看上课地点';
          skuContent = '查看上课地点';
          skuRightContent = `共${addressIdList.length}个`;
          skuAction = 'toAddressList';
        }
        if (shopDetailInfo.longitude) { // 有上课校区
          content = '课程及查看上课校区';
          skuContent = '查看上课校区';
          skuRightContent = get(state, 'shopMetaInfo.shopName', '');
          skuAction = 'toMap';
        }
      } else { // 无可售sku
        if (addressIdList.length) { // 有上课地点
          show = true;
          title = '查看';
          content = '上课地点';
          action = 'toAddressList';
        }
        if (shopDetailInfo.longitude) { // 有上课校区
          show = true;
          title = '查看';
          content = '上课校区';
          action = 'toMap';
        }
      }

      if (selectedSku) {
        try {
          const skuInfo = JSON.parse(selectedSku.sku);
          title = '已选';
          content = skuInfo.map((item: { v: any; }) => item.v).join(', ');
        } catch (error) {}
      }

      return {
        show,
        title,
        content,
        action,
        skuContent,
        skuRightContent,
        skuAction,
      };
    },

    service(state) {
      const servicePledge = get(state, 'goodsData.servicePledge', SERVICE_PLEDGE.UNSEEN);
      const servicePledge2Icon = {
        [SERVICE_PLEDGE.UNSEEN]: '',
        [SERVICE_PLEDGE.FREE_APPOINTMENT]: 'no-confirm',
        [SERVICE_PLEDGE.CHECK_AGAIN]: 'need-confirm',
      };
      const servicePledge2String = {
        [SERVICE_PLEDGE.UNSEEN]: '',
        [SERVICE_PLEDGE.FREE_APPOINTMENT]: '该课程购买成功后，不需预约到店即可体验',
        [SERVICE_PLEDGE.CHECK_AGAIN]: '该课程购买成功后，需要等待商家确认',
      };
      return {
        show: servicePledge !== SERVICE_PLEDGE.UNSEEN,
        icon: servicePledge2Icon[servicePledge],
        message: servicePledge2String[servicePledge],
      };
    },
  },

  actions: {
    initSku({ commit }, payload: IProps) {
      const { alias, originSku } = payload;
      commit('setInitData', payload);
      commit('initButtons');
      if (isEmpty(originSku)) {
        getOriginSku(alias)
          .then((res: {}) => {
            commit('setInitData', { originSku: res });
            commit('formatSku');
            commit('formatSelectedSku');
          })
          .catch(() => {});
      } else {
        commit('formatSku');
        commit('formatSelectedSku');
      }
    },

    // 以下方法为 sku-popup 和 sku-block 使用
    toAddressList({ state }) {
      /* log({
        et: 'custom',
        ei: 'to_address',
        en: '查看上课地点',
      }); */
      const addressIdList = get(state, 'goodsData.addressIdList', []);
      const storeIds = JSON.stringify(map(addressIdList, item => item));
      getUserPosition()
        .then(res => {
        // 跳转到地址列表页
          const latitude = res.latitude || 0;
          const longitude = res.longitude || 0;
          redirect({
            url: '/wscvis/edu/address-list',
            query: {
              latitude,
              longitude,
              storeIds,
            },
          });
        })
        .catch(() => { // 用户拒绝授权或获取用户地址失败，则不传当前的地址信息
          redirect({
            url: '/wscvis/edu/address-list',
            query: {
              storeIds,
            },
          });
        });
    },

    toMap({ state }) {
      /* log({
        et: 'custom',
        ei: 'to_map',
        en: '查看上课校区',
      }); */
      const shopDetailInfo = get(state, 'goodsData.shopDetailInfo', {});
      redirect({
        url: '/wscvis/edu/map',
        query: {
          longitude: shopDetailInfo.longitude,
          latitude: shopDetailInfo.latitude,
          province: shopDetailInfo.province,
          city: shopDetailInfo.city,
          district: shopDetailInfo.district,
          address: shopDetailInfo.address,
        },
      });
    },
  },
};

export default new Vuex.Store(store);
