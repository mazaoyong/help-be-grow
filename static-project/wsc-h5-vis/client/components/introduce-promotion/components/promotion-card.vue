<template>
  <div class="promotion-card" @click="onReward">
    <div class="promotion-card__container">
      <img-wrap
        slot="icon"
        src="https://b.yzcdn.cn/public_files/2020/04/07/gift.svg"
        width="47px"
        height="39px"
      />
      <div slot="title" class="promotion-card__title">
        <div class="user-info">
          <img-wrap :src="cardInfo.avatar" width="16px" height="16px" />
          <span>{{ cardInfo.name }}</span>
        </div>
        <div class="reward-tip">
          {{ newStuRewardTip }}
        </div>
      </div>
      <van-button :text="btnText" color="#00b389" round />
    </div>
    <div v-if="showClose" class="promotion-card__close" @click="onPromotionClose">
      <van-icon name="cross" size="14px" />
    </div>
  </div>
</template>
<script>
import { Icon, Button } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';

import * as customSafeLink from '@/common/utils/custom-safe-link';
import { GET_REWARD_STATUS } from '../constants';
const { kdt_id: kdtId } = window._global || {};

export default {
  name: 'promotion-card',

  components: {
    'van-icon': Icon,
    'van-button': Button,
    ImgWrap,
  },

  props: {
    cardInfo: {
      type: Object,
      default() {
        return {};
      },
    },

    alias: {
      type: String,
      default: '',
    },

    from: {
      type: String,
      default: '',
    },
    newStuRewardTip: {
      type: String,
      default: '',
    },
  },

  computed: {
    btnText() {
      const { status } = this.cardInfo;
      return status === GET_REWARD_STATUS.HAS_GOT ? '查看活动' : '立即领取';
    },

    showClose() {
      const { status } = this.cardInfo;
      return status === GET_REWARD_STATUS.HAS_GOT;
    },
  },

  methods: {
    onPromotionClose() {
      this.$emit('close');
    },

    onReward() {
      const { id } = this.cardInfo;
      const query = {
        kdt_id: kdtId,
        alias: this.alias,
        introducerUserId: id,
        from: this.from,
      };

      customSafeLink.redirect({
        url: '/wscvis/ump/introduction/new-student',
        kdtId,
        query,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.promotion-card {
  position: fixed;
  left: 50%;
  bottom: 35px;
  width: calc(100% - 24px);
  background-color: rgba(50, 50, 51, 0.8);
  border-radius: 8px;
  transform: translateX(-50%);

  &__container {
    display: inline-flex;
    width: 100%;
    align-items: center;
    flex-flow: row nowrap;
    padding: 12px;
    box-sizing: border-box;
    background: transparent;
  }

  .van-button {
    padding: 0 12px;
    height: 28px;
    line-height: 28px;
    white-space: nowrap;
  }

  &__title {
    display: flex;
    flex: 1;
    flex-flow: column wrap;
    margin: 0 10px;
    line-height: 20px;
    color: #fff;
    font-size: 12px;
    overflow: hidden;

    .imgWrap {
      margin-right: 5px;
      border-radius: 50%;
    }

    .user-info {
      display: inline-flex;
      align-items: center;
    }

    .reward-tip {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__close {
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 21px;
    line-height: 22px;
    text-align: center;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.19);
    border-bottom-left-radius: 13px;
  }
}
</style>
