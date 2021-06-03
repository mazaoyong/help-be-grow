<template>
  <div class="cell-container">
    <van-cell
      :title="campusName"
      :value="cellText"
      :is-link="campusTotal > 1"
      icon="shop-o"
      class="cell-switch"
      @click="onToCampusList"
    />
  </div>
</template>

<script>
import { get } from 'lodash';
import { Cell } from 'vant';

const rootKdtId = get(window._global, 'shopInfo.rootKdtId');

export default {
  name: 'switch-bar',
  components: {
    'van-cell': Cell,
  },
  props: {
    campusName: {
      type: String,
      default: '有赞教育店铺校区',
    },
    campusTotal: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    cellText() {
      return this.campusTotal > 1 ? '切换校区' : '';
    },
  },
  methods: {
    onToCampusList() {
      if (this.campusTotal > 1) {
        window.location.href = `/v4/vis/h5/edu/mult-shop-list?kdtId=${rootKdtId}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cell-container {
  margin-bottom: 10px;

  .cell-switch {
    padding: 8px 15px;
    // .van-cell__right-icon {
    //   visibility: hidden;
    // }
  }
}
</style>
