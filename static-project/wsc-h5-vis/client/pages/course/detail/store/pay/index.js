import { isEmpty } from 'lodash';
import { Toast } from 'vant';
import args from '@youzan/utils/url/args';
import { ACTIVITY_TYPE, COMPOSIITON_MAP } from '@/constants/ump/activity-type';
import { GOODS_TYPE, GOODS_TYPE_TO_OWL_TYPE } from '@/constants/course/goods-type';
import { redirect } from '@/common/utils/custom-safe-link';
import accountUnion from '@/common/utils/account-union';
import checkFansBuy from '@/common/utils/checkFansBuy';
import { postBookKey, postCreate, goTradeBuy } from '@/common-api/buy';
import { sendCheckSmsCaptcha } from '@/common/utils/checkSmsCaptcha';
import log from '@/pages/course/detail/utils/log';
import { openCollectInfoPopupHOF } from 'components/info-collect-popup';
import openSkuPopup from '../sku-popup';
import store from '../index';

import gift from './gift';
import recommendGift from './recommend-gift';
import groupBuy from './group-buy';
import seckill from './seckill';
import pointExchange from './point-exchange';
import ladderGroupOn from './ladder-group-on';
import tuition from './tuition';
import coupon from './coupon';

let syncLock = false;

const PAYMAP = {
  [ACTIVITY_TYPE.GIFT]: gift,
  [ACTIVITY_TYPE.RECOMMEND_GIFT]: recommendGift,
  [ACTIVITY_TYPE.GROUP_BUY]: groupBuy,
  [ACTIVITY_TYPE.SEC_KILL]: seckill,
  [ACTIVITY_TYPE.POINTS_EXCHANGE]: pointExchange,
  [ACTIVITY_TYPE.LADDER_GROUPON]: ladderGroupOn,
  [ACTIVITY_TYPE.TUITION]: tuition,
  [ACTIVITY_TYPE.COUPON]: coupon,
};

export default function pay(activityType, payload, logType = 'default') {
  const {
    goodsType,
    goodsData,
    activityData,
    selectedSku,
    skuPopupVisiable,
    env,
    activityTypes,
    onlineCourseCollectSetting,
  } = store.state;
  const { needCollectInfo } = store.getters;

  if (goodsType !== GOODS_TYPE.LIVE && !env.isMobile) {
    Toast('预览不支持进行购买，实际效果请在手机上进行');
    return;
  }

  if (goodsData.sku.hasSku && !skuPopupVisiable) {
    openSkuPopup(activityType, false, payload);
    return;
  }

  if (!syncLock) {
    syncLock = true;
    accountUnion.checkUnion('paidcontent', {
      needLogin: _global.need_ajax_login,
    })
      .then(({ didLogin }) => {
        let buyTip = '';

        if (goodsData.sku.maxPrice) {
          buyTip = '关注公众号才能报名课程';
        } else {
          buyTip = '关注公众号，即可免费领取课程';
        }

        return checkFansBuy({
          didLogin,
          productId: goodsData.goodsId,
          buyTip,
        });
      })
      .then(() => {
        log({
          et: 'custom',
          ei: 'buy',
          en: '购买',
          params: {
            type: logType,
          },
        });
        const params = {
          productInfoList: [{
            alias: goodsData.alias,
            id: goodsData.goodsId,
            // 线下课无 sku 时，以 collectionId 作为 skuId，知识付费时为 undefined
            skuId: selectedSku ? selectedSku.id : goodsData.sku.collectionId,
            num: 1,
            owlType: GOODS_TYPE_TO_OWL_TYPE[goodsType],
          }],
          umpInfo: {},
        };

        if (Object.keys(COMPOSIITON_MAP).includes(`${activityType}`)) {
          // 组装逻辑
          const compositionTypes = COMPOSIITON_MAP[activityType];
          const stackActivityList = [];
          // 回调函数接受活动特征数据
          const compositionCB = (data) => {
            if (!isEmpty(data)) {
              stackActivityList.push(data);
            }
          };
          compositionTypes.forEach(item => {
            if (activityTypes.includes(item)) {
              PAYMAP[item](params, payload, compositionCB);
            }
          });
          params.umpInfo.stackActivityList = stackActivityList;
        } else if (PAYMAP[activityType]) {
          PAYMAP[activityType](params, payload);
        }

        // 免费知识付费商品，在当前页面购买
        if (store.getters.isOnlineCourse && goodsData.sku.minPrice === 0) {
          const receiveCourse = () => {
            return postCreate(params)
              .then((res) => {
                const { orderNo } = res || {};
                // 创建订单的时候需要上报orderCreate事件
                log({
                  et: 'custom',
                  ei: 'orderCreate',
                  en: '创建订单',
                  params: {
                    order_no: orderNo,
                  },
                });
                Toast('领取成功');

                // 商详传参orderFinishRedirect,订单支付成功后跳转该指定url
                const orderFinishRedirect = args.get('orderFinishRedirect');
                if (orderFinishRedirect) {
                  redirect({ url: orderFinishRedirect });
                }

                setTimeout(location.reload.bind(location), 2000);
              })
              .catch(err => {
                syncLock = false;
                Toast(err || '网络错误，请稍后重试');
              });
          };

          // ===================== 信息采集 ======================
          if (needCollectInfo) {
            const {
              alias: bizAlias,
              collectSetting: infoCollectionItems,
              needVerifyCode,
            } = onlineCourseCollectSetting;

            const handleSendCaptcha = (mobile, callBack) => {
              sendCheckSmsCaptcha({
                mobile,
                bizAlias,
                scene: 1,
                callBack,
              });
            };

            openCollectInfoPopupHOF({
              subtitle: '为了更好地服务你，提交报名信息后即可免费领取课程',
              onPopupClose: () => {
                syncLock = false;
              },
            })({
              props: {
                infoCollectionItems,
                needVerifyCode,
              },
              on: {
                sendCaptcha: handleSendCaptcha,
              },
            }).then(data => {
              const { attributeItems } = data;

              // 塞入信息采集
              params.infoCollect = {
                customizeItems: attributeItems,
              };

              return receiveCourse();
            });
          } else {
            return receiveCourse();
          }

          return;
        }

        // @gaotian 可以收敛到bookKey中
        let sourceInfo = {};
        const fromId = args.get('resourceAlias');
        if (fromId) {
          sourceInfo = {
            from_type: 'enrollment_poster',
            from_id: fromId,
          };
        }

        // 商详传参orderFinishRedirect,透传下单页，订单支付成功后跳转该指定url
        const orderFinishRedirect = args.get('orderFinishRedirect');
        if (orderFinishRedirect) {
          sourceInfo.orderFinishRedirect = orderFinishRedirect;
        }

        // @gaotian
        let channelType = void 0;
        if (activityType === ACTIVITY_TYPE.RECOMMEND_GIFT) {
          channelType = activityData.recommendGift.channelType;
        }
        if (activityType === ACTIVITY_TYPE.GIFT) {
          channelType = activityData.channelType;
        }
        return postBookKey(params)
          .then(({ bookKey }) => {
            syncLock = false;
            goTradeBuy({
              book_key: bookKey,
              // @gaotian
              channel_type: channelType,
              ...sourceInfo,
            });
          });
      })
      .catch((err) => {
        syncLock = false;
        console.warn('pay err', err);
      });
  }
}
