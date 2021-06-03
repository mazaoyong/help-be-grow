<template>
  <div>
    <div class="wrap">
      <h1 class="title">
        付费送好友
      </h1>
      <van-icon name="cross" @click="onCloseClick" />
      <div class="content-info">
        <img-wrap
          class="img"
          width="100"
          height="56"
          :src="payContentInfo.cover || ''"
          :fullfill="'!200x0q75.png'"
          disable-lazyload
          :cover="false"
        />
        <div class="content-info-left">
          {{ payContentInfo.title }}
        </div>
      </div>
      <div class="pay-count">
        <p>购买数量：</p>
        <van-stepper
          v-model="count"
        />
      </div>
      <div v-if="!payContentInfo.isActivityStarted" class="sum">
        <p>总金额：</p>
        <span v-theme.main="'color'" class="money">
          {{ sum /100 | numberToCurrency }}
        </span>
      </div>
    </div>

    <vant-goods-action class="main-btn-wrap">
      <vant-goods-action-button
        class="main-btn"
        text="下一步"
        @click="payOrder"
      />
    </vant-goods-action>
  </div>
</template>

<script>
import { Stepper, Toast, GoodsAction, GoodsActionButton, Icon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import { getContentInfoText } from 'pct/utils';

export default {

  name: 'pay-for-friend-pop-inner',

  components: {
    ImgWrap,
    'van-stepper': Stepper,
    'vant-goods-action': GoodsAction,
    'vant-goods-action-button': GoodsActionButton,
    'van-icon': Icon,
  },

  props: {
    payContentInfo: Object,
    author: String,
    mediaType: Number,
    audioDuration: Number,
    videoDuration: Number,
  },

  data() {
    return {
      count: 1,
    };
  },

  computed: {
    sum() {
      return this.count * this.payContentInfo.price;
    },
    contentInfoText() {
      const { payContentInfo, mediaType, videoDuration, author } = this;
      return getContentInfoText({
        isColumn: payContentInfo.isColumn,
        contentsCount: payContentInfo.contentsCount,
        mediaType,
        videoDuration,
        author,
      });
    },
  },

  methods: {
    payOrder() {
      const { activityQuota = {} } = this.payContentInfo;
      if (+activityQuota.quota > 0 &&
        +activityQuota.isAllowContinueBuy === 0 &&
        this.count > (+activityQuota.quota - (+activityQuota.quotaUsed))) {
        Toast(`该课程活动期间每人限购${+activityQuota.quota}件，你之前已经购买了${+activityQuota.quotaUsed}件`);
        return;
      }
      this.$emit('buy-contents', this.count);
    },
    onCloseClick() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

  .wrap {
    height: 215px;
    padding: 10px;
  }

  .van-icon-cross {
    position: absolute;
    color: #969799;
    font-size: 22px;
    top: 11px;
    right: 16px;
  }

  .title {
    padding: 1px 0 11px;
    font-size: 16px;
    color: #323233;
    text-align: center;
    line-height: 22px;
  }

  .content-title {
    line-height: 15px;

    @include multi-ellipsis(1);
  }

  .img {
    width: 100px;
    height: 56px;
    margin-right: 10px;
    border-radius: 2px;
    flex: 0 0 auto;
  }

  .content-info {
    display: flex;
    padding: 12px 6px;
  }

  .content-info-left {
    color: #323233;
    font-size: 14px;
  }

  .pay-count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 6px;
    font-size: 14px;
    position: relative;

    &::before {
      @include border-retina(top, #ebedf0);
    }

    &::after {
      @include border-retina(bottom, #ebedf0);
    }
  }

  .sum {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 6px 55px;
    font-size: 14px;
  }

  .next-step {
    background-color: red;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .money {
    color: red;
  }

  .main-btn {
    margin: 5px 16px;
  }

  // 这个地方之前写了scoped，写在外面覆盖不了
  .is-iphonex .main-btn-wrap {
    padding-bottom: 34px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
