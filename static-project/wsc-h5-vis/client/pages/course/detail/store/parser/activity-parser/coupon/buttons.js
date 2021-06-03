import { get, keyBy } from 'lodash';
import { GOODS_TYPE } from '@/constants/course/goods-type';
import pay from '@/pages/course/detail/store/pay';
import store from '@/pages/course/detail/store';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import openSkuPopup from '@/pages/course/detail/store/sku-popup';
import {
  isRetailMinimalistPartnerStore,
  isUnifiedPartnerStore,
} from '@youzan/utils-shop';
import { redirectToShop } from '../default/buttons/utils';
import { autoReceiveCouponMessage } from '@/pages/course/detail/store/actions';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import format from '@youzan/utils/money/format';

const defaultLogName = 'coupon';

const defaultSkuText = '领券报名';

function getKdtId() {
  return _global.kdtId || _global.kdt_id || '';
}

function originBuy() {
  if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
    redirectToShop(getKdtId());
  } else {
    pay(ACTIVITY_TYPE.NO_ACTIVITY, null, 'groupon-origin');
  }
}

function autoReceiveCouponPay(
  state,
  activityType = ACTIVITY_TYPE.COUPON,
  logName = defaultLogName,
  options = {},
) {
  const needOpenSku = get(state, 'goodsData.sku.hasSku', false);

  return function(payload) {
    if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
      redirectToShop(getKdtId());
    } else if (needOpenSku) {
      openSkuPopup(activityType, false, {
        skuActivityType: options.skuActivityType,
      });
    } else {
      const { activityData } = store.state;

      const optimalCoupon = get(
        activityData,
        'coupon.optimalSkuPreference',
        {},
      );
      const { activityId: couponId } = optimalCoupon;
      autoReceiveCouponMessage(couponId).then((config) => {
        pay(
          options.payActivityType || activityType,
          { ...payload, config },
          logName,
        );
      });
    }
  };
}
// SkuId
function skuAutoReceiveCouponPay(
  activityType = ACTIVITY_TYPE.COUPON,
  logName = defaultLogName,
) {
  return function action(payload) {
    if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
      redirectToShop(getKdtId());
      return;
    }
    const { activityData } = store.state;
    const selectedSkuId = get(store.state, 'selectedSku.id');
    const skuPreferenceList = get(activityData, 'coupon.skuPreferenceList', []);
    const skuCouponMap = keyBy(skuPreferenceList, 'skuId');
    const couponId = get(skuCouponMap, [selectedSkuId, 'activityId']);
    // TODO catch exception
    // if (!couponId) return;
    autoReceiveCouponMessage(couponId).then((config) => {
      pay(activityType, { ...payload, config }, logName);
    });
  };
}

function formatSubTitleCommon(money, hasSku = false, prefix = '券后') {
  let lastStr = '';
  if (hasSku) {
    lastStr = '起';
  }
  const moneyStr = ' ¥' + formatMoney(money);
  const needShort = money.toString().length >= 9;
  if (needShort) return '券后' + moneyStr + lastStr;
  return prefix + moneyStr + lastStr;
}

function formatSubTitleByMoneySku(money, hasSku) {
  return function _prefix(prefix) {
    return formatSubTitleCommon(money, hasSku, prefix);
  };
}

function formatSubTitleBySku(hasSku) {
  return function _prefixMoney(prefix, money) {
    return formatSubTitleCommon(money, hasSku, prefix);
  };
}

function formatMoney(money) {
  if (money % 100 === 0) {
    return money / 100;
  } else if (money % 10 === 0) {
    return (money / 100).toFixed(1);
  } else {
    return (money / 100).toFixed(2);
  }
}

