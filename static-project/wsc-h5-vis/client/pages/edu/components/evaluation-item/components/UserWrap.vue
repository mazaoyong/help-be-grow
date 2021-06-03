<template>
  <div class="evaluation-user">
    <div class="evaluation-user-wrap">
      <img
        :src="avatar"
        class="evaluation-user-wrap__avatar"
      >
      <div class="evaluation-user-wrap__info">
        <div class="evaluation-user-wrap__info-name">
          {{ nickName }}
        </div>
        <div class="evaluation-user-wrap__info-star">
          <van-rate
            v-model="score"
            :size="12"
            :count="5"
            :color="themeColor"
            readonly
          />
        </div>
      </div>
    </div>
    <div class="evaluation-user-wrap__desc">
      {{ evaluationAt | formatEvaluationDate }}
    </div>
  </div>
</template>

<script>
import { Rate } from 'vant';
import formatDate from '@youzan/utils/date/formatDate.js';

export default {
  name: 'user-wrap',

  components: {
    'van-rate': Rate,
  },

  filters: {
    formatEvaluationDate: function(src) {
      return formatDate(src, 'YYYY-MM-DD');
    },
  },

  props: {
    avatar: {
      type: String,
      default: 'https://b.yzcdn.cn/public_files/2019/04/02/default@2x.png',
    },

    nickName: {
      type: String,
      default: '',
    },

    score: {
      type: Number,
      default: 1,
    },

    evaluationAt: {
      type: [Number, String],
    },

    themeColor: {
      type: String,
      default: '#f44',
    },
  },
};
</script>

<style lang="scss">
.evaluation-user-wrap {
  display: flex;
  width: 100%;
  height: 28px;
  margin-top: 10px;
  box-sizing: border-box;

  &__avatar {
    width: 24px;
    height: 24px;
    padding-top: 2px;
    border-radius: 12px;
  }

  &__info {
    position: relative;
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    line-height: 18px;
    color: #111;
    font-size: 14px;
    margin-left: 10px;
  }

  &__desc {
    line-height: 16px;
    margin-top: -4px;
    color: #969799;
    font-size: 12px;
    transform: scale(.83);
  }
}
</style>
