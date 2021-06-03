import { Toast, Dialog } from 'vant';
import cookie from 'zan-utils/browser/cookie';
import apis from 'pct/api';
import { getShareParamStr } from 'pct/utils';
import { COLLECT_INFO_KEYS } from 'pct/constants';
import accountUnion from 'common/utils/account-union';
import checkFansBuy from '@/common/utils/checkFansBuy';
import { get } from 'common/utils/helper';
import { formatOrderParams } from 'pco/utils';
import * as BuyApi from '@/common-api/buy';
import * as SafeLink from '@/common/utils/custom-safe-link';
import Args from '@youzan/utils/url/args';
import { checkAndLogin } from '@/common/utils/login';

export default {
  name: 'mixin-buy',

  computed: {
    // 是否需要信息采集
    needCollectInfo() {
      const { collectInfoSetting } = this.$page.detailRawData;
      if (!collectInfoSetting) return null;
      const infoDefine = {};
      Object.keys(collectInfoSetting).forEach(key => {
        if (COLLECT_INFO_KEYS.indexOf(key) >= 0 && collectInfoSetting[key]) {
          infoDefine[key] = 1;
        }
      });
      return Object.keys(infoDefine).length > 0;
    },
  },

  methods: {
    /**
     * 手动检查信息采集设置
     *
     * @param {string} checkAlias 检查alias
     * @return {Promise} 检查结果
     */
    collectInfoCheck(checkAlias) {
      // 检查逻辑
      const check = (collectInfoSetting) => {
        return (get(collectInfoSetting, 'customizeItems', []).length > 0);
      };

      const { collectInfoSetting = {}, alias: currentAlias } = this.$page.detailRawData;
      const columnAlias = this.$page.columnAlias || '';
      return new Promise((resolve, reject) => {
        if (!checkAlias) resolve(false);
        if (currentAlias !== checkAlias && checkAlias === columnAlias) {
          // fix 信息采集逻辑漏洞：如果专栏设置免费领取，且专栏附属的内容仅支持随专栏售卖，
          // 那么如果从专栏进入内容，并且在内容页面进行领取动作，会绕过信息采集设置，导致直接领取
          apis.getColumn({
            alias: checkAlias,
          })
            .then(data => {
              const { collectInfoSetting: columnSetting } = data;
              resolve(check(columnSetting));
            })
            .catch(() => {
              // 获取专栏失败，强制走到下单页处理
              resolve(true);
            });
        } else {
          resolve(check(collectInfoSetting));
        }
      });
    },

    fetchGenerateOrder(orderData, cb) {
      if (this.isOrderCreating) return;
      this.isOrderCreating = true;
      const { $page } = this;

      // 增加log收集0元单情况
      try {
        const { collectInfoSetting } = this.$page.detailRawData;
        apis.postSkynetJson({
          log: {
            key: 'zero order log',
            collectInfoSetting,
            ...orderData,
          },
        });
      } catch (err) {}

      const params = formatOrderParams(orderData);
      // 旧代码直接取了当前herf，小程序环境下过长导致交易有warning
      // 且0元单在详情页下单不依赖交易跳转
      // 所以去掉callbackUrl这个参数
      params.callbackUrl = undefined;
      return apis.postSubscribe(params)
        .then(res => {
          // 修改当前订阅状态
          $page.isPaid = true;
          Toast('领取成功');
          cb && cb();
        })
        .catch(errMsg => {
          this.showCashierResult(errMsg);
        })
        .finally(_ => {
          this.isOrderCreating = false;
        });
    },

    startOrderAbstract(price, orderData, payUrl, { goodsId, pointsPrice, alias: safeAlias }, cb) {
      const { $page } = this;
      const { alias } = orderData;
      let needCollectInfo = false;

      // 先手动检查是否需要信息采集
      this.collectInfoCheck(alias)
        .then(checkRet => {
          needCollectInfo = checkRet;
          // 知识付费购买时先判断 acl 的场景值 是否需要手机号登录/微信授权
          return accountUnion.checkUnion('paidcontent', {});
        })
        // 查询店铺是否设置了购物门槛
        .then(({ didLogin }) => checkFansBuy({ didLogin, productId: $page.productId }))
        .then(({ didLogin }) => {
          // 0元且不需要信息采集，当前页购买
          if (price === 0 && !needCollectInfo) {
            if (window._global.need_ajax_login && !didLogin) {
              setTimeout(() => {
                checkAndLogin(() => {
                  this.fetchGenerateOrder(orderData, cb);
                });
              }, 500);
            } else {
              this.fetchGenerateOrder(orderData, cb);
            }
          } else {
            // @TODO gaotian
            // 下单页白名单
            Promise.resolve().then(() => {
              const owlType = {
                'column': 1,
                'content': 2,
                'live': 4,
              }[orderData.type];

              const product = {
                alias: safeAlias,
                num: 1,
                owlType,
                id: goodsId,
              };

              const channelType = orderData.channel_type;

              const params = {
                productInfoList: [product],
                channelType,
              };

              const umpInfo = {};
              umpInfo.promotionType = orderData.promotion_type || undefined;
              umpInfo.promotionId = orderData.promotion_id || undefined;
              umpInfo.groupAlias = orderData.group_alias || undefined;
              umpInfo.ladderNum = orderData.ladder_num || undefined;
              if (pointsPrice) {
                umpInfo.pointsExchange = {
                  pointsPrice,
                  usePoints: true,
                };
              }

              // 秒杀
              if (Args.get('activityType') === 'seckill') {
                umpInfo.promotionAlias = Args.get('ump_alias') || Args.get('ump_alias_bak');
              }

              if ($page.showRefferal) {
                const recommend = {};
                recommend.recommendActivityId = orderData.recommend_activity_id;
                recommend.recommendBuyerId = orderData.recommend_buyer_id;
                recommend.recommendFansId = orderData.recommend_fans_id;
                umpInfo.recommend = recommend;
              }
              params.umpInfo = umpInfo;

              return BuyApi.postBookKey(params).then(({ bookKey }) => {
                SafeLink.redirect({
                  url: 'https://cashier.youzan.com/pay/wscvis_buy',
                  query: {
                    book_key: bookKey,
                    channel_type: channelType,
                  },
                });
              });
            });
          }
        });
    },

    /*
      * @param type 表示购买类型
      * 0-> 原价购买
      * 1-> 活动价购买
      * 3-> 限时折扣价购买
      * 4-> 秒杀购买
      * 5-> 积分购买
      */
    startOrder(type, goodsType, goodsData, cb, payload, groupAlias) {
      const { $page } = this;
      // 必要参数
      const alias = $page.$params.alias;
      const dcPs = cookie('dc_ps');
      const qr = cookie('qr');
      let promotionType = '';
      if (type === 1) {
        promotionType = $page.promotionData.promotionType;
      }
      if (type === 4) {
        promotionType = 6;
      }
      let promotionId = '';
      if (type === 1) {
        promotionId = $page.promotionData.promotionId;
      }
      if (type === 3) {
        promotionId = $page.timelimitedDiscountData.activityId;
      }
      if (type === 4) {
        promotionId = $page.mixinActivity.seckillInfo.activityId;
      }
      if (type === 5) {
        promotionType = 5;
        promotionId = $page.pointsInfo.id;
      }

      // 生成订单数据
      const orderData = {
        'kdt_id': window._global.kdt_id,
        type: goodsType,
        alias: alias,
        'dc_ps': dcPs,
        qr,
        url: window.location.href,
        'group_alias': groupAlias || '',
        'ladder_num': (type === 1 && !groupAlias) ? payload : null,
        'promotion_type': promotionType,
        'promotion_id': promotionId,
        recommend_buyer_id: $page.$params.bid,
        recommend_fans_id: $page.$params.fid,
        recommend_activity_id: $page.showRefferal ? $page.referralInfo.activityId : 0,
        channel_type: $page.showRefferal ? $page.referralInfo.channelType : 0,
        outer_user_id: get(window._global, 'visBuyer.platform.platform_user_id', ''),
      };

      // 非0元购跳转页面
      const queryStr = getShareParamStr({
        alias,
        kdt_id: window._global.kdt_id,
        type: goodsType,
        group_alias: groupAlias,
        promotion_type: promotionType,
        promotion_id: promotionId,
        points_price: type === 5 ? 1 : '',
        bid: $page.$params.bid,
        aid: $page.showRefferal ? $page.referralInfo.activityId : 0,
        fid: $page.$params.fid,
        channel_type: $page.showRefferal ? $page.referralInfo.channelType : 0,
      });

      const pointsPrice = get($page, 'pointsInfo.pointsPrice', 0);
      const isColumn = goodsType === 'column';
      this.startOrderAbstract(
        goodsData.price,
        orderData,
        `https://cashier.youzan.com/pay/wscvis_ptc_pay?${queryStr}`,
        {
          pointsPrice,
          goodsId: isColumn ? $page.columnData.goodsId : $page.contentData.goodsId,
          alias: isColumn ? $page.columnData.alias : $page.contentData.alias },
        cb
      );
    },

    startColumnOrder(type, cb = () => {}) {
      const { $page } = this;
      const alias = $page.contentData.columnAlias;
      const groupAlias = type === 1 ? $page.promotionData.promotionDetail.userGroupAlias : '';
      let promotionType = type === 1 ? $page.promotionData.promotionType : '';
      let promotionId = type === 1 ? $page.promotionData.promotionId : type === 3 ? $page.timelimitedDiscountData.activityId : '';
      const dcPs = cookie('dc_ps');
      const qr = cookie('qr');

      // 积分活动
      if (type === 5) {
        promotionType = 5;
        promotionId = $page.pointsInfo.id;
      }

      const orderData = {
        'kdt_id': window._global.kdt_id,
        type: 'column',
        alias,
        'dc_ps': dcPs,
        qr,
        url: window.location.href,
        'group_alias': groupAlias,
        'promotion_type': promotionType,
        'promotion_id': promotionId,
      };

      const queryStr = getShareParamStr({
        alias,
        kdt_id: window._global.kdt_id,
        type: 'column',
        group_alias: groupAlias,
        promotion_type: promotionType,
        promotion_id: promotionId,
        points_price: type === 5 ? 1 : '',
      });

      const pointsPrice = get($page, 'pointsInfo.pointsPrice', 0);
      // 新下单需要goodsId，暂时异步获取goodsId，后续在新详情加上
      apis.getGoodsId({ alias })
        .then(goodsId => {
          this.startOrderAbstract(
            $page.contentData.columnDetail.price,
            orderData,
            `https://cashier.youzan.com/pay/wscvis_ptc_pay?${queryStr}`,
            {
              pointsPrice,
              goodsId,
              alias,
            },
            cb,
          );
        }).catch(() => Toast('获取专栏id失败'));
    },

    startLiveOrder(cb, type) {
      const { activityStarted, timelimitedDiscountData, activityType, seckillInfo } = this.mixinActivity;
      const { $page } = this;
      const { alias = '' } = $page.$params;
      const dcPs = cookie('dc_ps');
      const qr = cookie('qr');
      let promotionId = activityStarted ? timelimitedDiscountData.activityId : '';
      let promotionType = '';
      if (activityType === 'seckill') {
        promotionId = seckillInfo.activityId;
        promotionType = 6;
      }

      // 积分活动
      if (type === 'points') {
        promotionType = 5;
        promotionId = $page.pointsInfo.id;
      }

      const orderData = {
        'kdt_id': window._global.kdt_id,
        type: 'live',
        alias: alias,
        'dc_ps': dcPs,
        qr,
        url: window.location.href,
      };
      promotionId && (orderData.promotion_id = promotionId);
      promotionType && (orderData.promotion_type = promotionType);

      let queryStr = getShareParamStr({
        alias,
        kdt_id: window._global.kdt_id,
        type: 'live',
        points_price: type === 'points' ? 1 : 0,
      });
      promotionId && (queryStr += `&promotion_id=${promotionId}`);
      promotionType && (queryStr += `&promotion_type=${promotionType}`);

      const pointsPrice = get($page, 'pointsInfo.pointsPrice', 0);
      this.startOrderAbstract(
        $page.liveDetail.price,
        orderData,
        `https://cashier.youzan.com/pay/wscvis_ptc_pay?${queryStr}`,
        {
          pointsPrice,
          goodsId: $page.liveDetail.goodsId,
          alias: $page.liveAlias,
        },
        cb
      );
    },

    showCashierResult(msg) {
      Dialog.alert({
        message: `<div class="paid-content__dialog--no-title">${msg}</div>`,
        confirmButtonText: '确定',
      });
    },
  },
};
