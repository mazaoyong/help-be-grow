/**
 * @file
 * 这里是 confirm/create 接口入参拼接
 * 这里不需要做空值的校验，参数的校验已经在bill-service前置做了
 */

import { get, find } from 'lodash';
import { isEduChainStore } from '@youzan/utils-shop';
import * as SafeLink from '@/common/utils/custom-safe-link';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { getBizTracePoint } from '@/common/biz/point';
import { getRedirectParam } from '@/pages/trade/buy/common/redirect';
import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';
import { format as formatDate } from 'date-fns';

export const getOrderParam = (state, getters, payload = {}) => {
  const param = {
    bookKey: state.order.bookKey,
    callbackUrl: getCallbackUrl(state, getters),
    bizTracePoint: getBizTracePoint(),
    fromThirdApp: state.env.isThirdApp,
    channelType: state.order.channelType,
    payAsset: getPayAssetParam(state),
    productInfoList: getProductInfoListParam(state, getters),
    umpInfo: getUmpInfoParam(state, getters, payload),
    from: getFrom(state),
  };

  if (getters.isNeedStudent) {
    param.studentInfo = getStudentInfoParam(state, getters);
  }

  if (getters.isNeedAppointment) {
    param.lessonAppointmentDTO = getAppointmentParam(state, getters);
  }

  if (getters.isNeedInfoCollect) {
    param.infoCollect = getInfoCollectParam(state);
  }

  return param;
};

// 拼装支付完成后的跳转地址
function getCallbackUrl(state, getters) {
  const redirectQuery = getRedirectParam(state, getters, true);
  let callbackUrl = SafeLink.getSafeUrl(redirectQuery);
  // 因为内部用了args，会将参数的的query转译，导致后端无法替换订单号
  return decodeURIComponent(callbackUrl);
}

// 拼装储值卡 / 礼品卡参数
function getPayAssetParam(state) {
  const payAsset = {};
  const { giftCard, valueCard } = state;

  // 礼品卡
  if (giftCard.checked.length) {
    payAsset.giftCardNos = giftCard.checked;
  }

  // 储值卡
  if (valueCard.checked.length) {
    payAsset.valueCardNos = valueCard.checked;
  }

  // 如果有使用储值卡 / 礼品卡， 设置店铺id
  if (payAsset.giftCardNos || payAsset.valueCardNos) {
    payAsset.kdtId = _global.kdt_id;
  }

  return payAsset;
}

// 拼装商品信息
function getProductInfoListParam(state, getters) {
  const { order } = state;
  const { chosenCoupon, goodsList } = getters;

  const productInfoList = goodsList.map(goods => ({
    alias: goods.alias,
    id: goods.goodsId,
    num: goods.num,
    owlType: goods.owlType,
    skuId: goods.skuId,
  }));
  productInfoList.forEach(productInfo => {
    const item =
      find(
        order.items,
        ({ goodsId, skuId }) =>
          productInfo.id === goodsId && productInfo.skuId === skuId,
      ) || {};
    productInfo.extensions = item.extensions || {};

    // 使用商品兑换券标，后端根据兑换券标识对商品进行拆分
    //  groupType  7:优惠券 9:一卡一码 10:通用码 11:社区团购券 12:三方券 13:兑换券2.0
    if (chosenCoupon.groupType === 13) {
      const chosenCouponGoods =
        find(
          goodsList,
          goods =>
            goods.itemId === chosenCoupon.optimalPreferentialOrderItemIds[0],
        ) || {};
      const outerItemId = chosenCouponGoods.outerItemId;

      if (
        outerItemId &&
        +outerItemId === +productInfo.extensions.OUTER_ITEM_ID
      ) {
        productInfo.extensions.USE_GOODS_EXCHANGE_COUPON = '1';
      }
    }
  });

  return productInfoList;
}

// 拼装ump信息
function getUmpInfoParam(state, getters, payload) {
  const umpInfo = {};

  umpInfo.channelType = state.order.channelType;

  // 优惠券
  if (getters.chosenCoupon.id) {
    umpInfo.couponType = getters.chosenCoupon.type;
    umpInfo.couponId = getters.chosenCoupon.id;
  }

  // 会员卡
  // 这里不能使用 getters.chosenCustomCard.id
  // 否则营销互斥卡刷confirm之后list会重置为空，导致选中丢失
  umpInfo.useCustomerCard = {
    customerCardId: state.customerCard.chosenId,
  };

  // 使用营销互斥卡
  if (getters.useExclusionCard) {
    umpInfo.umpConfig = {
      isForbidCoupon: true,
      isForbidPreference: true,
    };
  }

  // 针对新流程，切换会员卡的时候，让后端选择最优的优惠卷
  if (payload.source === 'customerCard') {
    umpInfo.couponId = undefined;
    umpInfo.couponType = undefined;
    umpInfo.systemChoose = true;
  }

  umpInfo.promotionId = state.shop.activityId;
  umpInfo.promotionType = state.shop.activityType;

  switch (state.shop.activityType) {
    case ACTIVITY_TYPE.GIFT:
      umpInfo.num = getters.singleGoods.num;
      break;
    case ACTIVITY_TYPE.RECOMMEND_GIFT:
      umpInfo.recommend = state.recommendGift;
      break;
    case ACTIVITY_TYPE.POINTS_EXCHANGE:
      umpInfo.pointsExchange = {
        pointsPrice: state.pointsExchange.pointsPrice,
        usePoints: true,
      };
      break;
    case ACTIVITY_TYPE.GROUP_BUY:
      umpInfo.groupAlias = state.shop.activityAlias;
      break;
    case ACTIVITY_TYPE.LADDER_GROUPON:
      umpInfo.groupAlias = state.shop.activityAlias;
      umpInfo.ladderNum = state.ladderGroupon.ladderNum;
      break;
    case ACTIVITY_TYPE.TUITION:
      umpInfo.promotionAlias = state.shop.activityAlias;
      umpInfo.tuitionDeduction = { isUseTuitionDeduction: getters.isUseTuition };
      break;
  }

  return umpInfo;
}

