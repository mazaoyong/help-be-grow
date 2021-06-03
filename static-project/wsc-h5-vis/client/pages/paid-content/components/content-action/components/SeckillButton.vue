<template>
  <div class="refferal-button buy-btn">
    <van-goods-action-big-btn
      class="main-btn"
      primary
      @click.native="button.click"
    >
      {{ button.text }}
    </van-goods-action-big-btn>
    <follow-mp v-if="!followed" v-model="followMp" @close="onFollowMpClose" />
    <question
      v-if="data.useQuestion"
      :id="data.questionId"
      v-model="question"
      @success="onQuestionSuccess"
      @close="onQuestionClose"
    />
  </div>
</template>

<script>
import { GoodsActionButton, Toast } from 'vant';
import FollowMp from 'components/follow-mp';
import Question from 'components/question';
import * as SafeLink from '@youzan/safe-link';
import { checkAndLogin } from '@/common/utils/login';
import Args from '@youzan/utils/url/args';
import { getMpFollowStatus } from 'common-api/utils';
import API from '../../../api';

export default {
  name: 'seckill-button',

  components: {
    'van-goods-action-big-btn': GoodsActionButton,
    [FollowMp.name]: FollowMp,
    [Question.name]: Question,
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      followMp: false,
      question: false,
      followed: false,
    };
  },

  computed: {
    button() {
      const buy = {
        text: '立即抢课',
        click: this.buy,
      };
      const originPrice = {
        text: '原价购买',
        click: this.toOrigin,
      };
      const appointment = {
        text: '立即预约',
        click: this.appointment,
      };
      const remind = {
        text: '设置提醒',
        click: this.remind,
      };
      const { beginAt, endAt, isCheckRight, currentStock, isUserBooking, isUserRemind } = this.data;
      const now = new Date();
      // 未开始
      if (now < new Date(beginAt) && now < new Date(endAt)) {
        // 开启秒杀预约
        if (isCheckRight) {
          // 已预约
          if (isUserBooking) {
            return originPrice;
          } else {
            return appointment;
          }
        } else {
          // 已提醒
          if (isUserRemind) {
            return originPrice;
          } else {
            return remind;
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
              return buy;
            } else {
              return originPrice;
            }
          } else {
            return buy;
          }
        } else {
          return originPrice;
        }
      }
      // 已结束
      if (new Date(endAt) < now) {
        return originPrice;
      }
      return '';
    },
  },

  mounted() {
    this.getMpFollowStatus();
  },

  methods: {
    buy(event) {
      this.$emit('onClickToBuy', 4, event);
    },
    toOrigin() {
      let url = location.href;
      url = Args.remove(url, 'ump_type');
      url = Args.remove(url, 'ump_alias');
      url = Args.remove(url, 'activityType');
      SafeLink.redirect({
        url,
        kdtId: window._global.kdt_id,
      });
    },
    request() {
      return new Promise((resolve, reject) => {
        checkAndLogin(() => {
          API.seckillAppointment(this.data.activityId)
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
    appointment() {
      if (this.data.useFollow) {
        if (this.followed) {
          this.request()
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
      if (this.data.useQuestion) {
        this.question = true;
      }
    },
    remind() {
      if (this.followed) {
        this.request()
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
    onFollowMpClose() {
      this.followMp = false;
    },
    onQuestionSuccess() {
      this.request()
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
.refferal-button {
  .goods-action__promotion {
    padding-top: 0;
  }

  &__new {
    display: block;
    height: 18px;
    line-height: 1;
    margin-bottom: 5px;
    font-size: 16px;
  }

  &__origin {
    display: block;
    height: 16px;
    line-height: 1;
    font-size: 12px;
    color: rgba(255, 255, 255, .7);
    text-decoration: line-through;
  }

  .refferal-line {
    .refferal-button__origin {
      display: initial;
    }

    .refferal-button__new {
      display: initial;
      margin-right: 10px;
    }
  }
}
</style>
