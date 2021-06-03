<template>
  <div class="rank-item">
    <img
      v-if="indexImg"
      :src="indexImg"
      class="index"
    >
    <div v-else class="index">
      {{ index + 1 }}
    </div>
    <img :src="avatar" class="avatar">
    <p class="name">
      {{ userName }}
    </p>
    <p class="time">
      {{ createdAt }}
    </p>
  </div>
</template>

<script>
import formatDate from '@youzan/utils/date/formatDate';

const indexImg = [
  'https://b.yzcdn.cn/wsc-h5-vis/course/detail/rank-first.png',
  'https://b.yzcdn.cn/wsc-h5-vis/course/detail/rank-second.png',
  'https://b.yzcdn.cn/wsc-h5-vis/course/detail/rank-third.png',
];

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  computed: {
    indexImg() {
      return indexImg[this.index];
    },

    avatar() {
      return this.data.userHeadPortrait || 'https://b.yzcdn.cn/wsc-h5-vis/course/detail/defaultAvatar.png';
    },

    userName() {
      return this.data.userName || '匿名用户';
    },

    createdAt() {
      return formatDate(this.data.createdAt, 'MM-DD HH:mm:ss');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.rank-item {
  @include clearfix;

  padding: 8px 16px 8px 94px;

  .index {
    float: left;
    margin: 8px 0 0 -78px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    color: $disabled-color;
  }

  .avatar {
    float: left;
    margin-left: -48px;
    width: 36px;
    height: 36px;
    border-radius: 18px;
  }

  .name {
    @include ellipsis;

    font-size: 14px;
    color: $main-text-color;
  }

  .time {
    margin-top: 10px;
    font-size: 12px;
    color: $disabled-color;
  }
}
</style>
