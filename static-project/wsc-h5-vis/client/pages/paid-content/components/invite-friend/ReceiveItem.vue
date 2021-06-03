<template>
  <div class="wrap">
    <img
      v-if="isShowIndexImg"
      :src="getIndexImg(index)"
      class="index-img">
    <div v-else class="index-text">
      <p>{{ index + 1 }}</p>
    </div>
    <img :src="avatar" class="avatar-img">
    <div class="user-info">
      <span>
        <span>{{ userName }}</span>
      </span>
      <p class="desc">
        {{ createdAt }}
      </p>
    </div>
  </div>
</template>

<script>
import { DEFAULT_USER_INFO } from 'pct/constants';
import formatDate from '@youzan/utils/date/formatDate';

const RANK_INDEX_IMG = [
  `${window._global.url.cdn}/public_files/2018/05/11/a04b049ca9f39cea43d412d3feea5899.png`,
  `${window._global.url.cdn}/public_files/2018/05/11/16b7c7d9f341b93e812a11e8f7aabc11.png`,
  `${window._global.url.cdn}/public_files/2018/05/11/ad22b8ab7f970305a3f43c22cb7b2da8.png`,
];

export default {

  name: 'receive-item',

  props: {
    item: {
      type: Object,
    },
    index: Number,
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
    isShowIndexImg() {
      return this.index < 3;
    },
    avatar() {
      return this.item.userHeadPortrait || DEFAULT_USER_INFO.avatar;
    },
    userName() {
      return this.item.userName || DEFAULT_USER_INFO.name;
    },
  },

  methods: {
    getIndexImg(index) {
      return RANK_INDEX_IMG[index];
    },
  },
};
</script>

<style lang="scss" scoped>

  .wrap {
    display: flex;
    align-items: center;
    margin: 3px 12px;
  }

  .avatar-img {
    height: 36px;
    border-radius: 22px;
    margin-right: 10px;
  }

  .user-info {
    width: 100%;
    padding: 5px;

    span {
      font-size: 14px;
    }
  }

  .desc {
    margin-top: 10px;
    color: #999;
    font-size: 12px;
  }

  .index-img {
    height: 21px;
    margin: 12px 10px 10px 5px;
  }

  .index-text {
    width: 21px;
    height: 21px;
    margin: 12px 13px 10px 10px;
    color: #999;
  }

</style>
