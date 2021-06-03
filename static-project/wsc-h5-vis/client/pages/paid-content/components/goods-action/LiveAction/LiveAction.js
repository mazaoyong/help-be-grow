import { LIVE_ACTION_TYPE } from 'pct/constants';
import LiveMixin from './LiveMixin';
import UALib from 'zan-utils/browser/ua';

export default {
  props: {
    liveType: Number,
  },

  mixins: [LiveMixin],

  computed: {
    state() {
      if (this.showSeckill) {
        return -1;
      }
      const { type = '' } = this.activityQuota;
      if (this.inStock) {
        // 允许在微信浏览器和精选中访问
        // 保利威直播可以在pc端访问
        if (!UALib.isMobile() && (this.liveType !== 4 && this.liveType !== 5)) {
          return LIVE_ACTION_TYPE.NOT_AllOWED;
        };

        if (this.isPaid || this.isFree) {
          return this.paidState;
        } else {
          if (this.activityStarted) {
            if (type === 'timelimitedDiscount') {
              return 9;
            }
          } else if (this.allowSingleBuy) {
            return this.unPaidState;
          } else {
            return LIVE_ACTION_TYPE.UNPAID_COLUMN;
          }
        }
      } else {
        return LIVE_ACTION_TYPE.NOSTOCK;
      }
    },

    mainText() {
      if (this.showSeckill) {
        const { beginAt, endAt, isCheckRight, currentStock, isUserBooking, isUserRemind } = this.seckillInfo;
        const now = new Date();
        // 未开始
        if (now < new Date(beginAt) && now < new Date(endAt)) {
          // 开启秒杀预约
          if (isCheckRight) {
            // 已预约
            if (isUserBooking) {
              return '原价购买';
            } else {
              return '立即预约';
            }
          } else {
            // 已提醒
            if (isUserRemind) {
              return '原价购买';
            } else {
              return '设置提醒';
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
                return '立即抢课';
              } else {
                return '原价购买';
              }
            } else {
              return '立即抢课';
            }
          } else {
            return '原价购买';
          }
        }
        // 已结束
        if (new Date(endAt) < now) {
          return '原价购买';
        }
      }
      // ！是否是时尚芭莎店铺，过期可删除 ！
      // https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=47630
      const isShopBaSha = +_global.kdt_id === 44691741;
      return [
        '已下架',
        '进入直播间',
        isShopBaSha ? '购买观众票' : '购买直播',
        '查看专栏',
        '开启直播提醒',
        '回看直播内容',
        '回看直播',
        '请在微信中访问',
        '免费领取',
        '立即抢课',
      ][this.state];
    },
    mainActionType() {
      if (this.showSeckill) {
        const { beginAt, endAt, isCheckRight, currentStock, isUserBooking, isUserRemind } = this.seckillInfo;
        const now = new Date();
        // 未开始
        if (now < new Date(beginAt) && now < new Date(endAt)) {
          // 开启秒杀预约
          if (isCheckRight) {
            // 已预约
            if (isUserBooking) {
              return 'to-origin';
            } else {
              return 'appointment';
            }
          } else {
            // 已提醒
            if (isUserRemind) {
              return 'to-origin';
            } else {
              return 'remind';
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
                return 'buy';
              } else {
                return 'to-origin';
              }
            } else {
              return 'buy';
            }
          } else {
            return 'to-origin';
          }
        }
        // 已结束
        if (new Date(endAt) < now) {
          return 'to-origin';
        }
      }
      return [
        '',
        'enter',
        'buy',
        'enter-column',
        'notify',
        'enter',
        'buy',
        '',
        'buy',
        'buy',
      ][this.state];
    },
    showColumnBtn() {
      if (this.isPaid || this.isFree) return false;

      if (typeof this.showColumn === 'boolean') {
        return this.showColumn;
      } else {
        return this.allowSingleBuy && !!this.columnUrl;
      }
    },
  },
};