// coupon activity
export default function buttonsRule(
  activityData,
  state,
  activityTypes,
  parsedActivityDataMap,
) {
  const { goodsType, goodsData = {} } = state;
  const { priceTag } = activityData;
  const { sellerType, column } = goodsData;

  let buttons = [];
  let skuButtons;
  const optimalCouponPrice = get(
    activityData,
    'coupon.optimalSkuPreference.preferentialPrice',
    0,
  );
  const skuPreferencePriceList = get(
    activityData,
    'coupon.skuPreferenceList',
    [],
  ).map((item) => item.preferentialPrice);
  const uniqSkuPrices = Array.from(new Set(skuPreferencePriceList));
  const hasSkuPrice = uniqSkuPrices.length > 1;

  const formatSubTitle = formatSubTitleByMoneySku(
    optimalCouponPrice,
    hasSkuPrice,
  );

  // last btn
  let mainButtonText =
    goodsType === GOODS_TYPE.COURSE ? '领券报名' : '领券购买';

  // 自定义课程购买按钮
  if (
    goodsType === GOODS_TYPE.COURSE &&
    get(goodsData, 'buyButton.buyBtnConfig', 0)
  ) {
    mainButtonText = get(goodsData, 'buyButton.buyBtnLabel', mainButtonText);
  }

  const commonAction = autoReceiveCouponPay(state, ACTIVITY_TYPE.COUPON);

  // 默认行为
  buttons.push({
    text: [mainButtonText, formatSubTitle(priceTag)],
    action: commonAction,
  });

  if (goodsType === GOODS_TYPE.COURSE) {
    skuButtons = [
      {
        text: defaultSkuText,
        action: skuAutoReceiveCouponPay(),
      },
    ];
  }
  // 多人拼团：「领券开团」下方的原拼团的价格修改为“拼团券后¥x（起）” 按钮名称改为“领券开团”
  if (activityTypes.includes(ACTIVITY_TYPE.GROUP_BUY)) {
    const parsedGroupActivity =
      parsedActivityDataMap[ACTIVITY_TYPE.GROUP_BUY] || {};

    const getSubTitleByPrefixMoney = formatSubTitleBySku(hasSkuPrice);

    if (parsedGroupActivity.status === ACTIVITY_STATUS.GOING) {
      buttons = [
        {
          text: [
            '直接报名',
            `￥${+format(goodsData.sku.minPrice, true, false)}`,
          ],
          action: originBuy,
        },
        {
          text: [
            '领券开团',
            getSubTitleByPrefixMoney('拼团券后', optimalCouponPrice),
          ],
          action: autoReceiveCouponPay(
            state,
            ACTIVITY_TYPE.COUPON,
            'coupon-groupon-create',
            {
              skuActivityType: ACTIVITY_TYPE.COUPON,
              payActivityType: ACTIVITY_TYPE.GROUP_BUY,
            },
          ),
        },
      ];
      skuButtons = [
        {
          text: defaultSkuText, // 相当于拼团活动的下一步
          action: skuAutoReceiveCouponPay(
            ACTIVITY_TYPE.GROUP_BUY,
            'coupon-groupon-origin',
          ),
        },
      ];

      const { isJoined, joinedGroup } = parsedGroupActivity;
      if (
        isJoined &&
        !joinedGroup.isGrouponSuccess &&
        !joinedGroup.isGrouponFailed
      ) {
        const toGroupBtn = {
          text: '查看我的团',
          url: `/wscvis/ump/groupon/groupon-detail?alias=${
            goodsData.alias
          }&group_alias=${joinedGroup.alias}&activity_type=${
            ACTIVITY_TYPE.GROUP_BUY
          }&kdt_id=${getKdtId()}`,
        };
        if (goodsType === GOODS_TYPE.COURSE) {
          buttons[1] = toGroupBtn;
        } else {
          buttons = [toGroupBtn];
        }
      }
    }
  }

  // 推荐有奖：按钮更名为“好友推荐专享”，下方的副文案为“券后 ¥xx 起”
  if (activityTypes.includes(ACTIVITY_TYPE.RECOMMEND_GIFT)) {
    buttons = [
      { text: ['好友推荐专享', formatSubTitle('券后')], action: commonAction },
    ];
  }

  if (sellerType === SELLER_TYPE.COLUMN || sellerType === SELLER_TYPE.BOTH) {
    if (buttons.length < 2) {
      buttons.unshift({
        text: '查看专栏',
        url: `/wscvis/course/detail/${column.alias}?kdt_id=${getKdtId() || ''}`,
      });
    }
  }

  return { buttons, skuButtons };
}
