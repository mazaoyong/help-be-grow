<template>
  <div>
    <div class="share-mask__ele-wrap js-ele-mask" @click="closeMask">
      <div class="share-mask__wechat">
        <div class="share-mask__wechat-title">
          免费请好友看
        </div>
        <div class="share-mask__wechat-desc">
          <p class="share-mask__info">
            前{{ everyContentFriendCount }}名好友可以免费领取该内容
          </p>
          <p class="share-mask__info">
            已有<span class="share-mask__wechat-count">
              {{ receivedCount }}
            </span>个好友领取
          </p>
          <div v-if="isShowDistribution" class="share-mask__wechat-distribution">
            <i class="share-mask__wechat-distribution-arrow" />
            <div class="share-mask__wechat-distribution-inner">
              <p>
                <span class="share-mask__wechat-money-icon">
                  &yen;
                </span>好友购买专栏赚
                <span class="share-mask__wechat-count">
                  {{ distributionMoney / 100 | numberToCurrency }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="share-mask__wechat-icon">
          <img src="https://img01.yzcdn.cn/public_files/2017/08/30/0db0c59e46d67472ed92a4ced7c70903.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

  name: 'share-guide',

  props: {
    isDistribution: Number,
    everyContentFriendCount: {
      type: Number,
      default: 10,
    },
    receivedCount: {
      type: Number,
      default: 8,
    },
    distributionMoney: Number,
  },

  computed: {
    isShowDistribution() {
      return this.isDistribution === 1;
    },
  },

  methods: {
    closeMask() {
      this.$emit('invite-friend');
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.share-mask {
  &__ele-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .8);
  }

  &__wechat {
    &-title {
      height: 29px;
      margin: auto;
      margin-top: 140px;
      font-size: 20px;
      line-height: 29px;
      color: #fff;
      text-align: center;
    }

    &-desc {
      margin-top: 4px;
      font-size: 14px;
      line-height: 20px;
      color: #fff;
      text-align: center;
    }

    &-money-icon {
      padding-right: 4px;
      padding-left: 4px;
      margin-right: 4px;
      background-color: red;
      border-radius: 8px;
    }

    &__info {
      margin: 5px;
    }

    &-count {
      color: red;
    }

    &-distribution {
      position: relative;
      display: flex;
      margin-top: 10px;
      font-size: 12px;
      color: #fff;
      justify-content: center;

      &-arrow {
        position: absolute;
        top: -6px;
        left: 50%;
        z-index: 1;
        width: 6px;
        height: 6px;
        background: #979797;
        transform: translate(-50%, 50%) rotate(45deg);
      }

      &-inner {
        position: relative;
        z-index: 2;
        padding: 10px;
        background: #979797;
        border-radius: 2px;
      }
    }
  }
}
</style>
