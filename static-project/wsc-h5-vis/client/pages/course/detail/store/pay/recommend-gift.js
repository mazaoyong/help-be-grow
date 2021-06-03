import args from '@youzan/utils/url/args';
import log from '@/pages/course/detail/utils/log';
import store from '../index';
import { getEnvH5OrMiniprogramType } from '@/common/utils/log-params';
import { checkCapitalLossForRecommendGift } from '@/common/log/biz-log';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

export default function(params, payload, compositionCB) {
  const { activityData } = store.state;

  params.channelType = activityData.recommendGift.channelType;

  params.umpInfo.recommend = {
    recommendActivityId: activityData.recommendGift.activityId,
    recommendFansId: activityData.fid,
    recommendBuyerId: activityData.bid,
  };

  if (compositionCB) {
    compositionCB({
      activityId: activityData.recommendGift.activityId,
      activityType: ACTIVITY_TYPE.RECOMMEND_GIFT,
      recommendFansId: activityData.fid,
      recommendBuyerId: activityData.bid,
    });
  }

  try {
    logBuy(store);
  } catch (error) {
    console.log('error', error);
  }

  checkCapitalLossForRecommendGift({
    recommendActivityId: activityData.recommendGift.activityId,
    recommendBuyerId: activityData.bid,
    recommendFansId: activityData.fid,
  });
}

function logBuy(store) {
  const { activityData, goodsData } = store.state;
  const recommendGift = activityData.recommendGift || {};
  const fromType = args.get('recommendGiftShareFromType');

  log({
    et: 'custom',
    ei: 'recommend_gift_referee_click_buy',
    en: '被推荐人-点击购买按钮',
    params: {
      alias: goodsData.alias,
      name: recommendGift.activityId,
      referrerType: recommendGift.referrerType,
      refereeType: recommendGift.refereeType,
      from: fromType === 'poster' ? 1 : 2,
      env: getEnvH5OrMiniprogramType(),
    },
  });
}
