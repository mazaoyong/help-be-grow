import args from '@youzan/utils/url/args';

interface ICheckCLForGroupBuy {
  promotionId: string;
}

interface ICheckCLForJoinGroupBuy {
  promotionId: string;
  groupAlias: string;
}

interface ICheckCLForRecommendGift {
  recommendActivityId: string | number;
  recommendFansId: string | number;
  recommendBuyerId: string | number;
}

interface ICheckCLForRecommendGiftShare {
  url: string;
  source: 'detail' | 'lading';
}

interface ICheckCLForInviteShareUrl {
  url: string;
}

// 发起拼团
export const checkCapitalLossForGroupBuy = (data: ICheckCLForGroupBuy) => {
  try {
    const promotionId = data.promotionId;
    if (typeof Number(promotionId) !== 'number' || !Number(promotionId)) {
      window.yzStackLog.log({
        name: 'capital-loss_group-buy-start',
        extra: data,
        message: 'done',
        level: 'warn',
      });
      window.yzStackLog.monitor({
        extra: {
          name: 'capital-loss_group-buy-start',
          code: 0,
        },
      });
    }
  } catch (error) {
  }
};

// 参与拼团
export const checkCapitalLossForJoinGroupBuy = (data: ICheckCLForJoinGroupBuy) => {
  try {
    const { groupAlias, promotionId } = data;

    if (!groupAlias || typeof Number(promotionId) !== 'number' || !Number(promotionId)) {
      window.yzStackLog.log({
        name: 'capital-loss_group-buy-join',
        extra: data,
        message: 'done',
        level: 'warn',
      });
      window.yzStackLog.monitor({
        extra: {
          name: 'capital-loss_group-buy-join',
          code: 0,
        },
      });
    }
  } catch (error) {
  }
};

// 推荐有奖购买
export const checkCapitalLossForRecommendGift = (data: ICheckCLForRecommendGift) => {
  try {
    const { recommendActivityId, recommendBuyerId } = data;
    if (!Number(recommendActivityId) || !Number(recommendBuyerId)) {
      window.yzStackLog.log({
        name: 'capital-loss_recommend-gift',
        extra: data,
        message: 'done',
        level: 'warn',
      });
      window.yzStackLog.monitor({
        extra: {
          name: 'capital-loss_recommend-gift',
          code: 0,
        },
      });
    }
  } catch (error) {
  }
};

// 推荐有奖的分享链接
export const checkCapitalLossForRecommendGiftShareUrl = (data: ICheckCLForRecommendGiftShare) => {
  try {
    const { url, source } = data;
    const bid = args.get('bid', url);

    if (!Number(bid)) {
      const map = {
        detail: 0,
        lading: 1,
      };
      window.yzStackLog.log({
        name: 'capital-loss_recommend-gift-shareurl',
        extra: data,
        message: `${source}`,
        level: 'warn',
      });
      window.yzStackLog.monitor({
        extra: {
          name: 'capital-loss_recommend-gift-shareurl',
          code: map[source],
        },
      });
    }
  } catch (error) {
  }
};

// 分销员的分享 URL 时
export const checkCapitalLossForInviteShareUrl = (data: ICheckCLForInviteShareUrl) => {
  try {
    const { url } = data;
    const sls = args.get('sls', url);
    const sl = args.get('sl', url);
    const inviteTag = sls || sl;
    if (!inviteTag) {
      window.yzStackLog.log({
        name: 'capital-loss_invite-shareurl',
        extra: data,
        message: 'done',
        level: 'warn',
      });
      window.yzStackLog.monitor({
        extra: {
          name: 'capital-loss_invite-shareurl',
          code: 0,
        },
      });
    }
  } catch (error) {
  }
};
