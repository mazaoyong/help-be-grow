<template>
  <van-goods-action class="edu-bottom-action">
    <van-goods-action-mini-btn
      v-if="isShowIm"
      :class="isGuang ? '' : 'js-im-icon'"
      icon="chat-o"
      :text="web_im_text"
      @click="onClickMiniBtn(isGuang ? 'shop' : 'chat')"
    />
    <van-goods-action-mini-btn
      v-if="isShowShop"
      icon="shop-o"
      text="店铺"
      @click="onClickMiniBtn('shop')"
    />
    <van-goods-action-big-btn
      v-for="(btn, index) in bigButtonText"
      :key="index"
      :class="btn.className"
      @click="onClickBigBtn(btn.type)"
    >
      <slot v-if="activityType === 'collectZan' && !isGuang">
        <span
          :class="[ 'goods-action__collect-item' ]"
        >
          {{ btn.text }}
        </span>
        <span
          v-if="!purchaseLimit && status === 1"
          :class="[ 'goods-action__collect-item-sm' ]"
        >
          {{ btn.type === '2' ? `${collectNum}个好友助力` : '' }}
        </span>
      </slot>
      <slot v-else-if="isShowReferral">
        <span class="min-price">
          {{ btn.minText }}
        </span>
        <span class="new-price">
          {{ btn.text }}
        </span>
      </slot>
      <slot v-else>
        <span
          v-if="btn.price"
          class="goods-action__promotion-item"
        >
          {{ btn.price | parsePrice }}
        </span>
        <span
          :class="[ 'goods-action__promotion-item', btn.price ? 'label-wrap' : '' ]"
        >
          {{ btn.text }}
        </span>
      </slot>
    </van-goods-action-big-btn>
    <follow-mp v-if="!followed" v-model="followMp" @close="onFollowMpClose" />
    <question
      v-if="activityInfo.useQuestion"
      :id="activityInfo.questionId"
      v-model="question"
      @success="onQuestionSuccess"
      @close="onQuestionClose"
    />
  </van-goods-action>
</template>

<script>
import { GoodsAction, GoodsActionButton, GoodsActionIcon, Toast } from 'vant';
import Args from '@youzan/utils/url/args';
import { getMpFollowStatus } from 'common-api/utils';
import { redirect } from '@/common/utils/custom-safe-link';
import { log } from 'common/mixins/mixin-vis-page/setters/set-log';
// import imIcon from '@youzan/im-icon';
import { formatPrice } from '../../../utils';
import { navigateEnv } from '../../../../../common/utils/env';
import { logConfig } from '../../log';
import * as SafeLink from '@youzan/safe-link';
import { checkAndLogin } from '@/common/utils/login';
import FollowMp from 'components/follow-mp';
import Question from 'components/question';
import API from '../../../api';

import { COLLECT_ZAN_UPGRADING_ONLINE_TIME } from '../../../../edu/constant.js';

const {
  shop_config: shareConfig = {},
  miniprogram: { isMiniProgram },
  url: { h5: globalH5Url },
} = window._global;
const {
  is_web_im_in_goods: isShowIm,
  show_shop_btn: isShowShop,
  web_im_in_goods_config: webImGoodsConfig,
} = shareConfig;

