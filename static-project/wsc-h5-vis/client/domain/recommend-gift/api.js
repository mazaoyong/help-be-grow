import { ajax } from '@youzan/vis-ui';
import { get } from 'lodash';
import getQrCode from '@/common/utils/qrcode';
import { getShareParamStr, appendLogParamsTo } from 'pct/utils';
import { forcePhoneLogin } from '@/common/utils/login';

/* 获取海报绘制数据 */
const createDrawInfo = async (originData, shareUrl) => {
  const qrUrl = await getQrCode(shareUrl);
  const drawInfo = {
    ...originData,
    shopImg: get(_global, 'mp_data.logo'),
    shopName: get(_global, 'mp_data.shop_name'),
    userName: get(_global, 'visBuyer.finalUsername') || '小伙伴',
    userAvatar: get(_global, 'visBuyer.finalAvatar') || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
    qrUrl,
  };
  return drawInfo;
};

/* 查询活动详情 */
const getGetDetailByGoodsAlias = (data) => {
  return ajax({
    url: '/wscvis/ump/referral-invite/getGetDetailByGoodsAlias.json',
    data,
    loading: false,
  });
};

/* 查询商品详情 */
const getDetail = (data) => {
  return ajax({
    url: '/wscvis/ump/referral-invite/getSimpleProduct.json',
    data,
    loading: false,
  });
};

/* 获取跑马灯信息 */
const getGetRewardCarousel = (data) => {
  return ajax({
    url: '/wscvis/ump/referral-invite/getGetRewardCarousel.json',
    data,
    loading: false,
  });
};

/* 获取我的邀请记录 */
const getInviteRecord = (data) => {
  return ajax({
    url: '/wscvis/ump/referral-invite/getInviteRecord.json',
    data,
    loading: false,
  });
};

/* 获取收益金额 */
const getProfitInfo = (data) => {
  return ajax({
    url: '/wscvis/ump/referral-invite/getEarningsTotal.json',
    data,
    loading: false,
  });
};

/* 获取收益明细 */
const getProfitDetail = (data) => {
  return ajax({
    url: '/wscvis/ump/referral-invite/getEarningsHistory.json',
    data,
    loading: true,
  });
};

/* 获取推荐商品列表 */
const getRecommendGoods = (data) => {
  return ajax({
    url: '/wscvis/ump/referral-invite/getRecommendGoods.json',
    data,
    loading: false,
  });
};

/**
 * 获取商品活动落地页
 *
 * @param {string} goodsAlias 商品alias
 * @param {boolean} supportDistributor 是否支持分销员
 * @param {string} activityId 活动ID
 * @return {string} shareUrl 链接
 */
const getGoodsActivityDetail = (
  // 商品alias
  goodsAlias,
  // 是否支持分销员
  supportDistributor = false,
  // 活动ID
  activityId = '',
  // fromType
  fromType = '',
) => {
  return new Promise((resolve, reject) => {
    forcePhoneLogin((sessionId, userId, doLogin) => {
      if (doLogin) {
        return window.location.reload();
      }

      // 课程商品
      let params = {
        kdt_id: _global.kdt_id,
        bid: _global.buyer_id,
        fid: get(_global, 'visBuyer.fansId'),
        activity_id: activityId,
        recommendGiftShareFromType: fromType,
      };

      if (supportDistributor) {
        const salesmanInfo = get(_global, 'salesmanInfo', {});
        if (salesmanInfo.seller) {
          params = {
            ...params,
            sls: salesmanInfo.seller,
            sl: salesmanInfo.seller,
            from_params: `sl~${salesmanInfo.seller}!online_kdt_id~${_global.kdt_id}`,
          };
        }
      }

      // 叠加分销员参数
      const shareUrl = appendLogParamsTo(
        `${window.location.origin}/wscvis/course/detail/${goodsAlias}?${getShareParamStr(params)}`,
      );

      resolve(shareUrl);
    });
  });
};

export default {
  createDrawInfo,
  getGetDetailByGoodsAlias,
  getDetail,
  getGetRewardCarousel,
  getProfitInfo,
  getProfitDetail,
  getInviteRecord,
  getRecommendGoods,
  getGoodsActivityDetail,
};
