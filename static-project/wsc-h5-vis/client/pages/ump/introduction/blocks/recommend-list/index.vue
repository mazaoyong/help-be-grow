<template>
  <div class="block-recommend" v-if="showRecommend && !isGuang && recommendGoods.length">
    <recommand-box
      :recommend-goods="recommendGoods"
    />
  </div>
</template>

<script>
import { getGoodsRecommendInfo } from '../../apis';
import RecommandBox from './recommend-box';

export default {
  name: 'block-recommend',

  components: {
    RecommandBox,
  },

  props: {
    showRecommend: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isGuang: _global.isGuang, // 判断入口是不是爱逛小程序
      recommendGoods: [],
    };
  },

  created() {
    if (this.showRecommend) {
      this.getGoodsRecommendInfo();
    }
  },

  methods: {
    getGoodsRecommendInfo() {
      getGoodsRecommendInfo({
        scene: 1,
      })
        .then(data => {
          if (data.goodsList) {
            this.recommendGoods = data.goodsList;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.block-recommend {
  padding-top: 12px;
}
</style>
