<template>
  <section class="block-header">
    <!-- ⬇ 订单待支付提示条（fixed 定位） ⬇ -->
    <van-notice-bar
      v-if="isFrozenTipVisible"
      class="frozen-tip"
      left-icon="info"
      mode="closeable"
      wrapable
      background="#E8EFFA"
      color="#1794FF"
    >
      <p class="content">
        你有使用学费兑换的待支付订单，请前往支付或取消。
        <a class="link" @click="onClickTip">立即前往</a>
      </p>
    </van-notice-bar>
    <!-- ⬆ 订单待支付提示条 ⬆ -->
    <header>
      <div>
        <broad-caster v-if="isDanmuVisible" :contents="danmuList" />
      </div>
      <rules />
    </header>
    <section class="big-title" />
    <h2>
      <span class="subtitle">
        最高可攒 <span class="max-amount">{{ maxAmount }}</span> 元<span />
      </span>
    </h2>
  </section>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { NoticeBar as VanNoticeBar } from 'vant';

import BroadCaster from '../components/BroadCaster.vue';
import Rules from '../components/Rules.vue';

import { getListLatestRollingTextJson } from '../api';
import { DEFAULT_AVATAR } from '../constants';

export default Vue.extend({
  name: 'block-header',
  components: {
    Rules,
    BroadCaster,
    VanNoticeBar,
  },
  data: function() {
    return {
      danmuList: [],
    };
  },
  computed: {
    ...mapGetters([
      'maxAmount',
      'isFrozenTipVisible',
      'blockHeaderIsBroadCasterVisible',
    ]),

    isDanmuVisible() {
      return this.danmuList.length > 0;
    },

    alias() {
      return this.$route.params.alias;
    },
  },
  mounted() {
    if (!this.blockHeaderIsBroadCasterVisible) {
      return;
    }
    getListLatestRollingTextJson(this.alias).then((data) => {
      const formattedData = data.map((item) => ({
        avatar: item.avatar || DEFAULT_AVATAR,
        text: item.rollingText,
      }));
      if (formattedData.length === 1) {
        formattedData.push(formattedData[0]);
      }
      this.danmuList.push(...formattedData);
    });
  },
  methods: {
    onClickTip() {
      this.$store.dispatch('toFrozenOrder');
    },
  },
});
</script>

<style lang="scss" scoped>
.block-header {
  /* z-index: -1; */
  margin: 0 -16px;
  position: relative;

  height: 236px;
  padding: 8px 12px;
  background-image: url(https://b.yzcdn.cn/public_files/3ba453b67dd2235f10b1198305945e2c.png);
  background-position: bottom center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  .frozen-tip {
    z-index: 1234;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    .content {
      font-size: 14px;
      color: #39393a;
      line-height: 20px;
      .link {
        color: #0babff;
      }
    }
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  section.big-title {
    background: url(https://b.yzcdn.cn/public_files/6d2b758e482a49a0f3adfb16344a1cf7.png);
    background-size: cover;
    margin: 12px auto 0;
    width: 269px;
    height: 56px;
  }
  h2 {
    text-align: center;
    font-size: 16px;
    color: #ffffff;
    margin: 5px auto 0;

    .max-amount {
      color: #fff765;
    }

    .subtitle {
      display: inline-block;
      position: relative;

      &::before,
      &:after {
        content: "";
        border-radius: 12px;
        width: 38px;
        height: 2px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
      }
      &:before {
        background-image: linear-gradient(
          90deg,
          rgba(44,187,121, 0) 47%,
          #ffffff 100%
        );
        left: -46px;
      }

      &:after {
        background-image: linear-gradient(
          270deg,
          rgba(44,187,121, 0) 47%,
          #ffffff 100%
        );
        right: -46px;
      }
    }
  }
}
</style>
