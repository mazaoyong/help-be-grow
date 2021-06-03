import { get } from 'lodash';
import { PREVIEW_WIDTH } from 'constants/preview-width';
import { GOODS_TYPE } from '@/constants/course/goods-type';
import { MEDIA_TYPE } from '@/constants/course/media-type';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';
import { COURSE_TYPE } from '@/constants/course/course-type';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import {
  VALID_PERIOD_TYPE,
  VALID_PERIOD_UNIT_DESC,
} from '@/constants/course/validity-period';
import { COURSE_EFFECTIVE_TYPE } from '@/constants/course/course-effective-type';
import { SERVICE_PLEDGE } from '@/constants/course/service-pledge';
import formatMoney from '@/pages/course/detail/utils/formatMoney';
import format from '@youzan/utils/money/format';
import { ShowCollectInfoEnum } from '@/constants/course/collect-info-type';
import { ASSIST_TXT_TYPE } from '@/constants/course/assist-txt-type';

const getters = {
  pageWidth(state) {
    return state.env.isMobile ? window.innerWidth : PREVIEW_WIDTH;
  },

  isOfflineCourse(state) {
    return state.goodsType === GOODS_TYPE.COURSE;
  },

  isOnlineCourse(state, getters) {
    return getters.isColumn || getters.isContent || getters.isLive;
  },

  isColumn(state) {
    return (
      state.goodsType === GOODS_TYPE.COLUMN ||
      state.goodsType === GOODS_TYPE.FX_COLUMN
    );
  },

  isContent(state) {
    return (
      state.goodsType === GOODS_TYPE.CONTENT ||
      state.goodsType === GOODS_TYPE.FX_CONTENT
    );
  },

  isLive(state) {
    return state.goodsType === GOODS_TYPE.LIVE;
  },

  isImageText(state, getters) {
    return (
      getters.isContent && state.goodsData.mediaType === MEDIA_TYPE.IMAGE_TEXT
    );
  },

  isAudio(state, getters) {
    return getters.isContent && state.goodsData.mediaType === MEDIA_TYPE.AUDIO;
  },

  isVideo(state, getters) {
    return getters.isContent && state.goodsData.mediaType === MEDIA_TYPE.VIDEO;
  },

  columnAlias(state, getters) {
    if (getters.isColumn) {
      return state.goodsData.alias;
    }
    if (getters.isContent || getters.isLive) {
      return state.goodsData.column.alias;
    }
    return '';
  },

  // 是否是免费商品
  isFree(state, getters) {
    if (getters.isContent || getters.isLive) {
      switch (state.goodsData.sellerType) {
        case SELLER_TYPE.SINGLE:
          return state.goodsData.sku.maxPrice === 0;
        case SELLER_TYPE.COLUMN:
          return state.goodsData.column.price === 0;
        case SELLER_TYPE.BOTH:
          return (
            state.goodsData.sku.maxPrice === 0 ||
            state.goodsData.column.price === 0
          );
      }
    }
    return !state.goodsData.sku.maxPrice;
  },

  // 用于 sku-block 和 sku-popup
  timeStr(state) {
    function formatTime(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      const month =
        date.getMonth() >= 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
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
    const courseEffectiveDelayDays = get(
      goodsData,
      'courseEffectiveDelayDays',
      0,
    );
    const courseStartAt = get(goodsData, 'courseStartAt', 0);
    const courseEndAt = get(goodsData, 'courseEndAt', 0);

    const courseEffectiveType2String = {
      [COURSE_EFFECTIVE_TYPE.AFTER_SIGN](num) {
        return '首次上课签到后生效';
      },
      [COURSE_EFFECTIVE_TYPE.AFTER_BUY_PERIOD](num) {
        return `付款${num}天后生效`;
      },
      [COURSE_EFFECTIVE_TYPE.AFTER_BUY](num) {
        return '付款后生效';
      },
    };

    const validPeriodType2String = {
      [VALID_PERIOD_TYPE.FOREVER](num, unit) {
        return '';
      },
      [VALID_PERIOD_TYPE.VALID_AFTER_COURSE](num, unit) {
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
      validPeriodType2String[validityPeriodType](
        validityPeriodRange,
        validityPeriodUnit,
      );

    if (
      courseType === COURSE_TYPE.CASUAL ||
      courseSellType === COURSE_SELL_TYPE.DIY
    ) {
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
    } else if (
      validityPeriodType === VALID_PERIOD_TYPE.FOREVER &&
      courseSellType !== COURSE_SELL_TYPE.DURATION
    ) {
      return '';
    } else if (courseSellType === COURSE_SELL_TYPE.COUNT) {
      return `${validStartDesc},${validPeriodDesc}`;
    } else if (courseSellType === COURSE_SELL_TYPE.DURATION) {
      return validStartDesc;
    } else if (courseSellType === COURSE_SELL_TYPE.SESSION) {
      return '';
    }
  },
  choose(state) {
    const goodsData = get(state, 'goodsData', {});
    const addressList = get(goodsData, 'addressList', []);
    const shopDetailInfo = get(goodsData, 'shopDetailInfo', {});
    const sku = get(goodsData, 'sku', {});
    const selectedSku = state.selectedSku;

    let show = false; // 是否展示选择区域
    let title = ''; // 选择区域左侧标题
    let content = ''; // 选择区域右侧内容
    let action = ''; // 选择区域点击操作
    let skuContent = ''; // sku弹窗中地址区域左侧标题
    let skuRightContent = ''; // sku弹窗中地址区域右侧内容
    let skuAction = ''; // sku弹窗中地址区域点击操作

    if (sku.hasSku && sku.stockNum) {
      // 有可售sku
      show = true;
      title = '选择';
      content = '课程';
      action = 'showSkuPop';
      if (addressList.length) {
        // 有上课地点
        content = '课程及查看上课地点';
        skuContent = '查看上课地点';
        skuRightContent = `共${addressList.length}个`;
        skuAction = 'toAddressList';
      }
      if (shopDetailInfo.longitude) {
        // 有上课校区
        content = '课程及查看上课校区';
        skuContent = '查看上课校区';
        skuRightContent = get(state, 'shopMetaInfo.shopName', '');
        skuAction = 'toMap';
      }
    } else {
      // 无可售sku
      if (addressList.length) {
        // 有上课地点
        show = true;
        title = '查看';
        content = '上课地点';
        action = 'toAddressList';
      }
      if (shopDetailInfo.longitude) {
        // 有上课校区
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
        content = skuInfo.map((item) => item.v).join(', ');
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
    const servicePledge = get(
      state,
      'goodsData.servicePledge',
      SERVICE_PLEDGE.UNSEEN,
    );
    const servicePledge2Icon = {
      [SERVICE_PLEDGE.UNSEEN]: '',
      [SERVICE_PLEDGE.FREE_APPOINTMENT]: 'no-confirm',
      [SERVICE_PLEDGE.CHECK_AGAIN]: 'need-confirm',
    };
    const servicePledge2String = {
      [SERVICE_PLEDGE.UNSEEN]: '',
      [SERVICE_PLEDGE.FREE_APPOINTMENT]:
        '该课程购买成功后，不需预约到店即可体验',
      [SERVICE_PLEDGE.CHECK_AGAIN]: '该课程购买成功后，需要等待商家确认',
    };
    return {
      show: servicePledge !== SERVICE_PLEDGE.UNSEEN,
      icon: servicePledge2Icon[servicePledge],
      message: servicePledge2String[servicePledge],
    };
  },

  // 是否展示营销活动条，用于 ump-block 和 base-info-block
  showUmpBlock(state) {
    return (
      state.activityData.hasUmpBlock &&
      state.activityData.status !== ACTIVITY_STATUS.END
    );
  },

  // 买赠描述信息，用于 promotion-block 和 sku-popup
  meetReduceDescription(state, getters) {
    const { goodsData, activityData } = state;
    const data = get(activityData, 'meetReduce', {});
    const presentInfoList = get(data, 'presentInfoList', []);
    // 目前仅支持多sku送相同的赠品，故如此处理；后续支持多sku送不同赠品时，需要修改
    const presentGoodsList = get(presentInfoList, '[0].presentGoodsList', []);
    const desc = [];
    if (presentGoodsList.length) {
      if (goodsData.sku.hasSku) {
        if (goodsData.sku.list.length === presentInfoList.length) {
          desc.push('购课送课程大礼包');
        } else {
          desc.push(
            `购${presentInfoList
              .map((item) => item.skuDesc)
              .join(',')}送课程大礼包`,
          );
        }
      } else {
        desc.push('购课送课程大礼包');
      }
    }
    if (data.score) {
      desc.push(getters.meetReduceScoreDesc);
    }
    if (data.couponId) {
      desc.push(getters.meetReduceCouponDesc);
    }
    return desc.join(',');
  },

  meetReduceScoreDesc(state) {
    const { activityData, shopConfig } = state;
    const data = get(activityData, 'meetReduce', {});
    return `${data.score}${shopConfig.pointsName}`;
  },

  meetReduceCouponDesc(state) {
    const { activityData } = state;
    const data = get(activityData, 'meetReduce', {});
    const {
      couponId,
      couponValueRandomFrom = 0,
      couponValueRandomTo = 0,
      couponTitle = '',
    } = data;
    if (!couponId) {
      return '';
    }
    const promotionValue = data.couponValue ? format(data.couponValue) : 0;
    const promotionDiscount = (data.couponDiscount / 10).toFixed(1);
    const couponNumStr = data.couponNum ? `${data.couponNum}张` : '';
    let couponStr = '';
    if (promotionValue) {
      couponStr += `${promotionValue}元`;
    } else {
      couponStr += `${promotionDiscount}折`;
    }

    if (couponValueRandomTo || couponValueRandomFrom) {
      const [from, to] = [couponValueRandomFrom, couponValueRandomTo].map((d) =>
        formatMoney(d),
      );
      couponStr = `${from}-${to}元`;
    }

    return couponNumStr + couponStr + couponTitle;
  },

  maxTuition(state) {
    const { activityData } = state;
    const data = get(activityData, 'tuition', {});
    return get(data, 'maxPhaseAmount', 0);
  },

  showTuitionPopover(state) {
    const {
      goodsData,
      activityData,
      manualCloseTuitionPopover,
      priorActivityType,
    } = state;
    const { status, isOwnAsset } = goodsData;
    /** 已拥有的资产，不显示攒学费弹窗 */
    if (isOwnAsset) {
      return false;
    }
    /** 不是优先级最高的活动类型 */
    if (priorActivityType !== ACTIVITY_TYPE.TUITION) {
      return false;
    }
    const data = get(activityData, 'tuition', {});
    const { hasUserInstance, status: tuitionStatus } = data;
    if (
      status === GOODS_STATUS.SELLING &&
      tuitionStatus === 1 &&
      !hasUserInstance &&
      !manualCloseTuitionPopover
    ) {
      return true;
    }
    return false;
  },
  /**
   * 展示推荐有奖活动入口
   * 判断依据：
   *  1、商家是否设置了推荐有奖活动
   *  2、用户是否通过了门槛
   * */
  supportRecommendGift(state, getters) {
    const { activityTypes, activityData } = state;
    const { recommendGift } = activityData;
    // 商家设置推荐有奖活动
    if (activityTypes.includes(ACTIVITY_TYPE.RECOMMEND_GIFT)) {
      // 用户是否通过门槛
      // http://zanapi.qima-inc.com/site/service/view/269456
      return get(recommendGift, 'meetReferer', false);
    }
    return false;
  },

  /** 判断是否需要信息采集 */
  needCollectInfo(state, getters) {
    const { isFree } = getters;
    const { goodsData } = state;
    const { showCollectInfo, isOwnAsset } = goodsData;

    const needShow = showCollectInfo === ShowCollectInfoEnum.SHOW;

    if (needShow) {
      // 已购买时需要采集
      if (isOwnAsset) {
        return needShow;
      }

      // 0元商品统一领取前采集
      if (isFree) {
        return needShow;
      }

      // 普通商品走下单采集
      return false;
    }

    return needShow;
  },

  /** 需要信息采集时不可看「完整图文」和「图文详情」 */
  realIntro(state, getters) {
    const { goodsData } = state;
    const {
      isContent,
      isImageText,
      isAudio,
      isVideo,
      needCollectInfo,
    } = getters;

    const {
      isOwnAsset,
      needOrder,
      intro,
      previewIntro,
      assistTxtType,
    } = goodsData;

    // 针对0元课程，需要先领取以生成订单
    if (isContent && needOrder) {
      return previewIntro;
    }

    if (isOwnAsset && isContent && needCollectInfo) {
      // 已购买图文需要信息采集时拦截完整图文
      if (isImageText) {
        return '';
      }

      // 已购买音视频需要信息采集且购买后仅显示图文详情时拦截图文详情
      if (assistTxtType === ASSIST_TXT_TYPE.PREVIEW && (isAudio || isVideo)) {
        return previewIntro;
      }
    }

    return intro;
  },
};

export default getters;
