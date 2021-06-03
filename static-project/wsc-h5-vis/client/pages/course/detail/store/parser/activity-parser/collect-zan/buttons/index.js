import { get } from 'lodash';
import { Toast } from 'vant';
// import { ZNB } from '@youzan/wxsdk';
// import compareVersions from '@youzan/utils/string/compareVersions';
import { redirect } from '@/common/utils/custom-safe-link';
import { checkAndLogin } from '@/common/utils/login';
import { GOODS_TYPE } from '@/constants/course/goods-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import openSkuPopup from '@/pages/course/detail/store/sku-popup';
import pay from '@/pages/course/detail/store/pay';
import log from '@/pages/course/detail/utils/log';
import { isRetailMinimalistPartnerStore, isUnifiedPartnerStore } from '@youzan/utils-shop';
import { redirectToShop } from '../../default/buttons/utils';
import { buildZanSet } from './api';

export default function(activityData, state) {
  const { env, goodsData, goodsType } = state;
  const { isGuang, isMiniProgram, isIOSWeapp } = env;
  const {
    id,
    status,
    prizeChannel,
    collectNum,
    currentCollectZanProduct,
  } = activityData;
  const skuIds = get(currentCollectZanProduct, 'skuIds', []);
  const skuStocks = get(currentCollectZanProduct, 'skuStocks', []);
  let hasStock = false;
  // 有 sku，线下课商品，需要判断库存
  if (skuIds.length && skuStocks.length) {
    skuStocks.forEach((sku) => {
      if (sku.stock) {
        hasStock = true;
      }
    });
  // 无sku，知识付费商品，无需判断库存
  } else {
    hasStock = true;
  }

  function collect() {
    checkAndLogin(() => {
      log({
        et: 'custom',
        ei: 'collect_zan',
        en: '好友助力',
      });
      if (goodsType === GOODS_TYPE.COURSE) {
        buildZanSet(id, goodsData.alias, goodsData.sku.hasSku ? state.selectedSku.id : 0)
          .then(res => {
            if (res) {
              redirect({
                url: '/wscvis/ump/collect-zan',
                query: {
                  zanAlias: res,
                  alias: goodsData.alias,
                },
              });
            } else {
              return Promise.reject();
            }
          })
          .catch(() => {
            Toast('生成好友助力失败，请重试');
          });
      } else {
        const TYPE_MAP = {
          [GOODS_TYPE.CONTENT]: 'content',
          [GOODS_TYPE.COLUMN]: 'column',
        };
        const type = TYPE_MAP[goodsType];
        if (!isMiniProgram) {
          redirect({
            url: '/wscvis/knowledge/activity-upgrading',
            query: {
              type,
              alias: goodsData.alias,
            },
          });
          return;
        }
        buildZanSet(id, goodsData.alias)
          .then(res => {
            // 订阅消息二期迁回原生并且原生代码有改动需要判断小程序版本号（>2.48.0）
            // if (isWeapp && weappVersion && compareVersions(weappVersion, '2.48.0') > 0) {
            //   const weappUrl = `/packages/paidcontent/support/index?alias=${goodsData.alias}&zanAlias=${res}&type=${type}`;
            //   ZNB.navigate({
            //     weappUrl,
            //   });
            // } else {
            redirect({
              url: '/wscvis/ump/collect-zan',
              query: {
                alias: goodsData.alias,
                zanAlias: res,
                type,
              },
            });
            // }
          })
          .catch(() => {
            Toast('生成好友助力失败，请重试');
          });
      }
    });
  }

  const collectButton = {
    text: [prizeChannel ? '领取优惠券' : '免费听课', `${collectNum}个好友助力`],
    action: () => {
      if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
        redirectToShop(_global.kdtId);
      } else if (goodsData.sku.hasSku) {
        openSkuPopup(ACTIVITY_TYPE.COLLECT_ZAN);
      } else {
        collect();
      }
    },
  };

  const skuButtons = [{
    text: '邀请好友助力',
    action: () => {
      if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
        redirectToShop(_global.kdtId);
      } else {
        collect();
      }
    },
  }];

  if (status === ACTIVITY_STATUS.GOING && hasStock && !isGuang) {
    if (isIOSWeapp && goodsType !== GOODS_TYPE.COURSE) {
      return {
        buttons: [collectButton],
        skuButtons,
      };
    }

    if (isMiniProgram) {
      return {
        buttons: [{
          text: '直接报名',
          action: () => {
            if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
              redirectToShop(_global.kdtId);
            } else {
              pay(ACTIVITY_TYPE.NO_ACTIVITY, null, 'collect-zan-origin');
            }
          },
        }, collectButton],
        skuButtons,
      };
    }
  }
}
