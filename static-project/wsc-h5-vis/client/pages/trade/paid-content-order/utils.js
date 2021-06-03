import { action } from '@youzan/zan-jsbridge';
import UA from 'zan-utils/browser/ua';
import Args from 'zan-utils/url/args';
import toUpper from 'lodash/toUpper';
import get from 'lodash/get';
import queryString from 'zan-utils/url/queryString';
import { OWL_TYPES } from './constants';
import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';

// 获取文本行数
export function countLines(ele) {
  var styles = window.getComputedStyle(ele, null);
  var lh = parseInt(styles.lineHeight, 10);
  var h = parseInt(styles.height, 10);
  var lc = Math.round(h / lh);
  return lc;
}

// 获取app scheme
export const getSchemePromise = new Promise((resolve) => {
  if (UA.isAppSdk()) {
    action.getData('getScheme', {}, appScheme => {
      window._global.pctAppSdkScheme = appScheme;
      resolve();
    });
    setTimeout(resolve, 800);
  } else {
    resolve();
  }
});

export const parsePrePayCardInfo = (payGiftCards, payValueCards, unavailablePayGiftCards, unavailablePayValueCards) => {
  // 礼品卡
  const giftCard = {
    list: payGiftCards, // 可用的礼品卡列表
    disabled: unavailablePayGiftCards, // 不可用的礼品卡列表
    checked: payGiftCards // 默认选中的礼品卡
      .filter(item => item.selected)
      .map(item => item.summaryCardNo),
  };
  // 储值卡
  const valueCard = {
    list: payValueCards, // 可用的储值卡列表
    disabled: unavailablePayValueCards, // 不可用的储值卡列表
    checked: payValueCards // 默认选中的储值卡
      .filter(item => item.selected)
      .map(item => item.summaryCardNo),
  };

  return {
    giftCard,
    valueCard,
  };
};

const getSelectedCardBalanceSum = selectedCardArr => {
  return selectedCardArr
    .map(item => item.balance)
    .reduce((accumulator, currentVal) => accumulator + currentVal, 0);
};

// list: 礼品卡或储值卡列表, surplusAmount: 剩余所需要支付的余额, cardType: 'giftCard' - 礼品卡, 'valueCard' - 储值卡
export const disPatchSelectedCardAction = (store, list, surplusAmount, cardType) => {
  const selectedCardArr = list
    .filter(item => item.selected)
    .map(item => {
      return {
        balance: item.balance,
        summaryCardNo: item.summaryCardNo,
      };
    });
  const selectedCardBalanceSum = getSelectedCardBalanceSum(selectedCardArr); // 当前选中的礼品卡数组的金额总数

  if (selectedCardBalanceSum > surplusAmount) { // 选中的礼品卡金额大于所需要支付的余额
    store.dispatch('updatePrePayCardPrice', {
      summaryCardNo: selectedCardArr.map(item => item.summaryCardNo),
      price: surplusAmount,
      cardType,
    });
  } else {
    store.dispatch('updatePrePayCardPrice', {
      summaryCardNo: selectedCardArr.map(item => item.summaryCardNo),
      price: selectedCardBalanceSum,
      cardType,
    });
  }
};

export const formatOrderParams = (params) => {
  const formatString = value => value ? String(value) : undefined;
  const formatNumber = value => value || value === 0 ? Number(value) : undefined;
  const umpInfo = {
    couponId: formatNumber(params.coupon_id),
    couponType: formatString(params.coupon_type),
    groupAlias: formatString(params.group_alias),
    num: formatNumber(params.count),
    promotionType: formatNumber(params.promotion_type) || 0,
    promotionId: formatNumber(params.promotion_id),
  };

  // 推荐有奖场景下再塞推荐有奖参数
  if (+params.channel_type === 6) {
    umpInfo.recommend = {
      recommendBuyerId: formatNumber(params.recommend_buyer_id),
      recommendActivityId: formatString(params.recommend_activity_id),
      recommendFansId: formatNumber(params.recommend_fans_id),
    };
  }

  return {
    bizTracePoint: formatString(params.biz_trace_point_ext),
    callbackUrl: formatString(params.url),
    channelType: formatNumber(params.channel_type),
    productInfoList: [{
      alias: formatString(params.alias),
      num: formatNumber(params.num),
      owlType: OWL_TYPES[toUpper(params.type)],
    }],
    payAsset: formatString(params.pay_asset),
    outerUserId: formatString(params.outer_user_id),
    umpInfo: JSON.stringify(umpInfo),
    infoCollect: params.buyer_info,
    pointsPrice: formatNumber(params.pointsPrice),
  };
};

export const getGotoUrl = ({ type, alias, kdtId, channelType }, result) => {
  const owlType = OWL_TYPES[toUpper(type)];
  if (owlType === 9) { // 如果是群打卡，直接跳群打卡页面
    const params = {
      'kdt_id': kdtId,
      'alias': alias,
    };
    const punchUrl = Args.add(`${get(window, '_global.url.h5')}/wscvis/supv/punch/introduction`, params);
    return punchUrl;
  }
  const baseUrl = get(window, '_global.url.h5') + '/wscvis/knowledge/index?';
  const PAGE_NAME_MAP = {
    [OWL_TYPES.CONTENT]: 'contentshow',
    [OWL_TYPES.COLUMN]: 'columnshow',
    [OWL_TYPES.LIVE]: 'livedetail',
  };

  let owlUrl = baseUrl + queryString.stringify({
    kdt_id: kdtId,
    alias,
    p: PAGE_NAME_MAP[owlType],
  });

  if (+get(result, 'tradeCreateResponse.zeroOrder') === 1 ||
    +get(result, 'tradeCreateResponse.showPayResult') === 1) {
    if (+channelType === 3) {
      owlUrl = baseUrl + queryString.stringify({
        page: 'giftshow',
        gift_type: 1,
        kdt_id: kdtId,
        order_alias: get(result, 'tradeCreateResponse.orderAlias') || '',
        channel_type: channelType,
        alias,
      }) + `#/giftshow?alias=${alias}`;
    }
  }

  return owlUrl;
};

export const customizePostDataAdaptor = (collectInfoSetting, collectInfoValues) => {
  let customizePostData = [];
  Object.entries(collectInfoValues).forEach(([standardKey, currentValue]) => {
    const settingOfCurrentKey = collectInfoSetting.find(setting => {
      return setting.attributeKey === standardKey || String(setting.attributeId) === standardKey;
    });

    if (currentValue && settingOfCurrentKey !== undefined) {
      const { attributeId, dataType, attributeKey } = settingOfCurrentKey;
      let value = currentValue;

      switch (dataType) {
        case TYPE_ENUMS.ADDRESS:
        case TYPE_ENUMS.PROVINCE:
          value = convertAddressLike(value, dataType);
          break;
        case TYPE_ENUMS.MULTISELECT:
          value = convertMultiSelect(value);
          break;
        default: break;
      }

      customizePostData.push({
        attributeId,
        attributeKey,
        value,
      });
    }
  });
  return customizePostData;
};

function convertAddressLike(value, dataType) {
  let currentValue = '';
  if (Array.isArray(value)) {
    let tempValue = value;
    if (dataType === TYPE_ENUMS.ADDRESS) {
      tempValue = value.slice(0, 3);
      tempValue.push({ code: 0, name: value[3] });
    } else {
      tempValue = value.slice(0, 3);
    }
    currentValue = JSON.stringify(tempValue);
  }
  return currentValue;
}

function convertMultiSelect(value) {
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return '';
}
