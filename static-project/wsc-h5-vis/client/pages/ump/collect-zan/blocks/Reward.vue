<template>
  <div class="block-reward">
    <template v-if="isCourseReward">
      <p class="block-reward__title">
        0 元免费得
      </p>
      <div class="block-reward__goods-card" @click="$store.dispatch('toCourse')">
        <img-wrap
          width="88px"
          height="50px"
          :fullfill="`!small.jpg`"
          :src="courseCover"
          :cover="false"
        />
        <div class="block-reward__goods-info">
          <div class="block-reward__goods-title">
            {{ courseName }}
          </div>
          <div class="block-reward__goods-price">
            价格：{{ coursePrice }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="block-reward__title block-reward__title--coupon" v-html="couponText"></p>
      <p class="block-reward__subtitle">
        {{ courseName }}可用
      </p>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'block-reward',

  components: {
    ImgWrap,
  },

  computed: {
    ...mapGetters([
      'isCourseReward',
      'courseName',
      'courseCover',
      'coursePrice',
      'couponText',
    ]),
  },
};
</script>

<style lang="scss">
@import 'mixins';

.block-reward {
  overflow: hidden;

  &__title {
    margin-top: 32px;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    color: #fa1919;
    text-align: center;

    &--coupon {
      display: flex;
      margin-top: 56px;
      align-items: center;
      justify-content: center;

      span {
        margin: 0 2px;
        font-size: 24px;
        font-weight: 500;
        line-height: 30px;
      }
    }
  }

  &__subtitle {
    max-width: 240px;
    margin: 4px auto;
    font-size: 14px;
    line-height: 18px;
    color: #fa1919;
    text-align: center;
    word-break: break-all;
  }

  &__goods-card {
    display: flex;
    width: 239px;
    padding: 8px;
    margin: 12px auto 0;
    background: #fff6f6;
    border: 0 solid #fec9c9;
    border-radius: 4px;
    box-sizing: border-box;

    .imgWrap {
      flex: 0 0 auto;
    }
  }

  &__goods-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 8px;
  }

  &__goods-title {
    font-size: 12px;
    line-height: 16px;
    color: #323233;

    @include multi-ellipsis(2);
  }

  &__goods-price {
    font-size: 12px;
    line-height: 16px;
    color: #969799;
  }
}
</style>
