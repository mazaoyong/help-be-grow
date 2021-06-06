/**
 * 收益页面相关接口
 */

export = [
  [
    'GET',
    '/wscvis/ump/referral-invite',
    'ump.ReferralInviteController',
    'getIndexHtml',
  ],
  [
    'GET',
    '/wscvis/ump/referral-invite/getGetRewardCarousel.json',
    'ump.ReferralInviteController',
    'getGetRewardCarouselJson',
  ],
  [
    'GET',
    '/wscvis/ump/referral-invite/getGetDetailByGoodsAlias.json',
    'ump.ReferralInviteController',
    'getGetDetailByGoodsAliasJson',
  ],
  [
    'GET',
    '/wscvis/ump/referral-invite/getRecommendGoods.json',
    'ump.ReferralInviteController',
    'getGetRecommendGoodsJson',
  ],
  [
    'POST',
    '/wscvis/ump/referral-invite/getPoster.json',
    'ump.PosterController',
    'getRecommendGiftPoster',
  ],
  [
    'POST',
    '/wscvis/ump/referral-invite/getPosterShareImg.json',
    'ump.PosterController',
    'getRecommendGiftShareImg',
  ],
  [
    'GET',
    '/wscvis/ump/referral-invite/getSimpleProduct.json',
    'ump.ReferralInviteController',
    'getGetSimpleProductJson',
  ],
  [
    'GET',
    '/wscvis/ump/referral-invite/getEarningsTotal.json',
    'ump.ReferralInviteController',
    'getEarningsTotalJson',
  ],
  [
    'GET',
    '/wscvis/ump/referral-invite/getEarningsHistory.json',
    'ump.ReferralInviteController',
    'getEarningsHistoryJson',
  ],
  [
    'GET',
    '/wscvis/ump/referral-invite/getInviteRecord.json',
    'ump.ReferralInviteController',
    'getInviteRecordJson',
  ],
  [
    'GET',
    '/wscvis/ump/referral-invite/*',
    'ump.ReferralInviteController',
    'getIndexHtml',
  ],
];