<template>
  <div class="wrap">
    <img :src="avatar" class="avatar-img">
    <div class="user-info">
      <span>
        <span class="user-name">
          {{ userName }}
        </span>
        <span class="time">
          {{ createdAt }}
        </span>
      </span>
      <span class="receive-count">
        1份
      </span>
      <p class="desc">
        谢谢啦
      </p>
    </div>
  </div>
</template>

<script>
import { DEFAULT_USER_INFO } from 'pct/constants';
import formatDate from '@youzan/utils/date/formatDate';

export default {

  name: 'receive-item',

  props: {
    item: {
      type: Object,
    },
  },

  data() {
    return {

    };
  },

  computed: {
    createdAt() {
      const createdAtTime = this.item.createdAt;
      return formatDate(createdAtTime, 'MM-DD HH:mm:ss');
    },
    avatar() {
      return this.item.userHeadPortrait || DEFAULT_USER_INFO.avatar;
    },
    userName() {
      return this.item.userName || DEFAULT_USER_INFO.name;
    },
  },
};
</script>

<style lang="scss" scoped>

  .wrap {
    display: flex;
    margin: 5px 12px 22px;
  }

  .avatar-img {
    height: 44px;
    border-radius: 22px;
    margin-right: 10px;
  }

  .user-info {
    width: 100%;
    padding: 5px;
  }

  .user-name {
    font-size: 14px;
    font-weight: 500;
  }

  .time {
    color: #999;
    font-size: 12px;
  }

  .receive-count {
    font-size: 18px;
    float: right;
    color: red;
  }

  .desc {
    margin-top: 10px;
    font-size: 14px;
  }

</style>
