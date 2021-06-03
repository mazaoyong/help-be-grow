<template>
  <div class="list-wrap">
    <div class="header">
      <div>
        <div class="header-title">
          <span class="line" />
          <p>已领取</p>
          <span class="line" />
        </div>
        <div class="header-desc">
          仅限{{ everyContentFriendCount }}个免费名额，先到先得
        </div>
      </div>
    </div>
    <div class="list-content">
      <receive-item
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import ReceiveItem from './ReceiveItem';

export default {

  name: 'rank-list',

  components: {
    ReceiveItem,
  },

  props: {
    list: Array,
    everyContentFriendCount: Number,
  },

  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>

  .list-wrap {
    width: 81%;
  }

  .list-content {
    margin-top: 20px;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 42px;
    margin-top: 40px;
    color: #999;

    .header-title {
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        font-size: 14px;
        margin: 10px;
      }

      .line {
        background: linear-gradient(0deg, #ccc, #ccc);
        height: 1px;
        width: 111px;
      }
    }

    .header-desc {
      font-size: 12px;
    }
  }
</style>
