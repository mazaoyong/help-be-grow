<template>
  <div class="icons">
    <van-goods-action-icon
      v-for="(icon, index) in icons"
      :key="index"
      v-log="icon.log"
      :class="icon.class"
      :icon="icon.icon"
      :text="icon.text"
      @click="icon.click"
    />
  </div>
</template>

<script>
import { GoodsActionIcon } from 'vant';
import imIcon from '@youzan/im-icon';
import storeName from '../../name';

export default {
  storeName,

  components: {
    'van-goods-action-icon': GoodsActionIcon,
  },

  getters: ['icons'],
  rootState: ['kdtId', 'goodsData'],

  mounted() {
    // hotfix: 临时加的，im 里面依赖了 _global.alias，_global 原来没有 alias
    // 请勿依赖 global 的 alias！
    _global.alias = this.goodsData.alias;
    imIcon.init('.js-im-icon', {
      fromSource: {
        kdt_id: this.kdtId,
        source: 'goods',
        endpoint: 'h5',
        detail: {
          name: this.goodsData.title,
          alias: this.goodsData.alias,
          price: this.goodsData.sku.minPrice / 100,
          imgs: [
            this.goodsData.pictures[0].url,
          ],
        },
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.icons {
  display: flex;
  flex-shrink: 0;
}
</style>