// 拼装学员信息(时间，地址)
function getStudentInfoParam(state, getters) {
  const studentInfo = getters.chosenStudent;

  const courseAttend = {};

  if (getters.isNeedTime) {
    const chosenTime = state.classTime.chosenTime;
    const cousenDate = new Date(chosenTime);
    courseAttend.courseTime = formatDate(cousenDate, 'YYYY-MM-DD HH:mm');
    courseAttend.courseTimeStamp = cousenDate.getTime();
  }

  if (getters.isNeedAddress) {
    courseAttend.address = getters.chosenClassAddress.name;
    courseAttend.addressId = getters.chosenClassAddress.id;
  } else {
    // 非下单参数，在日志上标记一下降级
    if (state.classAddress.down) {
      courseAttend.DOWN_ADDRESS = true;
    }
  }

  // 针对预约场景
  // 需要把预约的时间塞到上课时间里面用作订单信息展示
  if (getters.isNeedAppointment) {
    const time = state.appointment.time || [];
    let date = '';

    if (typeof time[0] === 'number') {
      date = formatDate(time[0], 'YYYY年MM月DD日');
      date += ` ${formatDate(time[0], 'HH:mm')}`;
      date += `-${formatDate(time[1], 'HH:mm')}`;
    }

    courseAttend.courseTime = date;
  }

  // 连锁的情况下不能选择地址
  // 但需要把校区信息塞到上课地址里用作订单信息展示
  if (isEduChainStore) {
    courseAttend.address = get(_global, 'mp_data.shop_name');
    courseAttend.addressId = get(_global, 'mp_data.kdt_id');
  }

  studentInfo.courseAttend = courseAttend;

  return studentInfo;
}

// 拼装预约信息
function getAppointmentParam(state, getters) {
  // 巨坑！-1代表暂时不预约，而且是字符型！！
  if (state.appointment.lesson === '-1') {
    return;
  }

  return {
    studentId: getters.chosenStudent.id,
    lessonNo: state.appointment.lesson,
  };
}

// 拼装信息采集信息
function getInfoCollectParam(state) {
  const converAddressLike = (value, dataType) => {
    let currentValue = '';
    if (Array.isArray(value)) {
      let tempValue = value;
      if (dataType === TYPE_ENUMS.PROVINCE) {
        tempValue = value.slice(0, 3);
      }
      currentValue = JSON.stringify(tempValue);
    }
    return currentValue;
  };

  const converMultiSelect = value => {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return '';
  };

  const {
    data: collectInfoValues,
    settings: collectInfoSetting,
  } = state.infoCollect;

  let customizePostData = [];
  const collectInfoValueKeys = Object.keys(collectInfoValues);
  if (collectInfoValueKeys.length > 0 && Array.isArray(collectInfoSetting)) {
    collectInfoValueKeys.forEach(standardKey => {
      const settingOfCurrentKey = collectInfoSetting.find(setting => {
        return (
          setting.attributeKey === standardKey ||
          String(setting.attributeId) === standardKey
        );
      });

      if (settingOfCurrentKey !== undefined) {
        const { attributeId, dataType, attributeKey } = settingOfCurrentKey;
        let value = collectInfoValues[standardKey];

        switch (dataType) {
          case TYPE_ENUMS.ADDRESS:
          case TYPE_ENUMS.PROVINCE:
            value = converAddressLike(value, dataType);
            break;
          case TYPE_ENUMS.MULTISELECT:
            value = converMultiSelect(value);
            break;
          default:
            break;
        }

        customizePostData.push({
          attributeId,
          attributeKey,
          value,
        });
      }
    });
  }
  return {
    customizeItems: customizePostData,
  };
}

// 获取招生海报的来源信息
function getFrom(state) {
  const { fromId, fromType } = state.order;
  if (fromType) {
    return {
      fromId,
      fromType,
    };
  }
}