export default {
  name: 'bottom-button',

  config: {
    log: logConfig,
  },

  inject: ['pointsName'],

  components: {
    'van-goods-action': GoodsAction,
    'van-goods-action-mini-btn': GoodsActionIcon,
    'van-goods-action-big-btn': GoodsActionButton,
    [FollowMp.name]: FollowMp,
    [Question.name]: Question,
  },

  filters: {
    parsePrice(value) {
      return `￥${formatPrice(value)}`;
    },
  },

  props: {
    status: {
      type: Number,
      default: 1,
    },
    purchaseLimit: {
      type: Boolean,
      default: false,
    },
    price: {
      type: [Number, String],
      default: 0,
    },
    alias: {
      type: String,
      default: '',
    },
    activityType: {
      type: String,
      default: '',
    },
    activityInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    activityQuota: {
      type: Object,
      default: () => {
        return {};
      },
    },
    productId: {
      type: Number,
      default: 0,
    },
    purchaseButtonText: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isShowIm: Number(isShowIm),
      isShowShop: Number(isShowShop),
      collectNum: 0,
      isShowReferral: false,
      bigButtonText: '',
      isGuang: _global.isGuang, // 判断入口是不是爱逛小程序
      web_im_text: '客服',
      followMp: false,
      question: false,
      followed: false,
    };
  },

  beforeCreate() {
    // 挂载$log钩子
    this.$log = log.bind(this, this.$options.config.log);
  },

  mounted() {
    this.getWebImText();
    this.parseButtonText();
    this.getMpFollowStatus();
  },

  methods: {
    parseButtonText() {
      let bigButtonText = [];
      const { quota, quotaUsed, isAllowContinueBuy } = this.activityQuota;
      switch (this.activityType) {
        case 'groupon':
          const { conditionNum } = this.activityInfo.promotionDetail;
          const { userStatus } = this.activityInfo;
          const groupPrice = this.activityInfo.promotionDetail.minPrice;
          // 如果用户已参团，展示查看我的团,0:未参团，1：已参团，2：团成功
          if (userStatus.status === 1) {
            if (!this.purchaseLimit && this.status === 1) {
              bigButtonText.push({
                text: '原价报名',
                className: 'vice-btn',
                type: '0',
              });
            }
            bigButtonText.push({
              text: '查看我的团',
              className: 'main-btn',
              type: 'group',
            });
          } else {
            if (!this.purchaseLimit && this.status === 1) {
              const groupTmp = [
                {
                  text: '原价报名',
                  price: this.price,
                  className: 'vice-btn',
                  type: '0',
                },
                {
                  text: `${conditionNum}人团`,
                  price: groupPrice,
                  className: 'main-btn',
                  type: '1',
                },
              ];
              bigButtonText = [].concat(groupTmp);
            } else {
              bigButtonText.push({
                text: '查看其他课程',
                className: 'vice-btn',
                type: 'home',
              });
            }
          }
          break;
        case 'ladderGroupOn':
          const { status } = this.activityInfo.userStatus;
          const minPrice = this.activityInfo.promotionDetail.minPrice;
          // 如果用户已参团，展示查看我的团,0:未参团，1：已参团，2：团成功
          if (status === 1) {
            if (!this.purchaseLimit && this.status === 1) {
              bigButtonText.push({
                text: '原价报名',
                className: 'vice-btn',
                type: '0',
              });
            }
            bigButtonText.push({
              text: '查看我的团',
              className: 'main-btn',
              type: 'group',
            });
          } else {
            if (!this.purchaseLimit && this.status === 1) {
              const groupTmp = [
                {
                  text: '原价报名',
                  price: this.price,
                  className: 'vice-btn',
                  type: '0',
                },
                {
                  text: `一键开团`,
                  price: minPrice,
                  className: 'main-btn',
                  type: '1',
                },
              ];
              bigButtonText = [].concat(groupTmp);
            } else {
              bigButtonText.push({
                text: '查看其他课程',
                className: 'vice-btn',
                type: 'home',
              });
            }
          }
          break;
        case 'collectZan':
          if (!this.purchaseLimit && this.status === 1) {
            const {
              prizeChannel,
              processState,
              collectNum,
              currentCollectZanProduct = {},
              updatedAt,
            } = this.activityInfo;
            const skuIds = currentCollectZanProduct.skuIds || null;
            this.collectNum = collectNum;
            let hasStock = false;
            if (skuIds && skuIds.length > 0) { // 有sku
              if (currentCollectZanProduct.skuStocks && currentCollectZanProduct.skuStocks.length > 0) {
                currentCollectZanProduct.skuStocks.forEach((sku) => {
                  if (sku.stock) {
                    hasStock = true;
                  }
                });
              }
            } else if (skuIds) { // 无sku
              hasStock = true;
            }
            // 判断是否显示好友助力按钮
            const shouldShowCollectZanButton = processState === 1 &&
            hasStock &&
            // 爱逛小程序屏蔽好友助力活动
            !this.isGuang &&
            // 好友助力升级项目：小程序环境下展示，老数据的修改时间在上线时间之前也展示
            (isMiniProgram || updatedAt < COLLECT_ZAN_UPGRADING_ONLINE_TIME);
            if (shouldShowCollectZanButton) {
              bigButtonText.push({
                text: prizeChannel === 0 ? '免费听课' : '领取优惠券',
                className: 'vice-btn',
                type: '2',
              });
            }
            bigButtonText.push({
              text: this.purchaseButtonText || shouldShowCollectZanButton ? '原价购买' : '立即购买', // 好友助力
              className: 'main-btn',
              type: '0',
            });
          } else {
            bigButtonText.push({
              text: '查看其他课程',
              className: 'vice-btn',
              type: 'home',
            });
          }
          break;
        case 'recommendPolite':
          const { minNewerPrice } = this.activityInfo.recommendPoliteCourse;
          if (this.activityInfo.isShowReferral) {
            this.isShowReferral = true;
            bigButtonText.push({
              text: `新客专享 ￥${formatPrice(minNewerPrice)}`,
              minText: `原价￥${formatPrice(this.price)}`,
              className: 'main-btn',
              type: '0',
            });
          } else {
            const btnText = {
              text: '查看其他课程',
              type: 'home',
              className: 'vice-btn',
            };
            if (this.status === 1 && !this.purchaseLimit) {
              btnText.text = this.purchaseButtonText || (this.price ? '立即报名' : '免费报名');
              btnText.className = 'main-btn';
              btnText.type = '0';
            }
            bigButtonText.push(btnText);
          }
          break;
        case 'timelimitedDiscount':
          const btnText1 = {
            text: '查看其他课程',
            type: 'home',
            className: 'vice-btn',
          };
          // 商品未达到限购且活动限购不满足时，展示购买
          if (this.status === 1 && (!this.purchaseLimit && (+quota === 0 ||
            (+quota > 0 && +isAllowContinueBuy !== 0) ||
            (+quota > 0 && +isAllowContinueBuy === 0 && +quotaUsed < +quota)))) {
            btnText1.text = this.purchaseButtonText || (this.price ? '立即报名' : '免费报名'); // 限时折扣
            btnText1.className = 'main-btn';
            btnText1.type = '3';
          }
          bigButtonText.push(btnText1);
          break;
        case 'seckill':
          const { beginAt, endAt, isCheckRight, currentStock, isUserBooking, isUserRemind } = this.activityInfo;
          const now = new Date();
          // 未开始
          if (now < new Date(beginAt) && now < new Date(endAt)) {
            // 开启秒杀预约
            if (isCheckRight) {
              // 已预约
              if (isUserBooking) {
                bigButtonText.push({
                  text: '原价报名',
                  className: 'main-btn',
                  type: 'to-origin',
                });
              } else {
                bigButtonText.push({
                  text: '立即预约',
                  className: 'main-btn',
                  type: 'seckill-appointment',
                });
              }
            } else {
              // 已提醒
              if (isUserRemind) {
                bigButtonText.push({
                  text: '原价报名',
                  className: 'main-btn',
                  type: 'to-origin',
                });
              } else {
                bigButtonText.push({
                  text: '设置提醒',
                  className: 'main-btn',
                  type: 'seckill-remind',
                });
              }
            }
          }
          // 已开始
          if (new Date(beginAt) < now && now < new Date(endAt)) {
            if (currentStock) {
              // 开启秒杀预约
              if (isCheckRight) {
                // 已预约
                if (isUserBooking) {
                  if (this.status === 1 && !this.purchaseLimit) {
                    bigButtonText.push({
                      text: '立即抢课',
                      className: 'main-btn',
                      type: '4',
                    });
                  } else {
                    bigButtonText.push({
                      text: '查看其他课程',
                      type: 'home',
                      className: 'vice-btn',
                    });
                  }
                } else {
                  bigButtonText.push({
                    text: '原价报名',
                    className: 'main-btn',
                    type: 'to-origin',
                  });
                }
              } else {
                if (this.status === 1 && !this.purchaseLimit) {
                  bigButtonText.push({
                    text: '立即抢课',
                    className: 'main-btn',
                    type: '4',
                  });
                } else {
                  bigButtonText.push({
                    text: '查看其他课程',
                    type: 'home',
                    className: 'vice-btn',
                  });
                }
              }
            } else {
              bigButtonText.push({
                text: '原价报名',
                className: 'main-btn',
                type: 'to-origin',
              });
            }
          }
          // 已结束
          if (new Date(endAt) < now) {
            bigButtonText.push({
              text: '原价报名',
              className: 'main-btn',
              type: 'to-origin',
            });
          }
          break;
        case 'pointsGoods':
          if (this.status === 1 && !this.purchaseLimit) {
            bigButtonText.push({
              text: `${this.pointsName}兑换`,
              className: this.activityInfo.buyLimit ? 'main-btn' : 'vice-btn',
              type: '5',
            });
            // 不限制原价购买的话，显示立即购买按钮
            if (!this.activityInfo.buyLimit) {
              bigButtonText.push({
                text: this.purchaseButtonText || '立即购买',
                className: 'main-btn',
                type: '0',
              });
            }
          } else {
            bigButtonText.push({
              text: '查看其他课程',
              type: 'home',
              className: 'vice-btn',
            });
          }
          break;
        default:
          const btnText = {
            text: '查看其他课程',
            type: 'home',
            className: 'vice-btn',
          };
          if (this.status === 1 && !this.purchaseLimit) {
            btnText.text = this.purchaseButtonText || (this.price ? '立即报名' : '免费报名'); // 普通 & 会员价
            btnText.className = 'main-btn';
            btnText.type = '0';
          }
          bigButtonText.push(btnText);
          break;
      }
      this.bigButtonText = bigButtonText;
    },
    onClickMiniBtn(type) {
      // (type === 'chat') && imIcon.init('.js-im-icon', { fromSource: 'goods' });
      // 添加埋点
      switch (type) {
        case 'shop':
          this.$log('view_shop_home');
          this.toShop();
          break;
        case 'chat':
          this.$log('contact_service');
          break;
      }
    },

    /**
     * @param type: 购买类型，0为原价购买，1为拼团，2为好友助力，3为限时折扣，4为秒杀，-1为跳转
     */
    onClickBigBtn(type = '') {
      console.log(type);
      switch (type) {
        case 'group':
          this.toGroupDetail();
          break;
        case 'home':
          // 添加埋点 查看其它课程
          this.$log('view_other');
          this.toShop();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          const status = String(this.status) || '';
          status === '1' && !this.purchaseLimit && this.toPay(+type);
          break;
        case 'to-origin':
          let url = location.href;
          url = Args.remove(url, 'ump_type');
          url = Args.remove(url, 'ump_alias');
          url = Args.remove(url, 'activityType');
          SafeLink.redirect({
            url,
            kdtId: window._global.kdt_id,
          });
          break;
        case 'seckill-remind':
          this.seckillRemind();
          break;
        case 'seckill-appointment':
          this.seckillAppointment();
          break;
      }
    },
    toPay(type) {
      // 好友助力活动升级优化，非小程序环境下跳到升级提示中间页
      if (type === 2 && !isMiniProgram) {
        SafeLink.redirect({
          url: `${globalH5Url}/wscvis/knowledge/activity-upgrading?type=edu&alias=${this.alias}`,
          kdtId: window._global.kdt_id,
        });
        return;
      }
      // 点击立即报名
      this.$log('apply');
      this.$emit('toPay', type);
    },
    toShop() {
      navigateEnv();
    },
    toGroupDetail() {
      redirect({
        url: '/wscvis/ump/groupon/groupon-detail',
        query: {
          group_alias: this.activityInfo.userStatus.groupAlias,
          activity_type: this.activityInfo.promotionType,
          alias: this.alias,
        },
      });
    },
    appointment() {
      return new Promise((resolve, reject) => {
        checkAndLogin(() => {
          API.seckillAppointment(this.activityInfo.activityId)
            .then(res => {
              if (res) {
                resolve();
                setTimeout(() => {
                  location.reload();
                }, 3000);
              } else {
                reject();
              }
            })
            .catch(() => {
              reject();
            });
        });
      });
    },
    seckillRemind() {
      if (this.followed) {
        this.appointment()
          .then(() => {
            Toast.success('设置成功');
          })
          .catch(() => {
            Toast.fail('设置失败');
          });
      } else {
        this.followMp = true;
      }
    },
    seckillAppointment() {
      if (this.activityInfo.useFollow) {
        if (this.followed) {
          this.appointment()
            .then(() => {
              Toast.success('预约成功');
            })
            .catch(() => {
              Toast.fail('预约失败');
            });
        } else {
          this.followMp = true;
        }
      }
      if (this.activityInfo.useQuestion) {
        this.question = true;
      }
    },
    getWebImText() {
      if (webImGoodsConfig) {
        const config = JSON.parse(webImGoodsConfig);
        if (config.hasOwnProperty('default')) {
          if (config.default === 1) {
            this.web_im_text = config.label || '客服';
          };
        };
      };
    },
    onFollowMpClose() {
      this.followMp = false;
    },
    onQuestionSuccess() {
      this.appointment()
        .then(() => {
          Toast.success('预约成功');
          this.question = false;
        })
        .catch(() => {
          Toast.fail('预约失败');
        });
    },
    onQuestionClose() {
      this.question = false;
    },
    getMpFollowStatus() {
      getMpFollowStatus()
        .then(res => {
          this.followed = res.isFollow;
        });
    },
  },
};
</script>

<style lang="scss">
.van-goods-action {
  z-index: 1;
  .van-button {
    border: none;
    line-height: initial;
  }

  .goods-action__promotion {
    &-item {
      &.label-wrap {
        display: block;
        line-height: 16px;
        font-size: 14px;
      }
    }
  }

  .goods-action__collect {
    &-item {
      display: block;
      font-size: 16px;
      line-height: 25px;
      &-sm {
        display: block;
        font-size: 12px;
        line-height: 15px;
      }
    }
  }

  .new-price {
    font-size: 16px;
    line-height: 20px;
  }

  .min-price {
    line-height: 16px;
    margin-right: 10px;
    font-size: 12px;
    color: rgba(255, 255, 255, .6);
    text-decoration-line: line-through;
    text-decoration-color: #ffc8c8;
  }
}

.edu-bottom-action {
  box-shadow: 0 -2px 10px 0 rgba(125,126,128,0.16);
}
</style>
