<template>
  <!-- ⬇ 落地页主区块 ⬇ -->
  <section :class="{ 'with-mailbox': !goods.isVisible }" class="tution-main">
    <!-- ⬇ 标题 ⬇ -->
    <!-- 读取固定配置，保证安全 -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <header :style="{marginTop: titleHasMargin ? '40px' : '0'}" v-html="title" />
    <!-- ⬆ 标题 ⬆ -->
    <!-- ⬇ 学费数字 ⬇ -->
    <section v-if="amount.isVisible" class="amount">
      <span class="yuan">¥</span>
      <span class="number">{{ amount.amount }}</span>
    </section>
    <!-- ⬆ 学费数字 ⬆ -->
    <section v-if="goods.isVisible" @click="onClickGoods(goods.data.goodsAlias)" class="goods">
      <section class="cover">
        <img-wrap
          :fullfill="`!small.jpg`"
          :src="goods.data.goodsUrl"
          :cover="false"
          width="120px"
          height="68px"
        />
      </section>
      <section class="info">
        <h3 class="title">
          {{ goods.data.goodsName }}
        </h3>
        <vis-price-label :current-price="goods.data.goodsPrice" />
      </section>
    </section>
    <!-- ⬆ 兑换的商品 ⬆ -->
    <!-- ⬇ 主按钮 ⬇ -->
    <van-button
      :color="styles.mainButtonColor"
      :class="['main-button', { 'show-breath' : mainButton.hasMotion}]"
      @click="onClickMainButton"
      v-track:click.createOrShareTuition
      round
    >
      {{ mainButton.text }}
    </van-button>
    <!-- ⬆ 主按钮 ⬆ -->
    <!-- ⬇ 底部（倒计时或链接） ⬇ -->
    <footer>
      <van-count-down
        v-if="countdown.isVisible"
        :format="`${countdownFormat} ${countdown.suffix}`"
        :time="countdown.time"
        @finish="onCountdownFinish"
        class="countdown"
        millisecond
      />
      <a
        v-if="bottomButton.isVisible"
        @click="onClickBottomButton"
        class="bottom-link"
      >
        {{ bottomButton.text }}
      </a>
    </footer>
    <!-- ⬆ 底部（倒计时或链接） ⬆ -->
    <!-- ⬇ 绝对定位的兑换按钮 ⬇ -->
    <div
      v-if="isRedeemButtonVisible"
      @click="onClickRedeemButton"
      class="redeem-button"
    >
      <span>兑换</span>
      <van-icon name="arrow" />
    </div>
    <!-- ⬆ 绝对定位的兑换按钮 ⬆ -->
  </section>
</template>

<script>
import Vue from 'vue';
import {
  Icon as VanIcon,
  Button as VanButton,
  CountDown as VanCountDown,
} from 'vant';
import { mapGetters } from 'vuex';

import styles from '../styles.scss';
import { ImgWrap, PriceLabel as VisPriceLabel } from '@youzan/vis-ui';

import { navigateToCourseDetailPage } from '../utils';

import { ONE_DAY } from '../constants';

export default Vue.extend({
  name: 'block-main',
  components: {
    VanIcon,
    ImgWrap,
    VanButton,
    VanCountDown,
    VisPriceLabel,
  },
  data: () => {
    return {
      styles,
    };
  },
  computed: {

    /**
     * 使用 Store 中定义的一些 getters
     * @see file://./../store/getters.ts
     */
    ...mapGetters({
      /** 标题 */
      title: 'blockMainTitle',
      /** 已兑换的商品信息 */
      goods: 'blockMainGoods',
      /** 学费的金额配置 */
      amount: 'blockMainAmount',
      /** 倒计时配置（是否显示、倒数时间等） */
      countdown: 'blockMainCountdown',
      /** 主按钮的配置（文案、触发的 action 等） */
      mainButton: 'blockMainMainButton',
      /** 底部按钮的配置（文案、触发的 action 等） */
      bottomButton: 'blockMainBottomButton',
      /** 视觉问题，标题是否需要 margin */
      titleHasMargin: 'blockMainTitleHasMargin',
      /** 是否显示兑换按钮 */
      isRedeemButtonVisible: 'blockMainIsRedeemButtonVisible',
    }),

    countdownFormat() {
      if (this.countdown.time <= ONE_DAY) {
        return 'HH:mm:ss:S';
      }
      return 'DD 天 HH:mm:ss:S';
    },
  },
  methods: {
    /**
     * 倒计时结束后的回调
     *
     * @description 给后端 3 s 时间
     */
    onCountdownFinish() {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
    /**
     * 点击兑换按钮的回调（打开可兑换课程的弹窗）
     *
     * @description 将 store 中的 setCoursesPopupVisible 设为 true
     * @todo 是否需要将该操作作为一个 action
     */
    onClickRedeemButton() {
      this.$store.commit('setCoursesPopupVisible', true);
    },
    /**
     * 点击主按钮的回调
     *
     * @description 触发 store 中的 action，action 由配置决定
     */
    onClickMainButton() {
      this.$store.dispatch(this.mainButton.action);
    },

    onClickGoods(goodsAlias) {
      navigateToCourseDetailPage(goodsAlias);
    },

    /**
     * 点击底部按钮的回调
     *
     * @description 触发 store 中的 action，action 由配置决定
     */
    onClickBottomButton() {
      this.$store.dispatch(this.bottomButton.action);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "mixins/index.scss";

.tution-main {
  border-radius: 8px;
  background: #fff5e9;
  margin: -90px auto 0;
  background-color: #fff5e9;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  box-sizing: border-box;
  height: 264px;
  &.with-mailbox {
    height: 194px;
    background-image: url(https://b.yzcdn.cn/public_files/fe2a06c2bb3464590e5c931d245c22f7.png);
    padding-bottom: 8px;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.08);
  }
  .redeem-button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 24px;
    right: 0px;
    height: 24px;
    padding-left: 8px;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    background-color: #ffe29f;
    color: #986308;
    line-height: 24px;
    font-size: 14px;
  }
  header {
    text-align: center;
    color: #754802;
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    ::v-deep .amount {
      color: #ff6400;
    }
  }

  .amount {
    color: #ff4a00;
    .yuan {
      font-size: 26px;
      font-weight: 500;
    }
    .number {
      font-size: 44px;
      font-weight: 600;
    }
  }

  /* 已兑换的商品 */
  .goods {
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    width: 275px;
    box-sizing: border-box;
    padding: 8px;
    .cover {
      border-radius: 2px;
      overflow: hidden;
      flex: none;
    }
    .info {
      margin-left: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: 12px;
        color: #323233;
        line-height: 16px;
        @include multi-ellipsis(2);
      }
    }
  }

  .main-button {
    width: 240px;
    .van-button__text {
      font-size: 18px;
      font-weight: 600;
    }
    &.show-breath {
      @keyframes breath {
        50% {
          transform: scale(.95);
        }

        100% {
          transform: scale(1);
        }
      }
      animation: breath .8s ease infinite;
    }
  }

  footer {
    .countdown {
      font-size: 14px;
      font-weight: 500;
      color: #754802;
      font-variant-numeric: tabular-nums;
    }
    .bottom-link {
      font-size: 14px;
      color: #754802;
      line-height: 20px;
    }
  }
}
</style>
