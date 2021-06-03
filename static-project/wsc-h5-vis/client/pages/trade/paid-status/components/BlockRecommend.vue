<template>
  <div class="block-recommend">
    <recommand-box
      v-if="showRecommend && !isGuang"
      :recommend-goods="recommendGoods"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getRecommendGoods } from '../api';
import RecommandBox from './RecommendBox';

export default {
  name: 'block-recommend',

  components: {
    RecommandBox,
  },

  data() {
    return {
      isGuang: _global.isGuang, // 判断入口是不是爱逛小程序
      recommendGoods: [],
    };
  },

  computed: {
    ...mapState([
      'showRecommend',
    ]),
  },

  created() {
    if (this.showRecommend) {
      this.getRecommendGoods();
    }
  },

  methods: {
    getRecommendGoods() {
      getRecommendGoods()
        .then(data => {
          if (data.goodsList) {
            this.recommendGoods = data.goodsList;
          }
        })
        .catch(err => {
          console.erorr(err);
          this.$store.commit('UPDATE_SHOW_RECOMMEND', false);
        });
    },
  },
};
</script>

<style lang="scss">
.block-recommend {
  padding-top: 12px;
}
</style>
